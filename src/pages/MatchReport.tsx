import type { Club, MatchResult, Player } from "../types/football";

interface MatchReportProps {
  result?: MatchResult;
  clubs: Club[];
  players: Player[];
}

export function MatchReport({ result, clubs, players }: MatchReportProps) {
  if (!result) {
    return <section className="page"><div className="empty">No match report yet. Simulate a fixture first.</div></section>;
  }
  const home = clubs.find((club) => club.id === result.homeClubId);
  const away = clubs.find((club) => club.id === result.awayClubId);
  const playerName = (id: string) => players.find((player) => player.id === id)?.displayName ?? "Generated player";

  return (
    <section className="page">
      <div className="match-hero">
        <span>Full Time</span>
        <h1>{home?.name} {result.homeGoals}-{result.awayGoals} {away?.name}</h1>
        <p>Match rating {result.matchRating}</p>
      </div>
      <div className="report-grid">
        <article className="panel">
          <h3>Events</h3>
          <ul className="event-list">
            {result.scorers.map((goal) => <li key={`${goal.minute}-${goal.playerId}`}>{goal.minute}' GOAL · {playerName(goal.playerId)}</li>)}
            {result.yellowCards.map((card) => <li key={`${card.minute}-${card.playerId}`}>{card.minute}' Yellow card · {playerName(card.playerId)}</li>)}
            {result.redCards.map((card) => <li key={`${card.minute}-${card.playerId}`}>{card.minute}' Red card · {playerName(card.playerId)}</li>)}
            {result.injuries.map((injury) => <li key={`${injury.minute}-${injury.playerId}`}>{injury.minute}' Injury · {playerName(injury.playerId)}</li>)}
          </ul>
        </article>
        <article className="panel">
          <h3>Match Stats</h3>
          <dl className="stats-list">
            <div><dt>Possession</dt><dd>{result.stats.homePossession}% - {result.stats.awayPossession}%</dd></div>
            <div><dt>Shots</dt><dd>{result.stats.homeShots} - {result.stats.awayShots}</dd></div>
            <div><dt>On target</dt><dd>{result.stats.homeShotsOnTarget} - {result.stats.awayShotsOnTarget}</dd></div>
            <div><dt>Corners</dt><dd>{result.stats.homeCorners} - {result.stats.awayCorners}</dd></div>
            <div><dt>Fouls</dt><dd>{result.stats.homeFouls} - {result.stats.awayFouls}</dd></div>
          </dl>
        </article>
        <article className="panel commentary-panel">
          <h3>Minute-by-Minute Commentary</h3>
          <ol className="commentary">
            {result.commentary.map((event, index) => (
              <li key={`${event.minute}-${index}`} className={event.type}>{event.minute}' {event.text}</li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}
