import { ShieldCheck } from "lucide-react";
import { ClubBadge } from "../components/ClubBadge";
import type { Club } from "../types/football";
import { formatCurrency } from "../utils/format";

interface ClubSelectProps {
  clubs: Club[];
  currentClubId?: string;
  onStartCareer: (clubId: string) => void;
}

export function ClubSelect({ clubs, currentClubId, onStartCareer }: ClubSelectProps) {
  const playable = clubs.filter((club) => club.id === "nickelodeon-fc" || club.id === "hondsberg-fc");
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Club Select</h1>
          <p>Select one of the two custom clubs and begin a text-based career.</p>
        </div>
      </div>
      <div className="club-grid">
        {playable.map((club) => (
          <article key={club.id} className="club-card">
            <ClubBadge club={club} />
            <h2>{club.name}</h2>
            <p>{club.city}, {club.country}</p>
            <dl>
              <div><dt>Reputation</dt><dd>{club.reputation}</dd></div>
              <div><dt>Budget</dt><dd>{formatCurrency(club.budget)}</dd></div>
              <div><dt>Stadium</dt><dd>{club.stadiumName}</dd></div>
              <div><dt>Identity</dt><dd>{club.tacticalIdentity}</dd></div>
            </dl>
            <button className="primary" onClick={() => onStartCareer(club.id)}>
              <ShieldCheck size={18} /> {currentClubId === club.id ? "Restart Career" : "Start Career"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
