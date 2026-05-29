import type { Club, Fixture } from "../types/football";

export function MatchPreview({ fixture, clubs }: { fixture?: Fixture; clubs: Club[] }) {
  const home = fixture ? clubs.find((club) => club.id === fixture.homeClubId) : undefined;
  const away = fixture ? clubs.find((club) => club.id === fixture.awayClubId) : undefined;
  return (
    <section className="page">
      <div className="page-heading"><div><h1>Match Preview</h1><p>{fixture ? `Matchday ${fixture.matchday}` : "No upcoming fixture."}</p></div></div>
      {fixture && <article className="panel focus-panel"><h2>{home?.name} vs {away?.name}</h2><p>{home?.stadiumName}</p><p>{home?.tacticalIdentity} faces {away?.tacticalIdentity.toLowerCase()}.</p></article>}
    </section>
  );
}
