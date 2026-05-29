import { useState } from "react";
import type { CustomClubConfig } from "../types/football";

interface Props {
  onCreateClub: (config: CustomClubConfig) => void;
}

const COLOR_PRESETS = [
  { primary: "#3B82F6", secondary: "#FFFFFF", label: "Blue & White" },
  { primary: "#EF4444", secondary: "#FFFFFF", label: "Red & White" },
  { primary: "#10B981", secondary: "#FFFFFF", label: "Green & White" },
  { primary: "#F59E0B", secondary: "#000000", label: "Yellow & Black" },
  { primary: "#8B5CF6", secondary: "#FFFFFF", label: "Purple & White" },
  { primary: "#EC4899", secondary: "#FFFFFF", label: "Pink & White" },
  { primary: "#06B6D4", secondary: "#000000", label: "Cyan & Black" },
  { primary: "#000000", secondary: "#FFFFFF", label: "Black & White" },
];

export function CreateClub({ onCreateClub }: Props) {
  const [name, setName] = useState("FC Jouw Klub");
  const [shortName, setShortName] = useState("JKF");
  const [city, setCity] = useState("Rotterdam");
  const [stadiumName, setStadiumName] = useState("Community Ground");
  const [colorIdx, setColorIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const color = COLOR_PRESETS[colorIdx];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateClub({
      name: name.trim(),
      shortName: shortName.trim() || name.slice(0, 8),
      city: city.trim(),
      stadiumName: stadiumName.trim() || "Community Ground",
      primaryColor: color.primary,
      secondaryColor: color.secondary,
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="page">
        <div className="panel create-club-success">
          <div className="success-icon">⚽</div>
          <h2>{name} has been created!</h2>
          <p>Your club starts in the <strong>Derde Divisie – Groep A</strong> (4th division) with:</p>
          <ul>
            <li>💰 Budget: <strong>€50,000</strong></li>
            <li>👥 Squad: <strong>18 players</strong> (OVR ~48–55)</li>
            <li>🏟️ Stadium: <strong>{stadiumName}</strong> (800 capacity)</li>
          </ul>
          <p className="muted">Select your club from the Club Select screen to begin your career.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Create Your Club</h1>
          <p>Build your club from the 4th division and rise through the Dutch pyramid</p>
        </div>
      </div>

      <div className="create-club-layout">
        {/* Preview */}
        <div className="panel create-club-preview">
          <div className="club-badge-large" style={{ background: color.primary, color: color.secondary }}>
            {shortName || "CLB"}
          </div>
          <h2 style={{ color: color.primary }}>{name || "Your Club"}</h2>
          <p className="muted">{city || "City"} · {stadiumName || "Stadium"}</p>
          <div className="club-badges">
            <span className="badge">Derde Divisie</span>
            <span className="badge">€50,000 budget</span>
            <span className="badge">OVR ~51</span>
          </div>
        </div>

        {/* Form */}
        <form className="panel create-club-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Club Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="FC Jouw Klub"
              maxLength={40}
              required
            />
          </div>
          <div className="form-group">
            <label>Short Name (3–12 chars)</label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value.slice(0, 12))}
              placeholder="JKF"
              maxLength={12}
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Rotterdam"
              maxLength={30}
            />
          </div>
          <div className="form-group">
            <label>Stadium Name</label>
            <input
              type="text"
              value={stadiumName}
              onChange={(e) => setStadiumName(e.target.value)}
              placeholder="Community Ground"
              maxLength={40}
            />
          </div>

          <div className="form-group">
            <label>Club Colors</label>
            <div className="color-grid">
              {COLOR_PRESETS.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`color-swatch ${colorIdx === idx ? "selected" : ""}`}
                  style={{ background: c.primary, color: c.secondary, border: `3px solid ${colorIdx === idx ? "#fff" : "transparent"}` }}
                  onClick={() => setColorIdx(idx)}
                  title={c.label}
                >
                  {c.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="form-info">
            <h4>What you get:</h4>
            <ul>
              <li>🏟️ Stadium capacity: 800 seats</li>
              <li>💰 Budget: €50,000</li>
              <li>👥 18 players (OVR 44–55, all Dutch amateurs)</li>
              <li>📍 Division: Derde Divisie – Groep A (Tier 4)</li>
              <li>🏆 Goal: Win promotion to Tweede Divisie</li>
            </ul>
          </div>

          <button type="submit" className="btn-primary btn-large">⚽ Create Club &amp; Start Career</button>
        </form>
      </div>
    </section>
  );
}
