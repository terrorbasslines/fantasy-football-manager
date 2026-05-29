import type { Player } from "../types/football";
import { formatCurrency } from "../utils/format";
import { Miniface } from "./Miniface";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <article className="player-card">
      <Miniface src={player.minifacePath} name={player.displayName} size="lg" />
      <div>
        <h3>{player.displayName}</h3>
        <p>{player.position} · {player.nationality} · {player.age}</p>
        <div className="metric-grid">
          <span><strong>{player.overall}</strong><small>Overall</small></span>
          <span><strong>{player.potential}</strong><small>Potential</small></span>
          <span><strong>{player.fitness}%</strong><small>Fitness</small></span>
          <span><strong>{formatCurrency(player.value)}</strong><small>Value</small></span>
        </div>
      </div>
    </article>
  );
}
