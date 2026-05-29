import type { Player } from "../types/football";
import { formatCurrency } from "../utils/format";
import { Miniface } from "./Miniface";

interface PlayerTableProps {
  players: Player[];
  onSelect: (playerId: string) => void;
}

export function PlayerTable({ players, onSelect }: PlayerTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Pos</th>
            <th>Age</th>
            <th>OVR</th>
            <th>POT</th>
            <th>Morale</th>
            <th>Fitness</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} onClick={() => onSelect(player.id)}>
              <td>
                <span className="player-cell">
                  <Miniface src={player.minifacePath} name={player.displayName} size="sm" />
                  <span>
                    <strong>{player.displayName}</strong>
                    <small>{player.role ?? player.nationality}</small>
                  </span>
                </span>
              </td>
              <td>{player.position}</td>
              <td>{player.age}</td>
              <td className="rating">{player.overall}</td>
              <td>{player.potential}</td>
              <td>{player.morale}</td>
              <td>{player.fitness}%</td>
              <td>{formatCurrency(player.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
