import type { Club, MatchEvent, MatchResult, Player, Tactics } from "../types/football";

interface TeamContext {
  club: Club;
  players: Player[];
  tactics?: Tactics;
  overall: number;
  attack: number;
  midfield: number;
  defence: number;
  goalkeeper: number;
  morale: number;
  fitness: number;
  form: number;
}

const attackPositions = new Set(["ST", "LW", "RW", "CAM", "LM", "RM"]);
const midfieldPositions = new Set(["CDM", "CM", "CAM", "RM", "LM"]);
const defencePositions = new Set(["RB", "CB", "LB", "RWB", "LWB", "CDM"]);

export function simulateMatch(
  fixtureId: string,
  homeClub: Club,
  awayClub: Club,
  players: Player[],
  tactics: Tactics[],
  formByClub: Record<string, number> = {},
): MatchResult {
  const home = createTeamContext(homeClub, players, tactics, formByClub[homeClub.id] ?? 0.5);
  const away = createTeamContext(awayClub, players, tactics, formByClub[awayClub.id] ?? 0.5);

  const homeStrength = scoreTeam(home, true);
  const awayStrength = scoreTeam(away, false);
  const homeGoals = goalsFromStrength(homeStrength, away.defence + away.goalkeeper / 2);
  const awayGoals = goalsFromStrength(awayStrength, home.defence + home.goalkeeper / 2);
  const homePossession = clamp(Math.round(50 + (home.midfield - away.midfield) * 0.42 + tacticPossession(home) - tacticPossession(away)), 38, 64);
  const awayPossession = 100 - homePossession;
  const homeShots = clamp(Math.round(6 + home.attack / 10 + homeGoals * 2 + randomInt(0, 5)), 4, 24);
  const awayShots = clamp(Math.round(5 + away.attack / 11 + awayGoals * 2 + randomInt(0, 5)), 3, 22);
  const homeShotsOnTarget = clamp(Math.round(homeShots * (0.32 + home.attack / 300)), homeGoals, homeShots);
  const awayShotsOnTarget = clamp(Math.round(awayShots * (0.3 + away.attack / 320)), awayGoals, awayShots);

  const scorers = [
    ...pickGoalScorers(home, homeGoals),
    ...pickGoalScorers(away, awayGoals),
  ].sort((a, b) => a.minute - b.minute);
  const assists = scorers
    .filter(() => Math.random() > 0.18)
    .map((goal) => ({
      playerId: pickAssistProvider(goal.clubId === home.club.id ? home.players : away.players, goal.playerId)?.id ?? goal.playerId,
      clubId: goal.clubId,
      minute: goal.minute,
    }));

  const yellowCards = [...pickCards(home, "yellow"), ...pickCards(away, "yellow")].sort((a, b) => a.minute - b.minute);
  const redCards = [...pickCards(home, "red"), ...pickCards(away, "red")].sort((a, b) => a.minute - b.minute);
  const injuries = [...pickInjuries(home), ...pickInjuries(away)].sort((a, b) => a.minute - b.minute);
  const substitutions = [...pickSubstitutions(home), ...pickSubstitutions(away)].sort((a, b) => a.minute - b.minute);
  const commentary = createCommentary(home, away, homeGoals, awayGoals, scorers, yellowCards, injuries);

  return {
    fixtureId,
    homeClubId: home.club.id,
    awayClubId: away.club.id,
    homeGoals,
    awayGoals,
    scorers,
    assists,
    yellowCards,
    redCards,
    injuries,
    substitutions,
    stats: {
      homePossession,
      awayPossession,
      homeShots,
      awayShots,
      homeShotsOnTarget,
      awayShotsOnTarget,
      homeCorners: clamp(Math.round(homeShots / 4 + randomInt(0, 4)), 0, 12),
      awayCorners: clamp(Math.round(awayShots / 4 + randomInt(0, 4)), 0, 12),
      homeFouls: clamp(8 + randomInt(0, 9) + (home.tactics?.pressingIntensity === "High" ? 2 : 0), 4, 24),
      awayFouls: clamp(8 + randomInt(0, 9) + (away.tactics?.pressingIntensity === "High" ? 2 : 0), 4, 24),
    },
    matchRating: Number((6.4 + (homeGoals + awayGoals) * 0.28 + Math.random() * 1.1).toFixed(1)),
    commentary,
  };
}

function createTeamContext(club: Club, allPlayers: Player[], tactics: Tactics[], form: number): TeamContext {
  const players = allPlayers.filter((player) => player.clubId === club.id);
  const activePlayers = players.length > 0 ? players : createPlaceholderSquad(club.id);
  const rating = (filter: (player: Player) => boolean, fallback: number) => average(activePlayers.filter(filter).map((player) => player.overall), fallback);
  const reputationBonus = club.reputation === "Elite" ? 6 : club.reputation === "High" ? 3 : club.reputation === "Balanced" ? 0 : -2;
  return {
    club,
    players: activePlayers,
    tactics: tactics.find((entry) => entry.clubId === club.id),
    overall: average(activePlayers.map((player) => player.overall), 72) + reputationBonus,
    attack: rating((player) => attackPositions.has(player.position), 72) + reputationBonus,
    midfield: rating((player) => midfieldPositions.has(player.position), 72) + reputationBonus,
    defence: rating((player) => defencePositions.has(player.position), 72) + reputationBonus,
    goalkeeper: rating((player) => player.position === "GK", 72) + reputationBonus,
    morale: average(activePlayers.map((player) => moraleScore(player.morale)), 70),
    fitness: average(activePlayers.map((player) => player.fitness), 90),
    form,
  };
}

function scoreTeam(team: TeamContext, isHome: boolean): number {
  const tacticBonus =
    (team.tactics?.mentality === "Attacking" ? 4 : team.tactics?.mentality === "Defensive" ? -2 : 0) +
    (team.tactics?.tempo === "Fast" ? 2 : 0) +
    (team.tactics?.counterAttack ? 1.5 : 0);
  return team.attack * 0.48 + team.midfield * 0.24 + team.overall * 0.16 + team.morale * 0.06 + team.fitness * 0.04 + team.form * 3 + tacticBonus + (isHome ? 5 : 0) + Math.random() * 12;
}

function goalsFromStrength(attackStrength: number, defensiveStrength: number): number {
  const chance = clamp((attackStrength - defensiveStrength * 0.63) / 18, 0.35, 3.1);
  let goals = 0;
  for (let i = 0; i < 5; i += 1) {
    if (Math.random() < chance / (3.7 + i * 0.9)) goals += 1;
  }
  return clamp(goals, 0, 6);
}

function pickGoalScorers(team: TeamContext, goals: number) {
  const likely = [...team.players].sort((a, b) => scoringWeight(b) - scoringWeight(a)).slice(0, 9);
  return Array.from({ length: goals }, () => {
    const player = weightedPick(likely, scoringWeight);
    return { playerId: player.id, clubId: team.club.id, minute: randomInt(4, 90) };
  });
}

function createCommentary(
  home: TeamContext,
  away: TeamContext,
  homeGoals: number,
  awayGoals: number,
  scorers: { playerId: string; clubId: string; minute: number }[],
  yellowCards: { playerId: string; clubId: string; minute: number }[],
  injuries: { playerId: string; clubId: string; minute: number }[],
): MatchEvent[] {
  const events: MatchEvent[] = [
    { minute: 1, type: "commentary", text: `${home.club.name} get us underway at ${home.club.stadiumName}.` },
    { minute: 7, type: "commentary", text: `${home.club.name} start aggressively, moving the ball quickly through midfield.` },
    { minute: 18, type: "commentary", text: `${away.club.name} look dangerous whenever they can break beyond the first press.` },
    { minute: 42, type: "commentary", text: `The match tightens before half-time as both midfields fight for control.` },
    { minute: 76, type: "commentary", text: `The tempo drops as tired legs start to shape the final phase.` },
  ];

  scorers.forEach((goal) => {
    const player = [...home.players, ...away.players].find((item) => item.id === goal.playerId);
    const scoringClub = goal.clubId === home.club.id ? home.club : away.club;
    const scoreText = goal.clubId === home.club.id ? `${homeGoals}-${awayGoals}` : `${homeGoals}-${awayGoals}`;
    events.push({
      minute: goal.minute,
      type: "goal",
      clubId: goal.clubId,
      playerId: goal.playerId,
      text: `GOAL! ${player?.displayName ?? "A forward"} finds space and finishes for ${scoringClub.name}. Current score: ${scoreText}.`,
    });
  });

  yellowCards.forEach((card) => {
    const player = [...home.players, ...away.players].find((item) => item.id === card.playerId);
    events.push({ minute: card.minute, type: "card", clubId: card.clubId, playerId: card.playerId, text: `${player?.displayName ?? "A player"} is booked after stopping a transition.` });
  });

  injuries.forEach((injury) => {
    const player = [...home.players, ...away.players].find((item) => item.id === injury.playerId);
    events.push({ minute: injury.minute, type: "injury", clubId: injury.clubId, playerId: injury.playerId, text: `${player?.displayName ?? "A player"} needs treatment and may not be fully fit after this match.` });
  });

  events.push({ minute: 90, type: "commentary", text: `Full time: ${home.club.name} ${homeGoals}-${awayGoals} ${away.club.name}.` });
  return events.sort((a, b) => a.minute - b.minute);
}

function pickCards(team: TeamContext, kind: "yellow" | "red") {
  const count = kind === "yellow" ? randomInt(0, team.tactics?.pressingIntensity === "High" ? 4 : 3) : Math.random() > 0.9 ? 1 : 0;
  return Array.from({ length: count }, () => {
    const player = weightedPick(team.players, (item) => (defencePositions.has(item.position) ? 4 : 1));
    return { playerId: player.id, clubId: team.club.id, minute: randomInt(12, 88) };
  });
}

function pickInjuries(team: TeamContext) {
  const count = Math.random() > 0.86 ? 1 : 0;
  return Array.from({ length: count }, () => {
    const player = weightedPick(team.players, (item) => Math.max(1, 105 - item.fitness));
    return { playerId: player.id, clubId: team.club.id, minute: randomInt(20, 82) };
  });
}

function pickSubstitutions(team: TeamContext) {
  const starters = team.players.slice(0, 11);
  const bench = team.players.slice(11);
  if (bench.length < 3) return [];
  return [63, 72, 81].map((minute, index) => ({
    offPlayerId: starters[randomInt(5, Math.min(10, starters.length - 1))].id,
    onPlayerId: bench[index % bench.length].id,
    clubId: team.club.id,
    minute,
  }));
}

function pickAssistProvider(players: Player[], scorerId: string) {
  return weightedPick(players.filter((player) => player.id !== scorerId), (player) => (midfieldPositions.has(player.position) ? 5 : attackPositions.has(player.position) ? 3 : 1));
}

function scoringWeight(player: Player): number {
  const positionWeight = player.position === "ST" ? 8 : player.position === "LW" || player.position === "RW" ? 5 : player.position === "CAM" ? 4 : 1;
  return positionWeight + player.overall / 20;
}

function tacticPossession(team: TeamContext): number {
  return (team.tactics?.passingStyle === "Short" ? 4 : team.tactics?.passingStyle === "Direct" ? -3 : 0) + (team.tactics?.mentality === "Attacking" ? 2 : 0);
}

function moraleScore(morale: Player["morale"]): number {
  return { Excellent: 92, Good: 82, Okay: 72, Low: 58, Poor: 44 }[morale];
}

function average(values: number[], fallback: number): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedPick<T>(items: T[], weight: (item: T) => number): T {
  const safeItems = items.length ? items : ([] as T[]);
  const total = safeItems.reduce((sum, item) => sum + Math.max(1, weight(item)), 0);
  let threshold = Math.random() * total;
  for (const item of safeItems) {
    threshold -= Math.max(1, weight(item));
    if (threshold <= 0) return item;
  }
  return safeItems[safeItems.length - 1];
}

function createPlaceholderSquad(clubId: string): Player[] {
  const positions = ["GK", "RB", "CB", "CB", "LB", "CDM", "CM", "CAM", "RW", "LW", "ST"] as const;
  return positions.map((position, index) => ({
    id: `${clubId}-placeholder-${index}`,
    firstName: "Squad",
    lastName: `${index + 1}`,
    displayName: `Squad Player ${index + 1}`,
    age: 25,
    nationality: "Dutch",
    clubId,
    position,
    secondaryPositions: [],
    overall: 69 + (index % 5),
    potential: 72 + (index % 5),
    value: 2500000,
    wage: 12000,
    contractUntil: "2028-06-30",
    preferredFoot: "Right",
    height: "1.82 m",
    bodyType: "Balanced",
    morale: "Okay",
    fitness: 92,
    sharpness: 74,
    injuryStatus: "Fit",
    traits: [],
    personality: "Professional",
    minifacePath: "",
    stats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0,
      averageRating: 0,
      injuries: 0,
      minutesPlayed: 0,
    },
  }));
}
