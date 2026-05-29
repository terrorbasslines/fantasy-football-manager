import type { Club, MatchResult } from "../types/football";

export function LiveMatch({ result, clubs }: { result?: MatchResult; clubs: Club[] }) {
  const home = result ? clubs.find((club) => club.id === result.homeClubId) : undefined;
  const away = result ? clubs.find((club) => club.id === result.awayClubId) : undefined;
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Live Match Text Commentary</h1>
          <p>{result ? `${home?.name} vs ${away?.name}` : "Simulate a match to populate the live text feed."}</p>
        </div>
      </div>
      <div className="panel commentary-panel">
        {result ? (
          <ol className="commentary">
            {result.commentary.map((event, index) => <li key={`${event.minute}-${index}`} className={event.type}>{event.minute}' {event.text}</li>)}
          </ol>
        ) : (
          <div className="empty">No live text yet.</div>
        )}
      </div>
    </section>
  );
}
