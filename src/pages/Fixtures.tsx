import { Play } from "lucide-react";
import type { Club, Fixture } from "../types/football";

interface FixturesProps {
  fixtures: Fixture[];
  clubs: Club[];
  currentClubId?: string;
  onSimulate: (fixtureId: string) => void;
}

export function Fixtures({ fixtures, clubs, currentClubId, onSimulate }: FixturesProps) {
  const visible = currentClubId ? fixtures.filter((fixture) => fixture.homeClubId === currentClubId || fixture.awayClubId === currentClubId) : fixtures;
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Fixtures</h1>
          <p>Double round-robin schedule. Simulate the next unplayed match from here.</p>
        </div>
      </div>
      <div className="fixture-list">
        {visible.slice(0, 34).map((fixture) => {
          const home = clubs.find((club) => club.id === fixture.homeClubId);
          const away = clubs.find((club) => club.id === fixture.awayClubId);
          return (
            <article key={fixture.id} className="fixture-row">
              <span>MD {fixture.matchday}</span>
              <strong>{home?.shortName} vs {away?.shortName}</strong>
              <span>{fixture.played && fixture.result ? `${fixture.result.homeGoals}-${fixture.result.awayGoals}` : "Unplayed"}</span>
              {!fixture.played && <button onClick={() => onSimulate(fixture.id)}><Play size={16} /> Sim</button>}
            </article>
          );
        })}
      </div>
    </section>
  );
}
