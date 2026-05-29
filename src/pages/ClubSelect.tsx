import { ShieldCheck, Plus, Sparkles } from "lucide-react";
import { ClubBadge } from "../components/ClubBadge";
import type { Club } from "../types/football";
import { formatCurrency } from "../utils/format";

interface ClubSelectProps {
  clubs: Club[];
  currentClubId?: string;
  onStartCareer: (clubId: string) => void;
  onNavigateToCreate: () => void;
}

export function ClubSelect({ clubs, currentClubId, onStartCareer, onNavigateToCreate }: ClubSelectProps) {
  // Let user pick Eredivisie teams or the custom user club
  const playable = clubs.filter((club) => club.leagueId === "eredivisie" || club.id === "user-club");

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Club Select</h1>
          <p>Choose an established Dutch Eredivisie giant or create your own club from the bottom tier!</p>
        </div>
      </div>

      {/* Prominent Custom Club Builder */}
      <div className="custom-club-promo panel">
        <div className="promo-details">
          <div className="promo-badge"><Sparkles size={16} /> NEW FEATURE</div>
          <h2>Rise from the Grassroots</h2>
          <p>Establish a custom brand with a personalized logo, custom club colors, small starting budget (€50,000) and low-OVR players. Enter the Derde Divisie and battle your way up the Dutch football pyramid!</p>
        </div>
        <button className="primary btn-large" onClick={onNavigateToCreate}>
          <Plus size={18} /> Create Your Own Club
        </button>
      </div>

      <div className="club-grid">
        {playable.map((club) => (
          <article key={club.id} className="club-card" style={{ borderLeft: `5px solid ${club.primaryColor}` }}>
            <div className="club-card-header">
              <ClubBadge club={club} />
              <div>
                <h2>{club.name}</h2>
                <p className="muted">{club.city}, {club.country}</p>
              </div>
            </div>
            <dl>
              <div>
                <dt>Reputation</dt>
                <dd><span className={`rep-badge ${club.reputation.toLowerCase()}`}>{club.reputation}</span></dd>
              </div>
              <div>
                <dt>Starting Budget</dt>
                <dd><strong>{formatCurrency(club.budget)}</strong></dd>
              </div>
              <div>
                <dt>Stadium</dt>
                <dd>{club.stadiumName} ({club.stadiumCapacity.toLocaleString()} seats)</dd>
              </div>
              <div>
                <dt>Division</dt>
                <dd>
                  <span className="badge">
                    {club.leagueId === "eredivisie" ? "Tier 1 - Eredivisie" : "Tier 4 - Derde Divisie"}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Identity</dt>
                <dd className="tactical-identity-desc">{club.tacticalIdentity}</dd>
              </div>
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
