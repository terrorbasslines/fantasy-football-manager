import type { Fixture, League, Cup, CupRound, EuropeanCompetition, EuropeanGroup, LeagueTableRow } from "../types/football";

export function generateFixtures(league: League): Fixture[] {
  const teams = [...league.teamIds];
  if (teams.length % 2 !== 0) teams.push("bye");

  const rounds = teams.length - 1;
  const half = teams.length / 2;
  const rotation = [...teams];
  const fixtures: Fixture[] = [];

  for (let round = 0; round < rounds; round += 1) {
    for (let i = 0; i < half; i += 1) {
      const home = rotation[i];
      const away = rotation[rotation.length - 1 - i];
      if (home === "bye" || away === "bye") continue;
      const flip = round % 2 === 1;
      fixtures.push({
        id: `md${round + 1}-${flip ? away : home}-${flip ? home : away}`,
        matchday: round + 1,
        homeClubId: flip ? away : home,
        awayClubId: flip ? home : away,
        played: false,
        competitionId: league.id,
        competitionName: league.name,
      });
    }
    const fixed = rotation[0];
    const rest = rotation.slice(1);
    rest.unshift(rest.pop()!);
    rotation.splice(0, rotation.length, fixed, ...rest);
  }

  const reverseFixtures = fixtures.map((fixture) => ({
    ...fixture,
    id: `md${fixture.matchday + rounds}-${fixture.awayClubId}-${fixture.homeClubId}`,
    matchday: fixture.matchday + rounds,
    homeClubId: fixture.awayClubId,
    awayClubId: fixture.homeClubId,
    played: false,
    result: undefined,
  }));

  return [...fixtures, ...reverseFixtures];
}

export function initializeCup(id: string, name: string, shortName: string, country: string, teamIds: string[]): Cup {
  // Select power of 2 number of teams (e.g. 16, 32 or 64)
  let limit = 32;
  if (teamIds.length >= 64) limit = 64;
  else if (teamIds.length >= 32) limit = 32;
  else if (teamIds.length >= 16) limit = 16;
  else limit = 8;

  const powerOf2Teams = teamIds.slice(0, limit);
  // Shuffle for random drawing
  const shuffled = [...powerOf2Teams].sort(() => Math.random() - 0.5);
  const firstRoundFixtures: Fixture[] = [];
  const matchesCount = shuffled.length / 2;

  for (let i = 0; i < matchesCount; i++) {
    const home = shuffled[i * 2];
    const away = shuffled[i * 2 + 1];
    firstRoundFixtures.push({
      id: `cup-${id}-r1-${i}`,
      matchday: 1,
      homeClubId: home,
      awayClubId: away,
      played: false,
      competitionId: id,
      competitionName: name,
    });
  }

  const roundNames = limit === 64
    ? ["Round of 64", "Round of 32", "Round of 16", "Quarter Finals", "Semi Finals", "Final"]
    : limit === 32
    ? ["Round of 32", "Round of 16", "Quarter Finals", "Semi Finals", "Final"]
    : ["Round of 16", "Quarter Finals", "Semi Finals", "Final"];

  const rounds: CupRound[] = roundNames.map((rName, idx) => ({
    id: `${id}-round-${idx + 1}`,
    name: rName,
    fixtures: idx === 0 ? firstRoundFixtures : [],
    completed: false,
  }));

  return {
    id,
    name,
    shortName,
    country,
    type: "cup",
    currentRound: 1,
    rounds,
    teamIds: powerOf2Teams,
  };
}

export function advanceCupRound(cup: Cup): Cup {
  const currentRoundIdx = cup.currentRound - 1;
  const currentRound = cup.rounds[currentRoundIdx];
  if (!currentRound || currentRound.fixtures.some((f) => !f.played)) return cup;

  const nextRoundIdx = cup.currentRound;
  if (nextRoundIdx >= cup.rounds.length) {
    // Cup completed
    return {
      ...cup,
      rounds: cup.rounds.map((r, idx) => idx === currentRoundIdx ? { ...r, completed: true } : r),
    };
  }

  // Find winners of current round
  const winners: string[] = [];
  currentRound.fixtures.forEach((fixture) => {
    if (fixture.result) {
      if (fixture.result.homeGoals > fixture.result.awayGoals) {
        winners.push(fixture.homeClubId);
      } else if (fixture.result.awayGoals > fixture.result.homeGoals) {
        winners.push(fixture.awayClubId);
      } else {
        // Draw penalty shoot-out simulation – pick random winner
        winners.push(Math.random() < 0.5 ? fixture.homeClubId : fixture.awayClubId);
      }
    }
  });

  // Generate fixtures for next round
  const shuffledWinners = [...winners].sort(() => Math.random() - 0.5);
  const nextFixtures: Fixture[] = [];
  const matchesCount = shuffledWinners.length / 2;

  for (let i = 0; i < matchesCount; i++) {
    nextFixtures.push({
      id: `cup-${cup.id}-r${nextRoundIdx + 1}-${i}`,
      matchday: nextRoundIdx + 1,
      homeClubId: shuffledWinners[i * 2],
      awayClubId: shuffledWinners[i * 2 + 1],
      played: false,
      competitionId: cup.id,
      competitionName: cup.name,
    });
  }

  const updatedRounds = cup.rounds.map((r, idx) => {
    if (idx === currentRoundIdx) {
      return { ...r, completed: true };
    }
    if (idx === nextRoundIdx) {
      return { ...r, fixtures: nextFixtures };
    }
    return r;
  });

  return {
    ...cup,
    currentRound: nextRoundIdx + 1,
    rounds: updatedRounds,
  };
}

export function initializeEuropeanCompetition(
  id: string,
  name: string,
  shortName: string,
  qualifiedTeams: string[],
): EuropeanCompetition {
  const teams = [...qualifiedTeams];
  if (teams.length < 32) {
    const pool = ["fc-munchen", "dortmund-city", "leipzig-rb", "bayer-le", "real-mad", "fc-barca", "atletico-mad", "sevilla-cf", "city-fc", "united-fc", "arsenal-fc", "chelsea-fc", "liverpool-fc", "spurs-fc", "psg-fc", "marseille-om", "juventus-fc", "inter-milan", "ac-milan", "as-roma", "benfica-sl", "porto-fc", "sporting-cp", "anderlecht", "club-brugge", "galatasaray", "fenerbahce", "celtic-fc", "rangers-fc", "salzburg-rb", "dinamo-zagreb"];
    for (const tId of pool) {
      if (!teams.includes(tId) && teams.length < 32) {
        teams.push(tId);
      }
    }
  }

  // Shuffle and divide into 8 groups of 4
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  const groups: EuropeanGroup[] = [];
  const alphabet = "ABCDEFGH";

  for (let g = 0; g < 8; g++) {
    const groupTeamIds = shuffled.slice(g * 4, g * 4 + 4);
    const groupLeague: League = {
      id: `${id}-group-${alphabet[g]}`,
      name: `${name} Group ${alphabet[g]}`,
      country: "Europe",
      teamIds: groupTeamIds,
      promotionRules: "Top 2 qualify for Knockouts",
      relegationRules: "None",
      pointsForWin: 3, pointsForDraw: 1, pointsForLoss: 0,
      playoffSpot: 0,
      type: "european",
      tier: 0,
    };
    const groupFixtures = generateFixtures(groupLeague);
    groupFixtures.forEach((f) => {
      f.competitionId = id;
      f.competitionName = `${shortName} Group ${alphabet[g]}`;
    });

    groups.push({
      groupId: alphabet[g],
      teamIds: groupTeamIds,
      fixtures: groupFixtures,
      table: groupTeamIds.map((tId) => ({
        clubId: tId, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, form: [],
      })),
    });
  }

  const knockoutRounds: CupRound[] = [
    { id: `${id}-r16`, name: "Round of 16", fixtures: [], completed: false },
    { id: `${id}-qf`, name: "Quarter Finals", fixtures: [], completed: false },
    { id: `${id}-sf`, name: "Semi Finals", fixtures: [], completed: false },
    { id: `${id}-final`, name: "Final", fixtures: [], completed: false },
  ];

  return {
    id,
    name,
    shortName,
    type: "european",
    phase: "group",
    groups,
    knockoutRounds,
    qualifiedTeamIds: teams,
    season: "2026/27",
  };
}

export function advanceEuropeanRound(euro: EuropeanCompetition): EuropeanCompetition {
  if (euro.phase === "complete") return euro;

  if (euro.phase === "group") {
    // Check if group fixtures are completed
    const allGroupCompleted = euro.groups.every((g) => g.fixtures.every((f) => f.played));
    if (!allGroupCompleted) return euro;

    // Pick top 2 from each group for Round of 16
    const qualifiers: string[] = [];
    euro.groups.forEach((group) => {
      const sortedTable = [...group.table].sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
      qualifiers.push(sortedTable[0].clubId, sortedTable[1].clubId);
    });

    // Generate Round of 16 fixtures (1st vs 2nd, random)
    const shuffledQualifiers = [...qualifiers].sort(() => Math.random() - 0.5);
    const r16Fixtures: Fixture[] = [];
    for (let i = 0; i < 8; i++) {
      r16Fixtures.push({
        id: `euro-${euro.id}-r16-${i}`,
        matchday: 1,
        homeClubId: shuffledQualifiers[i * 2],
        awayClubId: shuffledQualifiers[i * 2 + 1],
        played: false,
        competitionId: euro.id,
        competitionName: `${euro.shortName} Round of 16`,
      });
    }

    return {
      ...euro,
      phase: "r16",
      knockoutRounds: euro.knockoutRounds.map((r) => r.id.endsWith("-r16") ? { ...r, fixtures: r16Fixtures } : r),
    };
  }

  // Knockout phases
  const phaseOrder: ("r16" | "qf" | "sf" | "final" | "complete")[] = ["r16", "qf", "sf", "final", "complete"];
  const currentIdx = phaseOrder.indexOf(euro.phase as any);
  const currentPhase = euro.phase;
  const currentRound = euro.knockoutRounds.find((r) => r.id.endsWith(currentPhase));

  if (!currentRound || currentRound.fixtures.some((f) => !f.played)) return euro;

  const nextPhase = phaseOrder[currentIdx + 1];
  if (nextPhase === "complete") {
    return {
      ...euro,
      phase: "complete",
      knockoutRounds: euro.knockoutRounds.map((r) => r.id.endsWith(currentPhase) ? { ...r, completed: true } : r),
    };
  }

  // Find winners of current knockout phase
  const winners: string[] = [];
  currentRound.fixtures.forEach((fixture) => {
    if (fixture.result) {
      if (fixture.result.homeGoals > fixture.result.awayGoals) {
        winners.push(fixture.homeClubId);
      } else if (fixture.result.awayGoals > fixture.result.homeGoals) {
        winners.push(fixture.awayClubId);
      } else {
        winners.push(Math.random() < 0.5 ? fixture.homeClubId : fixture.awayClubId);
      }
    }
  });

  // Generate fixtures for the next phase
  const nextFixtures: Fixture[] = [];
  const matchesCount = winners.length / 2;
  const shuffledWinners = [...winners].sort(() => Math.random() - 0.5);

  for (let i = 0; i < matchesCount; i++) {
    nextFixtures.push({
      id: `euro-${euro.id}-${nextPhase}-${i}`,
      matchday: 1,
      homeClubId: shuffledWinners[i * 2],
      awayClubId: shuffledWinners[i * 2 + 1],
      played: false,
      competitionId: euro.id,
      competitionName: `${euro.shortName} ${nextPhase.toUpperCase()}`,
    });
  }

  return {
    ...euro,
    phase: nextPhase as any,
    knockoutRounds: euro.knockoutRounds.map((r) => {
      if (r.id.endsWith(currentPhase)) return { ...r, completed: true };
      if (r.id.endsWith(nextPhase)) return { ...r, fixtures: nextFixtures };
      return r;
    }),
  };
}
