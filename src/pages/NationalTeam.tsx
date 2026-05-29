import type { Club, Player } from "../types/football";

interface Props {
  players: Player[];
  clubs: Club[];
  currentClubId?: string;
}

const NATIONAL_TEAMS: Record<string, { flag: string; name: string }> = {
  Netherlands: { flag: "🇳🇱", name: "Netherlands" },
  Germany: { flag: "🇩🇪", name: "Germany" },
  Belgium: { flag: "🇧🇪", name: "Belgium" },
  France: { flag: "🇫🇷", name: "France" },
  Spain: { flag: "🇪🇸", name: "Spain" },
  Portugal: { flag: "🇵🇹", name: "Portugal" },
  Brazil: { flag: "🇧🇷", name: "Brazil" },
  Italy: { flag: "🇮🇹", name: "Italy" },
  Denmark: { flag: "🇩🇰", name: "Denmark" },
  Sweden: { flag: "🇸🇪", name: "Sweden" },
  Norway: { flag: "🇳🇴", name: "Norway" },
  Morocco: { flag: "🇲🇦", name: "Morocco" },
  Ghana: { flag: "🇬🇭", name: "Ghana" },
  Turkey: { flag: "🇹🇷", name: "Turkey" },
  Japan: { flag: "🇯🇵", name: "Japan" },
  Mexico: { flag: "🇲🇽", name: "Mexico" },
};

export function NationalTeam({ players, clubs, currentClubId }: Props) {
  // Players from the current club who have a national team
  const clubPlayers = players.filter((p) => p.clubId === currentClubId && p.nationalTeam);
  // Group by national team
  const byNation: Record<string, Player[]> = {};
  clubPlayers.forEach((p) => {
    const nt = p.nationalTeam!;
    if (!byNation[nt]) byNation[nt] = [];
    byNation[nt].push(p);
  });

  // All players with NT across all clubs (for scouting context)
  const allNtPlayers = players.filter((p) => p.nationalTeam === "Netherlands");

  const currentClub = clubs.find((c) => c.id === currentClubId);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>National Teams</h1>
          <p>Your players on international duty</p>
        </div>
      </div>

      {Object.keys(byNation).length === 0 && (
        <div className="panel">
          <div className="empty">
            No players from {currentClub?.name ?? "your club"} are in a national team yet.<br />
            Sign Dutch or international players to build your international presence.
          </div>
        </div>
      )}

      {Object.entries(byNation).map(([nation, nPlayers]) => {
        const info = NATIONAL_TEAMS[nation];
        return (
          <div key={nation} className="panel nt-panel">
            <div className="nt-header">
              <span className="nt-flag">{info?.flag ?? "🏳️"}</span>
              <div>
                <h2>{info?.name ?? nation}</h2>
                <p className="muted">{nPlayers.length} player{nPlayers.length > 1 ? "s" : ""} from {currentClub?.shortName}</p>
              </div>
            </div>
            <table className="player-table">
              <thead>
                <tr><th>Name</th><th>Pos</th><th>OVR</th><th>Age</th><th>Fitness</th><th>Status</th></tr>
              </thead>
              <tbody>
                {nPlayers.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.displayName}</strong></td>
                    <td><span className="pos-badge">{p.position}</span></td>
                    <td><span className="ovr-badge">{p.overall}</span></td>
                    <td>{p.age}</td>
                    <td>
                      <div className="mini-fitness-bar">
                        <div style={{ width: `${p.fitness}%`, background: p.fitness >= 80 ? "#22c55e" : "#f59e0b" }} />
                      </div>
                      {p.fitness}%
                    </td>
                    <td><span className={`status-badge ${p.injuryStatus === "Fit" ? "green" : "yellow"}`}>{p.injuryStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Netherlands national team overview */}
      <div className="panel">
        <h2>🇳🇱 Netherlands – All Eligible Players in Database</h2>
        <p className="muted">Dutch players across all clubs available for national selection</p>
        <table className="player-table">
          <thead>
            <tr><th>Name</th><th>Club</th><th>Pos</th><th>OVR</th><th>Age</th></tr>
          </thead>
          <tbody>
            {allNtPlayers.sort((a, b) => b.overall - a.overall).slice(0, 20).map((p) => {
              const club = clubs.find((c) => c.id === p.clubId);
              return (
                <tr key={p.id} className={p.clubId === currentClubId ? "user-row" : ""}>
                  <td><strong>{p.displayName}</strong></td>
                  <td>
                    <span className="club-dot" style={{ background: club?.primaryColor ?? "#888" }} />
                    {club?.shortName ?? p.clubId}
                    {p.clubId === currentClubId && <span className="you-badge">YOUR PLAYER</span>}
                  </td>
                  <td><span className="pos-badge">{p.position}</span></td>
                  <td><span className="ovr-badge">{p.overall}</span></td>
                  <td>{p.age}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
