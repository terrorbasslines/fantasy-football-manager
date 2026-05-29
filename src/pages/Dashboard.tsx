import { Play, ShieldCheck } from "lucide-react";
import { ClubBadge } from "../components/ClubBadge";
import type { Club, Fixture, InboxMessage, LeagueTableRow } from "../types/football";

interface DashboardProps {
  currentClub?: Club;
  opponent?: Club;
  nextFixture?: Fixture;
  table: LeagueTableRow[];
  inbox: InboxMessage[];
  onNavigate: (view: "clubSelect" | "fixtures" | "leagueTable" | "inbox") => void;
  onSimulateNext: () => void;
}

export function Dashboard({ currentClub, opponent, nextFixture, table, inbox, onNavigate, onSimulateNext }: DashboardProps) {
  const rank = currentClub ? table.findIndex((row) => row.clubId === currentClub.id) + 1 : 0;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>{currentClub ? `${currentClub.shortName} career command center` : "Start by selecting a club."}</p>
        </div>
        {!currentClub && <button className="primary" onClick={() => onNavigate("clubSelect")}><ShieldCheck size={18} /> Select Club</button>}
      </div>

      <div className="dashboard-grid">
        <article className="panel focus-panel">
          <small>Next fixture</small>
          {currentClub && nextFixture && opponent ? (
            <>
              <h2>{nextFixture.homeClubId === currentClub.id ? "Home" : "Away"} vs {opponent.name}</h2>
              <p>Matchday {nextFixture.matchday}. Generate the report, commentary, and table update in one simulation.</p>
              <button className="primary" onClick={onSimulateNext}><Play size={18} /> Simulate Match</button>
            </>
          ) : (
            <>
              <h2>No active career</h2>
              <p>Choose Nickelodeon FC or Hondsberg FC to create fixtures and begin the season.</p>
            </>
          )}
        </article>

        <article className="panel stat-panel">
          <small>League position</small>
          <strong>{rank || "-"}</strong>
          <button onClick={() => onNavigate("leagueTable")}>View table</button>
        </article>

        <article className="panel stat-panel">
          <small>Unread inbox</small>
          <strong>{inbox.filter((message) => !message.read).length}</strong>
          <button onClick={() => onNavigate("inbox")}>Open inbox</button>
        </article>

        <article className="panel">
          <small>Club identity</small>
          {currentClub ? (
            <>
              <h3><ClubBadge club={currentClub} /></h3>
              <p>{currentClub.tacticalIdentity}</p>
              <p>{currentClub.stadiumName} · {currentClub.stadiumCapacity.toLocaleString()} seats</p>
            </>
          ) : (
            <p>No board has hired you yet.</p>
          )}
        </article>
      </div>
    </section>
  );
}
