import type { Club, DatabaseState } from "../types/football";
import { clubs as clubSeed } from "./clubs";
import { players } from "./players";
import { leagues } from "./leagues";
import { tactics } from "./tactics";

export function createStarterDatabase(): DatabaseState {
  const squadByClub = players.reduce<Record<string, string[]>>((acc, player) => {
    acc[player.clubId] = [...(acc[player.clubId] ?? []), player.id];
    return acc;
  }, {});

  const clubs: Club[] = clubSeed.map((club) => ({
    ...club,
    squadIds: squadByClub[club.id] ?? [],
  }));

  return {
    clubs,
    players: players.map((player) => ({ ...player, stats: { ...player.stats } })),
    leagues: leagues.map((league) => ({ ...league, teamIds: [...league.teamIds] })),
    tactics: tactics.map((entry) => ({ ...entry })),
  };
}
