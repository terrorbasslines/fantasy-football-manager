import type { Player } from "../types/football";
import { formatCurrency } from "../utils/format";

export function Transfers({ players }: { players: Player[] }) {
  const available = players.filter((player) => player.age >= 27 || player.overall < 76).slice(0, 12);
  return (
    <section className="page">
      <div className="page-heading"><div><h1>Transfers</h1><p>MVP shortlist for offers, free agents, loans, and contracts in later expansion.</p></div></div>
      <div className="table-wrap">
        <table><thead><tr><th>Player</th><th>Pos</th><th>OVR</th><th>Age</th><th>Value</th><th>Status</th></tr></thead>
          <tbody>{available.map((player) => <tr key={player.id}><td><strong>{player.displayName}</strong></td><td>{player.position}</td><td>{player.overall}</td><td>{player.age}</td><td>{formatCurrency(player.value)}</td><td>Available</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
