import { useState } from "react";
import type { Club, Player, TransferOffer } from "../types/football";
import { formatCurrency } from "../utils/format";
import { evaluateTransferOffer } from "../engine/transfers";
import { Search, DollarSign, ArrowRight, Shield, CheckCircle, XCircle } from "lucide-react";

interface Props {
  players: Player[];
  clubs: Club[];
  currentClub?: Club;
  onMakeOffer: (playerId: string, amount: number) => { accepted: boolean; reason: string };
  transferWindowOpen: boolean;
  offers: TransferOffer[];
}

export function Transfers({ players, clubs, currentClub, onMakeOffer, transferWindowOpen, offers }: Props) {
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("ALL");
  const [bidPlayer, setBidPlayer] = useState<Player | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (!currentClub) {
    return (
      <section className="page">
        <div className="page-heading">
          <div>
            <h1>Transfers</h1>
            <p>Select a club to unlock the transfer market.</p>
          </div>
        </div>
        <div className="panel empty">No active career. Go to Club Select to begin.</div>
      </section>
    );
  }

  // Filter out players already at user's club
  const candidates = players.filter((p) => p.clubId !== currentClub.id);

  const filtered = candidates.filter((p) => {
    const matchesSearch = p.displayName.toLowerCase().includes(search.toLowerCase());
    const matchesPos = posFilter === "ALL" || p.position === posFilter;
    return matchesSearch && matchesPos;
  });

  function getClub(id: string) {
    return clubs.find((c) => c.id === id);
  }

  function handleBidInit(player: Player) {
    setBidPlayer(player);
    setBidAmount(Math.round(player.value * 1.05));
    setFeedback(null);
  }

  function handleBidSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bidPlayer) return;

    if (bidAmount > currentClub!.budget) {
      setFeedback({ type: "error", message: `You cannot afford this! Your remaining budget is ${formatCurrency(currentClub!.budget)}.` });
      return;
    }

    const res = onMakeOffer(bidPlayer.id, bidAmount);
    if (res.accepted) {
      setFeedback({ type: "success", message: `Deal Agreed! ${bidPlayer.displayName} has joined ${currentClub!.shortName}. Fee: ${formatCurrency(bidAmount)}` });
      setBidPlayer(null);
    } else {
      setFeedback({ type: "error", message: `Offer Rejected: ${res.reason}` });
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Transfer Market</h1>
          <p>Scout players and negotiate transfers during active windows</p>
        </div>
        <div className={`save-pill ${transferWindowOpen ? "window-open" : "window-closed"}`} style={{ borderColor: transferWindowOpen ? "#22c55e" : "#ef4444" }}>
          {transferWindowOpen ? "🔓 Transfer Window Open" : "🔒 Transfer Window Closed"}
        </div>
      </div>

      <div className="transfers-layout">
        {/* Main scout list */}
        <div className="transfers-main">
          <div className="panel transfers-search-panel">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search players by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-row">
              <select value={posFilter} onChange={(e) => setPosFilter(e.target.value)}>
                <option value="ALL">All Positions</option>
                {["GK", "RB", "CB", "LB", "CDM", "CM", "CAM", "RW", "LW", "ST"].map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              <div className="budget-display">
                <small>Club Budget:</small>
                <strong>{formatCurrency(currentClub.budget)}</strong>
              </div>
            </div>
          </div>

          {feedback && (
            <div className={`panel notice ${feedback.type === "success" ? "success" : "danger"}`}>
              {feedback.type === "success" ? <CheckCircle size={20} color="#22c55e" /> : <XCircle size={20} color="#ef4444" />}
              <div>
                <strong>{feedback.type === "success" ? "Transfer Completed!" : "Negotiation Failed"}</strong>
                <p>{feedback.message}</p>
              </div>
            </div>
          )}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Club</th>
                  <th>Pos</th>
                  <th>OVR</th>
                  <th>Age</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 30).map((player) => {
                  const club = getClub(player.clubId);
                  return (
                    <tr key={player.id}>
                      <td>
                        <div className="player-cell">
                          <div className="miniface miniface-sm">
                            {player.minifacePath ? <img src={player.minifacePath} alt={player.displayName} /> : "👤"}
                          </div>
                          <div>
                            <strong>{player.displayName}</strong>
                            <small>{player.nationality}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {club ? (
                          <div className="club-badge">
                            <span className="club-dot" style={{ background: club.primaryColor }} />
                            <span>{club.shortName}</span>
                          </div>
                        ) : (
                          player.clubId
                        )}
                      </td>
                      <td><span className="pos-badge">{player.position}</span></td>
                      <td><span className="ovr-badge">{player.overall}</span></td>
                      <td>{player.age}</td>
                      <td><strong>{formatCurrency(player.value)}</strong></td>
                      <td>
                        <button
                          className="primary"
                          onClick={() => handleBidInit(player)}
                          disabled={!transferWindowOpen}
                          title={!transferWindowOpen ? "Transfer window is closed" : "Make transfer offer"}
                        >
                          <DollarSign size={14} /> Bid
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="empty">No players matched your scouting criteria.</div>}
          </div>
        </div>

        {/* Negotiations Side Panel */}
        <div className="transfers-sidebar">
          {bidPlayer && (
            <form className="panel negotiation-panel" onSubmit={handleBidSubmit}>
              <h3>🤝 Negotiating with {getClub(bidPlayer.clubId)?.shortName}</h3>
              <div className="target-player-card">
                <div className="miniface miniface-md" style={{ margin: "0 auto 10px" }}>
                  {bidPlayer.minifacePath ? <img src={bidPlayer.minifacePath} alt={bidPlayer.displayName} /> : "👤"}
                </div>
                <h4>{bidPlayer.displayName}</h4>
                <p className="muted">{bidPlayer.position} · OVR {bidPlayer.overall} · Age {bidPlayer.age}</p>
                <div className="detail-row">
                  <span>Market Value:</span>
                  <strong>{formatCurrency(bidPlayer.value)}</strong>
                </div>
              </div>

              <div className="form-group">
                <label>Your Transfer Offer *</label>
                <input
                  type="number"
                  min={100}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  required
                />
              </div>

              <div className="offer-valuation">
                <small>Recommended Bid: 118% of value to guarantee acceptance</small>
                <strong>{formatCurrency(Math.round(bidPlayer.value * 1.18))}</strong>
              </div>

              <div className="action-row">
                <button type="submit" className="primary btn-large">⚽ Submit Offer</button>
                <button type="button" onClick={() => setBidPlayer(null)}>Cancel</button>
              </div>
            </form>
          )}

          <div className="panel">
            <h3>📈 Transfer Activity</h3>
            {offers.length === 0 ? (
              <p className="muted">No recent transfer bids or negotiations.</p>
            ) : (
              <div className="transfer-offer-list">
                {offers.slice().reverse().map((offer) => {
                  const player = players.find((p) => p.id === offer.playerId);
                  return (
                    <div key={offer.id} className="transfer-activity-row">
                      <strong>{player?.displayName}</strong>
                      <div>
                        <span>Fee: {formatCurrency(offer.amount)}</span>
                        <span className={`status-badge ${offer.status === "accepted" ? "green" : offer.status === "rejected" ? "red" : "yellow"}`}>
                          {offer.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
