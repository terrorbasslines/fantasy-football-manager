import { useState } from "react";
import type { CalendarEntry, Club, Player, TrainingFocus } from "../types/football";

const TRAINING_LABELS: Record<TrainingFocus, string> = {
  fitness: "💪 Fitness",
  attack: "⚽ Attack",
  defence: "🛡️ Defence",
  "set-pieces": "📐 Set Pieces",
  youth: "🌱 Youth Dev",
  rest: "😴 Rest Day",
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
  calendar: CalendarEntry[];
  currentDate: string;
  currentClub?: Club;
  players: Player[];
  onTrainSquad: (focus: TrainingFocus) => void;
  onNavigateMatch: (fixtureId: string) => void;
  onAdvanceDate: () => void;
}

export function Calendar({ calendar, currentDate, currentClub, players, onTrainSquad, onNavigateMatch, onAdvanceDate }: Props) {
  const [viewDate, setViewDate] = useState(() => currentDate.slice(0, 7));
  const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(null);
  const [trainingPick, setTrainingPick] = useState<TrainingFocus>("fitness");

  const [viewYear, viewMonthIdx] = viewDate.split("-").map(Number);
  const monthEntries = calendar.filter((e) => e.date.startsWith(viewDate));
  const daysInMonth = new Date(viewYear, viewMonthIdx, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonthIdx - 1, 1).getDay();

  function prevMonth() {
    const d = new Date(viewYear, viewMonthIdx - 2, 1);
    setViewDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  function nextMonth() {
    const d = new Date(viewYear, viewMonthIdx, 1);
    setViewDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  function typeIcon(type: CalendarEntry["type"]) {
    switch (type) {
      case "match": return "⚽";
      case "training": return "🏋️";
      case "transfer-window-open": return "🟢";
      case "transfer-window-close": return "🔴";
      case "international-break": return "🌍";
      case "season-start": return "🚀";
      case "season-end": return "🏁";
    }
  }

  function typeClass(type: CalendarEntry["type"]) {
    switch (type) {
      case "match": return "event-match";
      case "training": return "event-training";
      case "transfer-window-open": case "transfer-window-close": return "event-transfer";
      case "international-break": return "event-intl";
      default: return "event-info";
    }
  }

  const fitPlayers = currentClub ? players.filter((p) => p.clubId === currentClub.id && p.injuryStatus !== "Injured") : [];
  const injuredPlayers = currentClub ? players.filter((p) => p.clubId === currentClub.id && p.injuryStatus !== "Fit") : [];

  const days: (number | null)[] = [
    ...Array(firstWeekday === 0 ? 6 : firstWeekday - 1).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Season Calendar</h1>
          <p>Plan your season – training, matches, transfers</p>
        </div>
        <button className="btn-primary" onClick={onAdvanceDate}>⏭ Advance Week</button>
      </div>

      <div className="calendar-layout">
        {/* Monthly grid */}
        <div className="panel calendar-panel">
          <div className="calendar-nav">
            <button className="btn-secondary" onClick={prevMonth}>◀</button>
            <h2>{MONTH_NAMES[viewMonthIdx - 1]} {viewYear}</h2>
            <button className="btn-secondary" onClick={nextMonth}>▶</button>
          </div>

          <div className="calendar-grid-header">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
              <span key={d} className="cal-day-name">{d}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {days.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="cal-day empty" />;
              const dateStr = `${viewDate}-${String(day).padStart(2, "0")}`;
              const dayEntries = monthEntries.filter((e) => e.date === dateStr);
              const isToday = dateStr === currentDate;
              const isPast = dateStr < currentDate;
              return (
                <div
                  key={day}
                  className={`cal-day ${isToday ? "today" : ""} ${isPast ? "past" : ""} ${dayEntries.length ? "has-events" : ""}`}
                  onClick={() => dayEntries.length && setSelectedEntry(dayEntries[0])}
                >
                  <span className="day-num">{day}</span>
                  {dayEntries.slice(0, 2).map((e) => (
                    <span key={e.id} className={`cal-dot ${typeClass(e.type)}`} title={e.title}>
                      {typeIcon(e.type)}
                    </span>
                  ))}
                  {dayEntries.length > 2 && <span className="cal-more">+{dayEntries.length - 2}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="calendar-sidebar">
          {/* Selected event detail */}
          {selectedEntry && (
            <div className="panel cal-detail">
              <h3>{typeIcon(selectedEntry.type)} {selectedEntry.title}</h3>
              <p className="cal-date">{selectedEntry.date}</p>
              <p>{selectedEntry.description}</p>

              {selectedEntry.type === "training" && !selectedEntry.completed && (
                <div className="training-picker">
                  <label>Training focus:</label>
                  <div className="training-options">
                    {(Object.keys(TRAINING_LABELS) as TrainingFocus[]).map((focus) => (
                      <button
                        key={focus}
                        className={`btn-training ${trainingPick === focus ? "active" : ""}`}
                        onClick={() => setTrainingPick(focus)}
                      >
                        {TRAINING_LABELS[focus]}
                      </button>
                    ))}
                  </div>
                  <button className="btn-primary" style={{ marginTop: "0.75rem" }} onClick={() => {
                    onTrainSquad(trainingPick);
                    setSelectedEntry(null);
                  }}>
                    Run Training Session
                  </button>
                </div>
              )}
              {selectedEntry.type === "training" && selectedEntry.completed && (
                <p className="badge-green">✅ Completed</p>
              )}
              {selectedEntry.type === "match" && (
                <button className="btn-primary" onClick={() => onNavigateMatch(selectedEntry.fixtureId ?? "")}>
                  Go to Match →
                </button>
              )}
            </div>
          )}

          {/* Squad status */}
          {currentClub && (
            <div className="panel">
              <h3>Squad Status</h3>
              <div className="squad-status-row">
                <span className="badge-green">Fit: {fitPlayers.length}</span>
                <span className="badge-yellow">Doubtful: {injuredPlayers.filter((p) => p.injuryStatus === "Doubtful").length}</span>
                <span className="badge-red">Injured: {injuredPlayers.filter((p) => p.injuryStatus === "Injured").length}</span>
              </div>
              <div className="player-fitness-list">
                {players.filter((p) => p.clubId === currentClub.id).slice(0, 11).map((p) => (
                  <div key={p.id} className="fitness-row">
                    <span>{p.displayName.slice(0, 16)}</span>
                    <div className="fitness-bar">
                      <div className="fitness-fill" style={{ width: `${p.fitness}%`, background: p.fitness >= 80 ? "#22c55e" : p.fitness >= 60 ? "#f59e0b" : "#ef4444" }} />
                    </div>
                    <span className="fitness-num">{p.fitness}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming events */}
          <div className="panel">
            <h3>Upcoming</h3>
            <ul className="upcoming-list">
              {calendar.filter((e) => e.date >= currentDate).slice(0, 8).map((e) => (
                <li key={e.id} className={`upcoming-item ${typeClass(e.type)}`} onClick={() => setSelectedEntry(e)}>
                  <span className="upcoming-icon">{typeIcon(e.type)}</span>
                  <div>
                    <strong>{e.title}</strong>
                    <small>{e.date}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
