import type { Club, Player } from "../types/football";

export function evaluateTransferOffer(player: Player, buyingClub: Club, offer: number): { accepted: boolean; reason: string } {
  if (buyingClub.budget < offer) return { accepted: false, reason: "The buying club cannot fund this offer." };
  if (offer >= player.value * 1.18) return { accepted: true, reason: "The selling club accepts a strong offer." };
  if (player.age >= 30 && offer >= player.value * 0.9) return { accepted: true, reason: "The club accepts fair value for an older player." };
  return { accepted: false, reason: "The selling club wants a higher fee." };
}
