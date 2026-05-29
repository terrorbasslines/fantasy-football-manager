import type { Club, Fixture, LiveMatchState, MatchEvent, Player, Tactics } from "../types/football";

// ── Helpers ──────────────────────────────────────────────────────────────────
function rnd(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

const attackPos = new Set(["ST", "LW", "RW", "CAM", "LM", "RM"]);
const midPos = new Set(["CM", "CAM", "CDM", "LM", "RM"]);
const defPos = new Set(["GK", "CB", "RB", "LB", "RWB", "LWB", "CDM"]);

function teamStrength(players: Player[], isHome: boolean, tactics?: Tactics): number {
  const avg = (filter: (p: Player) => boolean, fallback: number) => {
    const vals = players.filter(filter).map((p) => p.overall);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : fallback;
  };
  const att = avg((p) => attackPos.has(p.position), 65);
  const mid = avg((p) => midPos.has(p.position), 65);
  const def = avg((p) => defPos.has(p.position), 65);
  const avgFit = players.length ? players.reduce((a, p) => a + p.fitness, 0) / players.length : 80;
  const tacBonus =
    (tactics?.mentality === "Attacking" ? 4 : tactics?.mentality === "Defensive" ? -2 : 0) +
    (tactics?.tempo === "Fast" ? 2 : 0) +
    (tactics?.counterAttack ? 1.5 : 0);
  return att * 0.45 + mid * 0.3 + def * 0.2 + avgFit * 0.04 + tacBonus + (isHome ? 4 : 0);
}

function goalChancePerMinute(att: number, def: number): number {
  return clamp((att - def * 0.65) / 350, 0.005, 0.045);
}

function weightedPick<T>(items: T[], weight: (item: T) => number): T {
  const total = items.reduce((s, i) => s + Math.max(1, weight(i)), 0);
  let r = Math.random() * total;
  for (const item of items) { r -= Math.max(1, weight(item)); if (r <= 0) return item; }
  return items[items.length - 1];
}

function scoringWeight(p: Player): number {
  return (p.position === "ST" ? 8 : p.position === "LW" || p.position === "RW" ? 5 : p.position === "CAM" ? 4 : 1) + p.overall / 20;
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Initialise a live match session */
export function startLiveMatch(
  fixture: Fixture,
  allPlayers: Player[],
  allTactics: Tactics[],
): LiveMatchState {
  const homePlayers = allPlayers.filter((p) => p.clubId === fixture.homeClubId && p.injuryStatus !== "Injured");
  const awayPlayers = allPlayers.filter((p) => p.clubId === fixture.awayClubId && p.injuryStatus !== "Injured");
  const sorted = (pl: Player[]) => [...pl].sort((a, b) => b.overall - a.overall);
  const homeS = sorted(homePlayers);
  const awayS = sorted(awayPlayers);
  return {
    fixture,
    homeClubId: fixture.homeClubId,
    awayClubId: fixture.awayClubId,
    currentMinute: 0,
    homeGoals: 0,
    awayGoals: 0,
    events: [{
      minute: 0, type: "commentary",
      text: `⚽ Kick-off! The match is underway.`,
    }],
    substitutionsUsed: { home: 0, away: 0 },
    homeLineup: homeS.slice(0, 11).map((p) => p.id),
    awayLineup: awayS.slice(0, 11).map((p) => p.id),
    homeBench: homeS.slice(11, 18).map((p) => p.id),
    awayBench: awayS.slice(11, 18).map((p) => p.id),
    homeTactics: allTactics.find((t) => t.clubId === fixture.homeClubId),
    awayTactics: allTactics.find((t) => t.clubId === fixture.awayClubId),
    isFinished: false,
    pendingEvents: [],
  };
}

/** Advance the live match by `minutes` minutes */
export function advanceLiveMatch(
  state: LiveMatchState,
  minutes: number,
  allPlayers: Player[],
): LiveMatchState {
  if (state.isFinished) return state;
  const newMinute = Math.min(90, state.currentMinute + minutes);
  const events: MatchEvent[] = [];
  let homeGoals = state.homeGoals;
  let awayGoals = state.awayGoals;

  const homePlayers = allPlayers.filter((p) => state.homeLineup.includes(p.id));
  const awayPlayers = allPlayers.filter((p) => state.awayLineup.includes(p.id));
  const homeStr = teamStrength(homePlayers, true, state.homeTactics);
  const awayStr = teamStrength(awayPlayers, false, state.awayTactics);

  const homeChance = goalChancePerMinute(homeStr, awayStr);
  const awayChance = goalChancePerMinute(awayStr, homeStr);

  const commentaryPool = [
    "The home side enjoy a spell of pressure.",
    "A long ball over the top is comfortably dealt with.",
    "The visiting side are looking for openings on the flanks.",
    "Both teams fighting hard in midfield.",
    "A free kick goes high and wide.",
    "Great one-two near the box, but no final shot.",
    "The goalkeeper comes to claim a cross comfortably.",
    "A corner comes to nothing under pressure.",
    "Tempers flair briefly after a late challenge.",
    "Substitutions are being warmed up on the touchline.",
    "The crowd urges the home side forward.",
    "The visitors look dangerous on the counter.",
  ];

  for (let m = state.currentMinute + 1; m <= newMinute; m++) {
    // Random commentary (~every 8 minutes)
    if (m % 8 === 0) {
      events.push({
        minute: m, type: "commentary",
        text: commentaryPool[rnd(0, commentaryPool.length - 1)],
      });
    }

    // Half-time
    if (m === 45) {
      events.push({ minute: 45, type: "commentary", text: `🔔 Half-time: ${homeGoals}-${awayGoals}. Time to make adjustments.` });
    }

    // Goals
    if (Math.random() < homeChance && homePlayers.length > 0) {
      homeGoals++;
      const scorer = weightedPick(homePlayers, scoringWeight);
      events.push({ minute: m, type: "goal", clubId: state.homeClubId, playerId: scorer.id, text: `⚽ GOAL! ${scorer.displayName} puts the home side ahead! ${homeGoals}-${awayGoals}` });
    }
    if (Math.random() < awayChance && awayPlayers.length > 0) {
      awayGoals++;
      const scorer = weightedPick(awayPlayers, scoringWeight);
      events.push({ minute: m, type: "goal", clubId: state.awayClubId, playerId: scorer.id, text: `⚽ GOAL! ${scorer.displayName} equalises for the visitors! ${homeGoals}-${awayGoals}` });
    }

    // Yellow cards (~5% per 15 min span)
    if (m % 15 === 0 && Math.random() < 0.2) {
      const team = Math.random() < 0.5 ? "home" : "away";
      const pool = team === "home" ? homePlayers : awayPlayers;
      if (pool.length > 0) {
        const carded = weightedPick(pool, (p) => defPos.has(p.position) ? 3 : 1);
        events.push({ minute: m, type: "card", clubId: team === "home" ? state.homeClubId : state.awayClubId, playerId: carded.id, text: `🟨 ${carded.displayName} is booked.` });
      }
    }

    // Injuries (~2% per 20 min span)
    if (m % 20 === 0 && Math.random() < 0.08) {
      const team = Math.random() < 0.5 ? "home" : "away";
      const pool = team === "home" ? homePlayers : awayPlayers;
      if (pool.length > 0) {
        const hurt = weightedPick(pool, (p) => Math.max(1, 105 - p.fitness));
        events.push({ minute: m, type: "injury", clubId: team === "home" ? state.homeClubId : state.awayClubId, playerId: hurt.id, text: `🚑 ${hurt.displayName} is down injured. A substitution may be needed.` });
      }
    }
  }

  const isFinished = newMinute >= 90;
  if (isFinished) {
    events.push({ minute: 90, type: "commentary", text: `⏱ Full Time! Final score: ${homeGoals}-${awayGoals}` });
  }

  return {
    ...state,
    currentMinute: newMinute,
    homeGoals,
    awayGoals,
    events: [...state.events, ...events.sort((a, b) => a.minute - b.minute)],
    isFinished,
  };
}

/** Make a substitution during a live match */
export function makeLiveSubstitution(
  state: LiveMatchState,
  isHome: boolean,
  offPlayerId: string,
  onPlayerId: string,
): LiveMatchState {
  const side = isHome ? "home" : "away";
  if (state.substitutionsUsed[side] >= 3) return state; // max 3 subs
  if (state.isFinished) return state;

  const lineup = isHome ? [...state.homeLineup] : [...state.awayLineup];
  const bench = isHome ? [...state.homeBench] : [...state.awayBench];
  const offIdx = lineup.indexOf(offPlayerId);
  const onIdx = bench.indexOf(onPlayerId);
  if (offIdx === -1 || onIdx === -1) return state;

  lineup[offIdx] = onPlayerId;
  bench.splice(onIdx, 1);

  const subEvent: MatchEvent = {
    minute: state.currentMinute,
    type: "substitution",
    clubId: isHome ? state.homeClubId : state.awayClubId,
    text: `🔄 Substitution at ${state.currentMinute}'. Manager makes a change.`,
  };

  return {
    ...state,
    homeLineup: isHome ? lineup : state.homeLineup,
    awayLineup: isHome ? state.awayLineup : lineup,
    homeBench: isHome ? bench : state.homeBench,
    awayBench: isHome ? state.awayBench : bench,
    substitutionsUsed: { ...state.substitutionsUsed, [side]: state.substitutionsUsed[side] + 1 },
    events: [...state.events, subEvent],
  };
}

/** Change tactics mid-match (user club only) */
export function changeLiveTactics(
  state: LiveMatchState,
  isHome: boolean,
  newTactics: Tactics,
): LiveMatchState {
  const tacticsEvent: MatchEvent = {
    minute: state.currentMinute,
    type: "tactical",
    text: `📋 Tactical change at ${state.currentMinute}' – switching to ${newTactics.formation} (${newTactics.mentality}).`,
  };
  return {
    ...state,
    homeTactics: isHome ? newTactics : state.homeTactics,
    awayTactics: isHome ? state.awayTactics : newTactics,
    events: [...state.events, tacticsEvent],
  };
}

/** Simulate the rest of the match instantly */
export function simulateLiveToEnd(state: LiveMatchState, allPlayers: Player[]): LiveMatchState {
  let current = state;
  while (!current.isFinished) {
    current = advanceLiveMatch(current, 5, allPlayers);
  }
  return current;
}

/** Convert a finished LiveMatchState into a MatchResult for saving */
export function liveStateToResult(state: LiveMatchState): import("../types/football").MatchResult {
  const scorers = state.events
    .filter((e) => e.type === "goal" && e.playerId && e.clubId)
    .map((e) => ({ playerId: e.playerId!, clubId: e.clubId!, minute: e.minute }));
  const yellowCards = state.events
    .filter((e) => e.type === "card" && e.playerId && e.clubId)
    .map((e) => ({ playerId: e.playerId!, clubId: e.clubId!, minute: e.minute }));
  const injuries = state.events
    .filter((e) => e.type === "injury" && e.playerId && e.clubId)
    .map((e) => ({ playerId: e.playerId!, clubId: e.clubId!, minute: e.minute }));

  return {
    fixtureId: state.fixture.id,
    homeClubId: state.homeClubId,
    awayClubId: state.awayClubId,
    homeGoals: state.homeGoals,
    awayGoals: state.awayGoals,
    scorers,
    assists: [],
    yellowCards,
    redCards: [],
    injuries,
    substitutions: [],
    stats: {
      homePossession: 50, awayPossession: 50,
      homeShots: state.homeGoals * 3 + rnd(2, 8),
      awayShots: state.awayGoals * 3 + rnd(1, 7),
      homeShotsOnTarget: state.homeGoals + rnd(1, 4),
      awayShotsOnTarget: state.awayGoals + rnd(0, 3),
      homeCorners: rnd(2, 8), awayCorners: rnd(1, 7),
      homeFouls: rnd(6, 16), awayFouls: rnd(5, 14),
    },
    matchRating: Number((6 + (state.homeGoals + state.awayGoals) * 0.3 + Math.random()).toFixed(1)),
    commentary: state.events,
  };
}
