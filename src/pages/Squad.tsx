import { PlayerTable } from "../components/PlayerTable";
import type { Club, Player } from "../types/football";

interface SquadProps {
  club?: Club;
  players: Player[];
  onSelectPlayer: (playerId: string) => void;
}

export function Squad({ club, players, onSelectPlayer }: SquadProps) {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Squad</h1>
          <p>{club ? `${club.name} first-team database` : "Select a club to view a squad."}</p>
        </div>
      </div>
      {club ? <PlayerTable players={players} onSelect={onSelectPlayer} /> : <div className="empty">No active club.</div>}
    </section>
  );
}
