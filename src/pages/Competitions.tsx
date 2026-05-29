import { useState } from "react";
import type { Club, League, LeagueTableRow } from "../types/football";
import { buildTableFromFixtures } from "../engine/leagueTable";
import type { Fixture } from "../types/football";

interface Props {
  leagues: League[];
  clubs: Club[];
  allFixtures: Fixture[];
  currentClubId?: string;
}

export function Competitions({ leagues, clubs, allFixtures, currentClubId }: Props) {
  const [activeTab, setActiveTab] = useState<"leagues" | "cups" | "european">("leagues");
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>("eredivisie");

  const dutchLeagues = leagues.filter((l) => l.type === "league" && l.country === "Netherlands");
  const cups = leagues.filter((l) => l.type === "cup");
  const european = leagues.filter((l) => l.type === "european");

  function getClub(id: string) { return clubs.find((c) => c.id === id); }

  function renderTable(league: League) {
    const leagueFixtures = allFixtures.filter((f) => f.competitionId === league.id || league.teamIds.includes(f.homeClubId));
    const leagueClubs = clubs.filter((c) => league.teamIds.includes(c.id));
    const rows: LeagueTableRow[] = buildTableFromFixtures(leagueClubs, leagueFixtures);

    const europeanSpots = league.europeanSpots ?? 0;
    const promotionSpots = league.tier > 1 ? 2 : 0;
    const relegationStart = league.teamIds.length - 2;

    return (
      <div className="competition-table">
        <table className="league-table">
          <thead>
            <tr>
              <th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th>
              <th>GF</th><th>GA</th><th>GD</th><th>Pts</th><th>Form</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const club = getClub(row.clubId);
              const pos = idx + 1;
              const rowClass =
                pos <= promotionSpots ? "promotion-spot" :
                pos <= promotionSpots + europeanSpots ? "european-spot" :
                pos > relegationStart ? "relegation-spot" : "";
              const isUser = row.clubId === currentClubId;
              return (
                <tr key={row.clubId} className={`${rowClass} ${isUser ? "user-row" : ""}`}>
                  <td><span className="pos-num">{pos}</span></td>
                  <td>
                    <span className="club-dot" style={{ background: club?.primaryColor ?? "#888" }} />
                    {club?.name ?? row.clubId}
                    {isUser && <span className="you-badge">YOU</span>}
                  </td>
                  <td>{row.played}</td><td>{row.won}</td><td>{row.drawn}</td><td>{row.lost}</td>
                  <td>{row.goalsFor}</td><td>{row.goalsAgainst}</td>
                  <td className={row.goalDifference > 0 ? "positive" : row.goalDifference < 0 ? "negative" : ""}>{row.goalDifference > 0 ? "+" : ""}{row.goalDifference}</td>
                  <td><strong>{row.points}</strong></td>
                  <td>
                    <span className="form-row">
                      {row.form.slice(-5).map((r, i) => (
                        <span key={i} className={`form-dot form-${r}`}>{r}</span>
                      ))}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <div className="empty">No results yet – matches haven't been played.</div>}
        <div className="legend">
          {promotionSpots > 0 && <span className="legend-item promotion-spot">Promotion</span>}
          {europeanSpots > 0 && <span className="legend-item european-spot">European</span>}
          <span className="legend-item relegation-spot">Relegation</span>
        </div>
      </div>
    );
  }

  const selectedLeague = leagues.find((l) => l.id === selectedLeagueId);

  return (
    <section className="page">
      <div className="page-heading">
        <div><h1>Competitions</h1><p>Dutch pyramid + European competitions</p></div>
      </div>

      <div className="comp-tabs">
        <button className={activeTab === "leagues" ? "active" : ""} onClick={() => setActiveTab("leagues")}>🏆 Leagues</button>
        <button className={activeTab === "cups" ? "active" : ""} onClick={() => setActiveTab("cups")}>🥇 Cups</button>
        <button className={activeTab === "european" ? "active" : ""} onClick={() => setActiveTab("european")}>🌍 European</button>
      </div>

      <div className="comp-layout">
        {/* Sidebar list */}
        <div className="comp-sidebar">
          {activeTab === "leagues" && dutchLeagues.map((l) => (
            <button key={l.id} className={`comp-nav-item ${selectedLeagueId === l.id ? "active" : ""}`} onClick={() => setSelectedLeagueId(l.id)}>
              <span className="tier-badge">T{l.tier}</span>
              {l.shortName ?? l.name}
            </button>
          ))}
          {activeTab === "cups" && cups.map((l) => (
            <button key={l.id} className={`comp-nav-item ${selectedLeagueId === l.id ? "active" : ""}`} onClick={() => setSelectedLeagueId(l.id)}>
              {l.name}
            </button>
          ))}
          {activeTab === "european" && european.map((l) => (
            <button key={l.id} className={`comp-nav-item ${selectedLeagueId === l.id ? "active" : ""}`} onClick={() => setSelectedLeagueId(l.id)}>
              {l.shortName ?? l.name}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="comp-content">
          {selectedLeague ? (
            <>
              <div className="comp-header">
                <h2>{selectedLeague.name}</h2>
                <div className="comp-meta">
                  <span>{selectedLeague.country}</span>
                  <span>{selectedLeague.teamIds.length} teams</span>
                  {selectedLeague.europeanSpots && <span>🌍 {selectedLeague.europeanSpots} European spots</span>}
                </div>
                <p className="muted">{selectedLeague.promotionRules}</p>
              </div>

              {(activeTab === "leagues") && renderTable(selectedLeague)}

              {activeTab === "cups" && (
                <div className="cup-bracket">
                  <p className="muted">Cup bracket will populate as rounds are played. All Dutch clubs participate in the KNVB Beker.</p>
                  <div className="empty">Cup fixtures are generated at season start.</div>
                </div>
              )}

              {activeTab === "european" && (
                <div>
                  <p className="muted">European competition starts if your club qualifies from the Eredivisie. The top 2 enter the Champions League, 3rd Europa League, 4th-5th Conference League.</p>
                  <div className="empty">Qualify from the Eredivisie to participate.</div>
                </div>
              )}
            </>
          ) : (
            <div className="empty">Select a competition from the left.</div>
          )}
        </div>
      </div>
    </section>
  );
}
