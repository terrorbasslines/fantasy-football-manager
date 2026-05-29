import { Activity, CalendarDays, Database, FileText, Home, Inbox, Repeat, Save, Settings, Shield, Trophy, Users, Wand2 } from "lucide-react";
import type React from "react";
import type { Club } from "../types/football";

export type ViewKey =
  | "dashboard"
  | "career"
  | "clubSelect"
  | "squad"
  | "playerProfile"
  | "clubProfile"
  | "leagueTable"
  | "fixtures"
  | "matchPreview"
  | "liveMatch"
  | "matchReport"
  | "transfers"
  | "inbox"
  | "databaseEditor"
  | "minifaceManager"
  | "settings";

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewKey;
  onNavigate: (view: ViewKey) => void;
  currentClub?: Club;
  saveStatus: string;
}

const navItems: { view: ViewKey; label: string; icon: React.ElementType }[] = [
  { view: "dashboard", label: "Dashboard", icon: Home },
  { view: "clubSelect", label: "Club Select", icon: Shield },
  { view: "squad", label: "Squad", icon: Users },
  { view: "clubProfile", label: "Club", icon: Shield },
  { view: "fixtures", label: "Fixtures", icon: CalendarDays },
  { view: "matchPreview", label: "Preview", icon: Activity },
  { view: "liveMatch", label: "Live Text", icon: Activity },
  { view: "leagueTable", label: "Table", icon: Trophy },
  { view: "matchReport", label: "Report", icon: FileText },
  { view: "transfers", label: "Transfers", icon: Repeat },
  { view: "inbox", label: "Inbox", icon: Inbox },
  { view: "minifaceManager", label: "Minifaces", icon: Wand2 },
  { view: "databaseEditor", label: "Database", icon: Database },
  { view: "settings", label: "Settings", icon: Settings },
];

export function Layout({ children, currentView, onNavigate, currentClub, saveStatus }: LayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">FF</div>
          <div>
            <strong>Fantasy Football</strong>
            <span>Text Manager</span>
          </div>
        </div>
        <nav>
          {navItems.map(({ view, label, icon: Icon }) => (
            <button key={view} className={currentView === view ? "active" : ""} onClick={() => onNavigate(view)} title={label}>
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main>
        <header className="topbar">
          <div>
            <small>Active career</small>
            <strong>{currentClub ? currentClub.name : "No club selected"}</strong>
          </div>
          <div className="save-pill">
            <Save size={16} />
            {saveStatus}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
