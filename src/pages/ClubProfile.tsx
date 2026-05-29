import type { Club, Player } from "../types/football";
import { formatCurrency } from "../utils/format";

export function ClubProfile({ club, players }: { club?: Club; players: Player[] }) {
  if (!club) return <section className="page"><div className="empty">Select a club first.</div></section>;
  return (
    <section className="page">
      <div className="page-heading"><div><h1>{club.name}</h1><p>{club.city}, {club.country}</p></div></div>
      <div className="profile-grid">
        <article className="panel"><h3>Club</h3><p>{club.tacticalIdentity}</p><p>{club.stadiumName} · {club.stadiumCapacity.toLocaleString()} seats</p></article>
        <article className="panel"><h3>Finance</h3><p>{formatCurrency(club.budget)} budget</p><p>{club.reputation} reputation</p></article>
        <article className="panel"><h3>Squad</h3><p>{players.length} registered players</p><p>Average overall {Math.round(players.reduce((sum, player) => sum + player.overall, 0) / players.length)}</p></article>
      </div>
    </section>
  );
}
