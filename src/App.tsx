import { useMemo, useState } from "react";
import { Layout, type ViewKey } from "./components/Layout";
import { createStarterDatabase } from "./data/database";
import { generateFixtures } from "./engine/fixtureGenerator";
import { buildTableFromFixtures, createInitialTable } from "./engine/leagueTable";
import { simulateMatch } from "./engine/matchEngine";
import { deleteCareerSave, loadCareer, saveCareer } from "./storage/saveManager";
import type { CareerSave, Club, DatabaseState, Fixture, InboxMessage, MatchResult, Player } from "./types/football";
import { ClubProfile } from "./pages/ClubProfile";
import { ClubSelect } from "./pages/ClubSelect";
import { Dashboard } from "./pages/Dashboard";
import { DatabaseEditor } from "./pages/DatabaseEditor";
import { Fixtures } from "./pages/Fixtures";
import { Inbox } from "./pages/Inbox";
import { LeagueTable } from "./pages/LeagueTable";
import { LiveMatch } from "./pages/LiveMatch";
import { MatchPreview } from "./pages/MatchPreview";
import { MatchReport } from "./pages/MatchReport";
import { MinifaceManager } from "./pages/MinifaceManager";
import { PlayerProfile } from "./pages/PlayerProfile";
import { Settings } from "./pages/Settings";
import { Squad } from "./pages/Squad";
import { Transfers } from "./pages/Transfers";

const starter = createStarterDatabase();

function App() {
  const [database, setDatabase] = useState<DatabaseState>(starter);
  const [currentClubId, setCurrentClubId] = useState<string | undefined>();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [currentMatchday, setCurrentMatchday] = useState(1);
  const [currentDate, setCurrentDate] = useState("2026-07-01");
  const [currentSeason, setCurrentSeason] = useState("2026/27");
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [lastMatchResult, setLastMatchResult] = useState<MatchResult | undefined>();
  const [currentView, setCurrentView] = useState<ViewKey>("dashboard");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | undefined>();
  const [saveStatus, setSaveStatus] = useState("Unsaved local career");
  const [minifaceWarning, setMinifaceWarning] = useState("");
  const [databaseQuery, setDatabaseQuery] = useState("");

  const currentClub = database.clubs.find((club) => club.id === currentClubId);
  const currentPlayers = database.players.filter((player) => player.clubId === currentClubId).sort((a, b) => b.overall - a.overall);
  const selectedPlayer = database.players.find((player) => player.id === selectedPlayerId);
  const table = useMemo(() => buildTableFromFixtures(database.clubs, fixtures), [database.clubs, fixtures]);
  const nextFixture = fixtures.find((fixture) => !fixture.played && (fixture.homeClubId === currentClubId || fixture.awayClubId === currentClubId));
  const nextOpponent = nextFixture && currentClubId
    ? database.clubs.find((club) => club.id === (nextFixture.homeClubId === currentClubId ? nextFixture.awayClubId : nextFixture.homeClubId))
    : undefined;

  function startCareer(clubId: string) {
    const league = database.leagues[0];
    const freshFixtures = generateFixtures(league);
    const club = database.clubs.find((item) => item.id === clubId);
    setCurrentClubId(clubId);
    setFixtures(freshFixtures);
    setCurrentMatchday(1);
    setCurrentDate("2026-07-01");
    setCurrentSeason("2026/27");
    setLastMatchResult(undefined);
    setInbox([
      {
        id: `msg-${Date.now()}`,
        date: "2026-07-01",
        type: "Board",
        title: `Welcome to ${club?.name ?? "your new club"}`,
        body: "The board expects a competitive season, smart squad management, and a clear tactical identity.",
        read: false,
      },
    ]);
    setSaveStatus("Career created. Save when ready.");
    setCurrentView("dashboard");
  }

  function simulateFixture(fixtureId?: string) {
    const target = fixtures.find((fixture) => fixture.id === (fixtureId ?? nextFixture?.id));
    if (!target) return;
    const matchday = target.matchday;
    const formByClub = Object.fromEntries(table.map((row) => [row.clubId, row.form.filter((item) => item === "W").length / 5]));
    let selectedResult: MatchResult | undefined;

    const updatedFixtures = fixtures.map((fixture) => {
      if (fixture.matchday !== matchday || fixture.played) return fixture;
      const home = database.clubs.find((club) => club.id === fixture.homeClubId);
      const away = database.clubs.find((club) => club.id === fixture.awayClubId);
      if (!home || !away) return fixture;
      const result = simulateMatch(fixture.id, home, away, database.players, database.tactics, formByClub);
      if (fixture.id === target.id) selectedResult = result;
      return { ...fixture, played: true, result };
    });

    const resultForScreen = selectedResult ?? updatedFixtures.find((fixture) => fixture.id === target.id)?.result;
    setFixtures(updatedFixtures);
    setLastMatchResult(resultForScreen);
    setDatabase((current) => ({ ...current, players: updatePlayerStats(current.players, resultForScreen) }));
    setCurrentMatchday(matchday + 1);
    setCurrentDate(advanceDate(currentDate));
    if (resultForScreen) {
      setInbox((messages) => [createMatchMessage(resultForScreen, database.clubs), ...messages]);
    }
    setSaveStatus(`Matchday ${matchday} simulated. Save available.`);
    setCurrentView("matchReport");
  }

  function updateMiniface(playerId: string, dataUrl: string) {
    setDatabase((current) => ({
      ...current,
      players: current.players.map((player) => player.id === playerId ? { ...player, minifacePath: dataUrl } : player),
    }));
    setSaveStatus("Miniface changed. Save to keep it.");
  }

  function removeMiniface(playerId: string) {
    updateMiniface(playerId, "");
    setMinifaceWarning("Miniface removed. Default silhouette restored.");
  }

  function manualSave() {
    if (!currentClubId) {
      setSaveStatus("Select a club before saving.");
      return;
    }
    saveCareer(makeSave());
    setSaveStatus(`Saved ${new Date().toLocaleTimeString()}`);
  }

  function manualLoad() {
    const loaded = loadCareer();
    if (!loaded) {
      setSaveStatus("No local save found.");
      return;
    }
    setDatabase({ clubs: loaded.clubs, players: loaded.players, leagues: loaded.leagues, tactics: loaded.tactics });
    setCurrentClubId(loaded.currentClubId);
    setCurrentDate(loaded.currentDate);
    setCurrentSeason(loaded.currentSeason);
    setCurrentMatchday(loaded.currentMatchday);
    setFixtures(loaded.fixtures);
    setInbox(loaded.inbox);
    setLastMatchResult(loaded.lastMatchResult);
    setSaveStatus(`Loaded ${loaded.name}`);
    setCurrentView("dashboard");
  }

  function deleteSave() {
    deleteCareerSave();
    setSaveStatus("Local save deleted.");
  }

  function exportDatabase() {
    const payload = JSON.stringify(database, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fantasy-football-text-manager-database.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importDatabase(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result)) as DatabaseState;
        if (!imported.clubs || !imported.players || !imported.leagues || !imported.tactics) throw new Error("Invalid database");
        setDatabase(imported);
        setSaveStatus("Imported database. Save career to persist it.");
      } catch {
        setSaveStatus("Import failed. The JSON did not match the database shape.");
      }
    };
    reader.readAsText(file);
  }

  function makeSave(): CareerSave {
    return {
      id: "local-career",
      name: `${currentClub?.shortName ?? "Career"} ${currentSeason}`,
      currentClubId: currentClubId!,
      currentDate,
      currentSeason,
      currentMatchday,
      clubs: database.clubs,
      players: database.players,
      leagues: database.leagues,
      fixtures,
      table,
      tactics: database.tactics,
      inbox,
      lastMatchResult,
      updatedAt: new Date().toISOString(),
    };
  }

  function renderView() {
    switch (currentView) {
      case "career":
      case "dashboard":
        return <Dashboard currentClub={currentClub} opponent={nextOpponent} nextFixture={nextFixture} table={table.length ? table : createInitialTable(database.clubs)} inbox={inbox} onNavigate={setCurrentView} onSimulateNext={() => simulateFixture()} />;
      case "clubSelect":
        return <ClubSelect clubs={database.clubs} currentClubId={currentClubId} onStartCareer={startCareer} />;
      case "squad":
        return <Squad club={currentClub} players={currentPlayers} onSelectPlayer={(id) => { setSelectedPlayerId(id); setCurrentView("playerProfile"); }} />;
      case "playerProfile":
        return <PlayerProfile player={selectedPlayer} club={database.clubs.find((club) => club.id === selectedPlayer?.clubId)} onBack={() => setCurrentView("squad")} />;
      case "clubProfile":
        return <ClubProfile club={currentClub} players={currentPlayers} />;
      case "leagueTable":
        return <LeagueTable table={table.length ? table : createInitialTable(database.clubs)} clubs={database.clubs} />;
      case "fixtures":
        return <Fixtures fixtures={fixtures} clubs={database.clubs} currentClubId={currentClubId} onSimulate={simulateFixture} />;
      case "matchPreview":
        return <MatchPreview fixture={nextFixture} clubs={database.clubs} />;
      case "liveMatch":
        return <LiveMatch result={lastMatchResult} clubs={database.clubs} />;
      case "matchReport":
        return <MatchReport result={lastMatchResult} clubs={database.clubs} players={database.players} />;
      case "transfers":
        return <Transfers players={database.players} />;
      case "inbox":
        return <Inbox messages={inbox} />;
      case "databaseEditor":
        return <DatabaseEditor players={database.players} clubs={database.clubs} query={databaseQuery} setQuery={setDatabaseQuery} onExport={exportDatabase} onImport={importDatabase} />;
      case "minifaceManager":
        return <MinifaceManager players={currentClubId ? currentPlayers : database.players} onUpdateMiniface={updateMiniface} onRemoveMiniface={removeMiniface} warning={minifaceWarning} setWarning={setMinifaceWarning} />;
      case "settings":
        return <Settings onSave={manualSave} onLoad={manualLoad} onDelete={deleteSave} saveStatus={saveStatus} />;
      default:
        return null;
    }
  }

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView} currentClub={currentClub} saveStatus={saveStatus}>
      {renderView()}
    </Layout>
  );
}

function updatePlayerStats(players: Player[], result?: MatchResult): Player[] {
  if (!result) return players;
  const involvedClubIds = new Set([result.homeClubId, result.awayClubId]);
  return players.map((player) => {
    if (!involvedClubIds.has(player.clubId)) return player;
    const goals = result.scorers.filter((goal) => goal.playerId === player.id).length;
    const assists = result.assists.filter((assist) => assist.playerId === player.id).length;
    const yellowCards = result.yellowCards.filter((card) => card.playerId === player.id).length;
    const redCards = result.redCards.filter((card) => card.playerId === player.id).length;
    const injured = result.injuries.some((injury) => injury.playerId === player.id);
    const appeared = player.stats.appearances + 1;
    const rating = Number(((player.stats.averageRating * player.stats.appearances + 6.3 + goals * 0.8 + assists * 0.35 - yellowCards * 0.15 - redCards * 0.7) / appeared).toFixed(2));
    return {
      ...player,
      fitness: Math.max(58, player.fitness - 4 - (injured ? 10 : 0)),
      injuryStatus: injured ? "Doubtful" : player.injuryStatus,
      stats: {
        ...player.stats,
        appearances: appeared,
        goals: player.stats.goals + goals,
        assists: player.stats.assists + assists,
        yellowCards: player.stats.yellowCards + yellowCards,
        redCards: player.stats.redCards + redCards,
        injuries: player.stats.injuries + (injured ? 1 : 0),
        minutesPlayed: player.stats.minutesPlayed + 90,
        cleanSheets: player.stats.cleanSheets + (player.position === "GK" && ((player.clubId === result.homeClubId && result.awayGoals === 0) || (player.clubId === result.awayClubId && result.homeGoals === 0)) ? 1 : 0),
        averageRating: rating,
      },
    };
  });
}

function createMatchMessage(result: MatchResult, clubs: Club[]): InboxMessage {
  const home = clubs.find((club) => club.id === result.homeClubId);
  const away = clubs.find((club) => club.id === result.awayClubId);
  return {
    id: `msg-${Date.now()}-${result.fixtureId}`,
    date: new Date().toISOString(),
    type: "Report",
    title: `${home?.shortName ?? "Home"} ${result.homeGoals}-${result.awayGoals} ${away?.shortName ?? "Away"}`,
    body: `Match rating ${result.matchRating}. Possession ended ${result.stats.homePossession}-${result.stats.awayPossession}, with ${result.stats.homeShots + result.stats.awayShots} total shots.`,
    read: false,
  };
}

function advanceDate(value: string): string {
  const date = new Date(value);
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

export default App;
