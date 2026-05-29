import type { Club, LeagueTableRow } from "../types/football";

export function LeagueTable({ table, clubs }: { table: LeagueTableRow[]; clubs: Club[] }) {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>League Table</h1>
          <p>Spotify Super Liga standings. 16th enters playoff, bottom two go down.</p>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th><th>Form</th></tr>
          </thead>
          <tbody>
            {table.map((row, index) => {
              const club = clubs.find((item) => item.id === row.clubId);
              return (
                <tr key={row.clubId} className={index >= 16 ? "danger-row" : index === 15 ? "warning-row" : ""}>
                  <td>{index + 1}</td>
                  <td><strong>{club?.name ?? row.clubId}</strong></td>
                  <td>{row.played}</td>
                  <td>{row.won}</td>
                  <td>{row.drawn}</td>
                  <td>{row.lost}</td>
                  <td>{row.goalsFor}</td>
                  <td>{row.goalsAgainst}</td>
                  <td>{row.goalDifference}</td>
                  <td className="rating">{row.points}</td>
                  <td>{row.form.join(" ") || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
