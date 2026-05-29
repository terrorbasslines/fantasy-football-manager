import type { Player, TrainingFocus } from "../types/football";

const STAT_BOOSTS: Record<TrainingFocus, Partial<Record<string, number>>> = {
  fitness: { fitness: 6, sharpness: 2 },
  attack: { sharpness: 3, overall: 0.1 },
  defence: { sharpness: 2, overall: 0.05 },
  "set-pieces": { sharpness: 2 },
  youth: { overall: 0.15, potential: 0.1 },
  rest: { fitness: 8 },
};

/**
 * Apply a training session to a squad.
 * Only players who are Fit participate.
 */
export function trainPlayers(
  players: Player[],
  clubId: string,
  focus: TrainingFocus,
): Player[] {
  const boosts = STAT_BOOSTS[focus];
  return players.map((player) => {
    if (player.clubId !== clubId) return player;
    if (player.injuryStatus === "Injured") return player;

    const updates: Partial<Player> = {};

    const fitnessBoost = (boosts["fitness"] as number | undefined) ?? 0;
    const sharpnessBoost = (boosts["sharpness"] as number | undefined) ?? 0;
    const ovrBoost = (boosts["overall"] as number | undefined) ?? 0;

    if (fitnessBoost) {
      updates.fitness = Math.min(99, player.fitness + fitnessBoost);
    }
    if (sharpnessBoost) {
      updates.sharpness = Math.min(99, player.sharpness + sharpnessBoost);
    }

    // Long-term OVR gain for youth focus only
    if (ovrBoost && focus === "youth" && player.age <= 23) {
      updates.overall = Math.min(player.potential, player.overall + (Math.random() < ovrBoost ? 1 : 0));
    } else if (ovrBoost && focus === "attack") {
      const attackPositions = new Set(["ST", "LW", "RW", "CAM"]);
      if (attackPositions.has(player.position)) {
        updates.overall = Math.min(player.potential, player.overall + (Math.random() < ovrBoost ? 1 : 0));
      }
    } else if (ovrBoost && focus === "defence") {
      const defencePositions = new Set(["GK", "CB", "RB", "LB", "CDM"]);
      if (defencePositions.has(player.position)) {
        updates.overall = Math.min(player.potential, player.overall + (Math.random() < ovrBoost ? 1 : 0));
      }
    }

    // Injury risk on heavy training
    const injuryRisk = focus === "fitness" ? 0.04 : focus === "attack" ? 0.02 : 0;
    if (injuryRisk > 0 && Math.random() < injuryRisk && player.fitness < 75) {
      updates.injuryStatus = "Doubtful";
    }

    return { ...player, ...updates };
  });
}

/**
 * Recover all doubtful/injured players slightly over a rest period.
 */
export function recoverPlayers(players: Player[], clubId: string): Player[] {
  return players.map((player) => {
    if (player.clubId !== clubId) return player;
    if (player.injuryStatus === "Injured") {
      return { ...player, fitness: Math.min(80, player.fitness + 5) };
    }
    if (player.injuryStatus === "Doubtful") {
      return { ...player, injuryStatus: "Fit", fitness: Math.min(90, player.fitness + 4) };
    }
    return player;
  });
}
