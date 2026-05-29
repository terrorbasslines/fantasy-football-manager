import { Download, Search, Upload } from "lucide-react";
import type { Club, Player } from "../types/football";
import { formatCurrency } from "../utils/format";

interface DatabaseEditorProps {
  players: Player[];
  clubs: Club[];
  query: string;
  setQuery: (value: string) => void;
  onExport: () => void;
  onImport: (file?: File) => void;
}

export function DatabaseEditor({ players, clubs, query, setQuery, onExport, onImport }: DatabaseEditorProps) {
  const filtered = players
    .filter((player) => player.displayName.toLowerCase().includes(query.toLowerCase()) || player.position.toLowerCase().includes(query.toLowerCase()) || player.nationality.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.overall - a.overall);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Database Editor</h1>
          <p>Search, sort, import, and export the local JSON-style database.</p>
        </div>
        <div className="action-row">
          <button onClick={onExport}><Download size={16} /> Export JSON</button>
          <label className="file-button"><Upload size={16} /> Import JSON<input type="file" accept="application/json,.json" onChange={(event) => onImport(event.target.files?.[0])} /></label>
        </div>
      </div>
      <label className="search-box">
        <Search size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by player, position, or nationality" />
      </label>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Player</th><th>Club</th><th>Pos</th><th>Age</th><th>OVR</th><th>POT</th><th>Value</th></tr></thead>
          <tbody>
            {filtered.map((player) => {
              const club = clubs.find((item) => item.id === player.clubId);
              return <tr key={player.id}><td><strong>{player.displayName}</strong></td><td>{club?.shortName}</td><td>{player.position}</td><td>{player.age}</td><td className="rating">{player.overall}</td><td>{player.potential}</td><td>{formatCurrency(player.value)}</td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
