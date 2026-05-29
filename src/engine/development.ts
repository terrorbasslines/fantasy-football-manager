import type { Player } from "../types/football";

export function applyMonthlyDevelopment(players: Player[]): Player[] {
  return players.map((player) => {
    const moraleBonus = player.morale === "Excellent" || player.morale === "Good" ? 0.45 : player.morale === "Low" || player.morale === "Poor" ? -0.25 : 0;
    const minutesBonus = player.stats.minutesPlayed > 450 ? 0.35 : 0;
    const injuryPenalty = player.injuryStatus === "Injured" ? -0.45 : 0;
    const ageCurve = player.age <= 23 ? 0.55 : player.age >= 31 ? -0.35 : 0.08;
    const delta = ageCurve + moraleBonus + minutesBonus + injuryPenalty;
    const shouldChange = Math.random() < Math.abs(delta);
    if (!shouldChange) return player;
    const direction = delta >= 0 ? 1 : -1;
    return {
      ...player,
      overall: Math.max(45, Math.min(player.potential, player.overall + direction)),
    };
  });
}
