import { useState } from "react";
import type { Club, Fixture, LiveMatchState, Player, Tactics } from "../types/football";
import {
  advanceLiveMatch,
  changeLiveTactics,
  makeLiveSubstitution,
  simulateLiveToEnd,
} from "../engine/liveMatchEngine";

interface Props {
  liveState?: LiveMatchState;
  clubs: Club[];
  players: Player[];
  tactics: Tactics[];
  userClubId?: string;
  onMatchFinished: (state: LiveMatchState) => void;
  onUpdateLiveState: (state: LiveMatchState) => void;
}

export function LiveMatch({ liveState, clubs, players, tactics, userClubId, onMatchFinished, onUpdateLiveState }: Props) {
  const [subOff, setSubOff] = useState("");
  const [subOn, setSubOn] = useState("");
  const [showTactics, setShowTactics] = useState(false);

  if (!liveState) {
    return (
      <section className="page">
        <div className="page-heading"><div><h1>Live Match</h1><p>Start a match from Fixtures or the Dashboard.</p></div></div>
        <div className="panel empty">No match in progress. Simulate or start a fixture from the Fixtures page.</div>
      </section>
    );
  }

  const homeClub = clubs.find((c) => c.id === liveState.homeClubId);
  const awayClub = clubs.find((c) => c.id === liveState.awayClubId);
  const isUserHome = liveState.homeClubId === userClubId;
  const isUserAway = liveState.awayClubId === userClubId;
  const isUserMatch = isUserHome || isUserAway;

  const userLineup = isUserHome ? liveState.homeLineup : liveState.awayLineup;
  const userBench = isUserHome ? liveState.homeBench : liveState.awayBench;
  const subsUsed = isUserHome ? liveState.substitutionsUsed.home : liveState.substitutionsUsed.away;
  const currentTactics = isUserHome ? liveState.homeTactics : liveState.awayTactics;

  const lineupPlayers = players.filter((p) => userLineup.includes(p.id));
  const benchPlayers = players.filter((p) => userBench.includes(p.id));

  function handleAdvance(mins: number) {
    const next = advanceLiveMatch(liveState!, mins, players);
    if (next.isFinished) { onMatchFinished(next); } else { onUpdateLiveState(next); }
  }

  function handleSimulateAll() {
    const finished = simulateLiveToEnd(liveState!, players);
    onMatchFinished(finished);
  }

  function handleSub() {
    if (!subOff || !subOn) return;
    const next = makeLiveSubstitution(liveState!, isUserHome, subOff, subOn);
    onUpdateLiveState(next);
    setSubOff(""); setSubOn("");
  }

  function handleTacticChange(key: keyof Tactics, value: string) {
    if (!currentTactics) return;
    const updated = { ...currentTactics, [key]: value } as Tactics;
    const next = changeLiveTactics(liveState!, isUserHome, updated);
    onUpdateLiveState(next);
  }

  const progressPct = Math.round((liveState.currentMinute / 90) * 100);
  const recentEvents = [...liveState.events].reverse().slice(0, 30);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Live Match</h1>
          <p>{homeClub?.name} vs {awayClub?.name}</p>
        </div>
        {!liveState.isFinished && (
          <div className="live-controls">
            <button className="btn-secondary" onClick={() => handleAdvance(1)}>▶ +1 min</button>
            <button className="btn-secondary" onClick={() => handleAdvance(5)}>▶▶ +5 min</button>
            <button className="btn-primary" onClick={handleSimulateAll}>⏭ Simulate to End</button>
          </div>
        )}
      </div>

      {/* Scoreboard */}
      <div className="panel live-scoreboard">
        <div className="scoreboard-team home">
          <span className="club-badge" style={{ background: homeClub?.primaryColor ?? "#666" }}>{homeClub?.shortName?.[0]}</span>
          <strong>{homeClub?.shortName ?? "Home"}</strong>
        </div>
        <div className="scoreboard-center">
          <div className="scoreboard-score">{liveState.homeGoals} – {liveState.awayGoals}</div>
          <div className="scoreboard-minute">{liveState.isFinished ? "FT" : `${liveState.currentMinute}'`}</div>
          <div className="match-progress">
            <div className="match-progress-bar" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <div className="scoreboard-team away">
          <strong>{awayClub?.shortName ?? "Away"}</strong>
          <span className="club-badge" style={{ background: awayClub?.primaryColor ?? "#888" }}>{awayClub?.shortName?.[0]}</span>
        </div>
      </div>

      <div className="live-layout">
        {/* Commentary feed */}
        <div className="panel live-commentary">
          <h3>📡 Live Commentary</h3>
          <ul className="commentary">
            {recentEvents.map((e, idx) => (
              <li key={idx} className={`event-${e.type}`}>
                <span className="event-min">{e.minute}'</span>
                <span>{e.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Manager actions (only if user club) */}
        {isUserMatch && !liveState.isFinished && (
          <div className="live-manager-panel">
            {/* Substitutions */}
            <div className="panel">
              <h3>🔄 Substitutions ({3 - subsUsed} left)</h3>
              {subsUsed < 3 ? (
                <>
                  <div className="sub-selects">
                    <div>
                      <label>Off (Lineup)</label>
                      <select value={subOff} onChange={(e) => setSubOff(e.target.value)}>
                        <option value="">— pick player —</option>
                        {lineupPlayers.map((p) => (
                          <option key={p.id} value={p.id}>{p.displayName} ({p.position}) {p.fitness}%</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>On (Bench)</label>
                      <select value={subOn} onChange={(e) => setSubOn(e.target.value)}>
                        <option value="">— pick player —</option>
                        {benchPlayers.map((p) => (
                          <option key={p.id} value={p.id}>{p.displayName} ({p.position}) {p.fitness}%</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={handleSub} disabled={!subOff || !subOn}>Confirm Sub</button>
                </>
              ) : (
                <p className="muted">All substitutions used.</p>
              )}
            </div>

            {/* Tactics */}
            <div className="panel">
              <button className="btn-secondary" onClick={() => setShowTactics(!showTactics)}>
                📋 {showTactics ? "Hide" : "Change"} Tactics
              </button>
              {showTactics && currentTactics && (
                <div className="live-tactics">
                  <label>Mentality
                    <select value={currentTactics.mentality} onChange={(e) => handleTacticChange("mentality", e.target.value)}>
                      {["Defensive","Balanced","Attacking"].map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </label>
                  <label>Pressing
                    <select value={currentTactics.pressingIntensity} onChange={(e) => handleTacticChange("pressingIntensity", e.target.value)}>
                      {["Low","Medium","High"].map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </label>
                  <label>Tempo
                    <select value={currentTactics.tempo} onChange={(e) => handleTacticChange("tempo", e.target.value)}>
                      {["Patient","Normal","Fast"].map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </label>
                </div>
              )}
            </div>

            {/* Lineup */}
            <div className="panel">
              <h3>Lineup</h3>
              <ul className="live-lineup">
                {lineupPlayers.map((p) => (
                  <li key={p.id} className="live-player-row">
                    <span className="pos-badge">{p.position}</span>
                    <span>{p.displayName}</span>
                    <span className={`fitness-badge ${p.fitness >= 75 ? "green" : p.fitness >= 55 ? "amber" : "red"}`}>{p.fitness}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {liveState.isFinished && (
          <div className="panel live-finished">
            <h3>⏱ Full Time</h3>
            <p className="ft-score">{homeClub?.name} {liveState.homeGoals} – {liveState.awayGoals} {awayClub?.name}</p>
            <p className="muted">Result has been recorded. Check the Match Report.</p>
          </div>
        )}
      </div>
    </section>
  );
}
