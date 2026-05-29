import { Activity, CalendarDays, Database, FileText, Globe, Home, Inbox, PlusCircle, Repeat, Save, Settings, Shield, Trophy, Users, Wand2 } from "lucide-react";
import type React from "react";
import type { Club } from "../types/football";

export type ViewKey =
  | "dashboard"
  | "career"
  | "clubSelect"
  | "createClub"
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
  | "settings"
  | "calendar"
  | "competitions"
  | "nationalTeam";

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewKey;
  onNavigate: (view: ViewKey) => void;
  currentClub?: Club;
  saveStatus: string;
}

const navGroups: { label: string; items: { view: ViewKey; label: string; icon: React.ElementType }[] }[] = [
  {
    label: "Career",
    items: [
      { view: "dashboard", label: "Dashboard", icon: Home },
      { view: "calendar", label: "Calendar", icon: CalendarDays },
      { view: "inbox", label: "Inbox", icon: Inbox },
    ],
  },
  {
    label: "Club",
    items: [
      { view: "squad", label: "Squad", icon: Users },
      { view: "clubProfile", label: "Club", icon: Shield },
      { view: "nationalTeam", label: "National Team", icon: Globe },
      { view: "transfers", label: "Transfers", icon: Repeat },
    ],
  },
  {
    label: "Matches",
    items: [
      { view: "fixtures", label: "Fixtures", icon: CalendarDays },
      { view: "matchPreview", label: "Preview", icon: Activity },
      { view: "liveMatch", label: "Live Match", icon: Activity },
      { view: "matchReport", label: "Report", icon: FileText },
    ],
  },
  {
    label: "Competitions",
    items: [
      { view: "competitions", label: "Competitions", icon: Trophy },
      { view: "leagueTable", label: "League Table", icon: Trophy },
    ],
  },
  {
    label: "Tools",
    items: [
      { view: "clubSelect", label: "Club Select", icon: Shield },
      { view: "createClub", label: "Create Club", icon: PlusCircle },
      { view: "minifaceManager", label: "Minifaces", icon: Wand2 },
      { view: "databaseEditor", label: "Database", icon: Database },
      { view: "settings", label: "Settings", icon: Settings },
    ],
  },
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
          {navGroups.map((group) => (
            <div key={group.label} className="nav-group">
              <span className="nav-group-label">{group.label}</span>
              {group.items.map(({ view, label, icon: Icon }) => (
                <button
                  key={view}
                  className={currentView === view ? "active" : ""}
                  onClick={() => onNavigate(view)}
                  title={label}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
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
