import { ArrowLeft } from "lucide-react";
import { PlayerCard } from "../components/PlayerCard";
import type { Club, Player } from "../types/football";
import { formatCurrency } from "../utils/format";

interface PlayerProfileProps {
  player?: Player;
  club?: Club;
  onBack: () => void;
}

export function PlayerProfile({ player, club, onBack }: PlayerProfileProps) {
  if (!player) {
    return <section className="page"><button onClick={onBack}><ArrowLeft size={16} /> Back</button><div className="empty">Player not found.</div></section>;
  }

  return (
    <section className="page">
      <button onClick={onBack}><ArrowLeft size={16} /> Back to squad</button>
      <PlayerCard player={player} />
      <div className="profile-grid">
        <article className="panel">
          <h3>Profile</h3>
          <p>{club?.name} · {player.role ?? "Squad player"}</p>
          <dl className="detail-list">
            <div><dt>Preferred foot</dt><dd>{player.preferredFoot}</dd></div>
            <div><dt>Height</dt><dd>{player.height}</dd></div>
            <div><dt>Body type</dt><dd>{player.bodyType}</dd></div>
            <div><dt>Contract</dt><dd>{player.contractUntil}</dd></div>
            <div><dt>Wage</dt><dd>{formatCurrency(player.wage)}</dd></div>
          </dl>
        </article>
        <article className="panel">
          <h3>Traits</h3>
          <div className="tag-row">{player.traits.map((trait) => <span key={trait}>{trait}</span>)}</div>
          <p>{player.personality}</p>
        </article>
        <article className="panel">
          <h3>Season Stats</h3>
          <dl className="detail-list">
            <div><dt>Apps</dt><dd>{player.stats.appearances}</dd></div>
            <div><dt>Goals</dt><dd>{player.stats.goals}</dd></div>
            <div><dt>Assists</dt><dd>{player.stats.assists}</dd></div>
            <div><dt>Average rating</dt><dd>{player.stats.averageRating || "-"}</dd></div>
          </dl>
        </article>
      </div>
    </section>
  );
}
