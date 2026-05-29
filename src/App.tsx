import { useMemo, useState } from "react";
import { Layout, type ViewKey } from "./components/Layout";
import { createStarterDatabase } from "./data/database";
import {
  generateFixtures,
  initializeCup,
  advanceCupRound,
  initializeEuropeanCompetition,
  advanceEuropeanRound,
} from "./engine/fixtureGenerator";
import { buildTableFromFixtures, createInitialTable } from "./engine/leagueTable";
import { simulateMatch } from "./engine/matchEngine";
import { deleteCareerSave, loadCareer, saveCareer } from "./storage/saveManager";
import type {
  CareerSave,
  Club,
  DatabaseState,
  Fixture,
  InboxMessage,
  MatchResult,
  Player,
  CalendarEntry,
  Cup,
  EuropeanCompetition,
  TransferOffer,
  LiveMatchState,
  TrainingFocus,
  CustomClubConfig,
} from "./types/football";
import { ClubProfile } from "./pages/ClubProfile";
import { ClubSelect } from "./pages/ClubSelect";
import { CreateClub } from "./pages/CreateClub";
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
import { Calendar } from "./pages/Calendar";
import { Competitions } from "./pages/Competitions";
import { NationalTeam } from "./pages/NationalTeam";
import { generateSeasonCalendar, isTransferWindowOpen } from "./engine/calendarEngine";
import { trainPlayers, recoverPlayers } from "./engine/trainingEngine";
import { liveStateToResult, startLiveMatch } from "./engine/liveMatchEngine";
import { evaluateTransferOffer } from "./engine/transfers";
import { formatCurrency } from "./utils/format";

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

  // New expansion states
  const [cups, setCups] = useState<Cup[]>([]);
  const [europeanCompetitions, setEuropeanCompetitions] = useState<EuropeanCompetition[]>([]);
  const [calendar, setCalendar] = useState<CalendarEntry[]>([]);
  const [transferOffers, setTransferOffers] = useState<TransferOffer[]>([]);
  const [liveMatchState, setLiveMatchState] = useState<LiveMatchState | undefined>();

  const currentClub = database.clubs.find((club) => club.id === currentClubId);
  const currentPlayers = database.players.filter((player) => player.clubId === currentClubId).sort((a, b) => b.overall - a.overall);
  const selectedPlayer = database.players.find((player) => player.id === selectedPlayerId);
  
  const userLeague = useMemo(() => {
    if (!currentClub) return undefined;
    return database.leagues.find((l) => l.id === currentClub.leagueId);
  }, [database.leagues, currentClub]);

  const table = useMemo(() => {
    if (!currentClub) return [];
    const leagueClubs = database.clubs.filter((c) => c.leagueId === currentClub.leagueId);
    const leagueFixtures = fixtures.filter((f) => f.competitionId === currentClub.leagueId);
    return buildTableFromFixtures(leagueClubs, leagueFixtures);
  }, [database.clubs, fixtures, currentClub]);

  const nextFixture = fixtures.find(
    (fixture) => !fixture.played && (fixture.homeClubId === currentClubId || fixture.awayClubId === currentClubId)
  );
  
  const nextOpponent = nextFixture && currentClubId
    ? database.clubs.find((club) => club.id === (nextFixture.homeClubId === currentClubId ? nextFixture.awayClubId : nextFixture.homeClubId))
    : undefined;

  const transferWindowOpen = useMemo(() => {
    return isTransferWindowOpen(calendar, currentDate);
  }, [calendar, currentDate]);

  function startCareer(clubId: string) {
    // Generate season calendar
    const fullCalendar = generateSeasonCalendar("2026/27", 2026, 34, "Eredivisie");

    // Generate fixtures for ALL leagues in the database
    const allFixtures: Fixture[] = [];
    database.leagues.forEach((l) => {
      if (l.type === "league") {
        const leagueFixtures = generateFixtures(l);
        allFixtures.push(...leagueFixtures);
      }
    });

    // Seed calendar match fixtures with actual IDs
    const userClubFixtures = allFixtures.filter((f) => f.homeClubId === clubId || f.awayClubId === clubId);
    let userFixtureIdx = 0;
    const mappedCalendar = fullCalendar.map((entry) => {
      if (entry.type === "match" && userFixtureIdx < userClubFixtures.length) {
        const f = userClubFixtures[userFixtureIdx++];
        return { ...entry, fixtureId: f.id, competitionId: f.competitionId };
      }
      return entry;
    });

    // Initialize Cups
    const allDutchClubIds = database.clubs.filter((c) => c.country === "Netherlands" && c.id !== "user-club").map((c) => c.id);
    if (!allDutchClubIds.includes(clubId)) {
      allDutchClubIds.push(clubId);
    }
    const beker = initializeCup("knvb-beker", "KNVB Beker", "KNVB", "Netherlands", allDutchClubIds);

    // Initialize European Competitions
    const ucl = initializeEuropeanCompetition("champions-league", "UEFA Champions League", "UCL", ["ajax", "psv"]);
    const uel = initializeEuropeanCompetition("europa-league", "UEFA Europa League", "UEL", ["feyenoord"]);
    const uecl = initializeEuropeanCompetition("conference-league", "UEFA Conference League", "UECL", ["az-alkmaar", "utrecht"]);

    const targetClub = database.clubs.find((c) => c.id === clubId);

    setCurrentClubId(clubId);
    setFixtures(allFixtures);
    setCurrentMatchday(1);
    setCurrentDate("2026-07-01");
    setCurrentSeason("2026/27");
    setLastMatchResult(undefined);
    setCups([beker]);
    setEuropeanCompetitions([ucl, uel, uecl]);
    setCalendar(mappedCalendar);
    setTransferOffers([]);
    setLiveMatchState(undefined);

    setInbox([
      {
        id: `msg-${Date.now()}`,
        date: "2026-07-01",
        type: "Board",
        title: `Welcome to ${targetClub?.name ?? "your new club"}`,
        body: `The board expects a competitive season, smart squad management, and a clear tactical identity. You are now active in the ${
          targetClub?.leagueId === "eredivisie" ? "Eredivisie (Tier 1)" : "Derde Divisie (Tier 4)"
        }. Good luck, boss!`,
        read: false,
      },
    ]);

    setSaveStatus("Career created. Save when ready.");
    setCurrentView("dashboard");
  }

  function handleCreateCustomClub(config: CustomClubConfig) {
    // Modify existing user-club seed in the database
    const updatedClubs = database.clubs.map((club) => {
      if (club.id === "user-club") {
        return {
          ...club,
          name: config.name,
          shortName: config.shortName,
          city: config.city,
          stadiumName: config.stadiumName,
          primaryColor: config.primaryColor,
          secondaryColor: config.secondaryColor,
        };
      }
      return club;
    });

    setDatabase((current) => ({
      ...current,
      clubs: updatedClubs,
    }));

    // Start career directly using the custom club
    startCareer("user-club");
  }

  function simulateFixture(fixtureId?: string) {
    const target = fixtures.find((fixture) => fixture.id === (fixtureId ?? nextFixture?.id));
    if (!target) return;
    
    // Check if this is the user's club fixture. If yes, we can start it interactively as a live match instead of background simulation
    const isUserFixture = target.homeClubId === currentClubId || target.awayClubId === currentClubId;
    if (isUserFixture && !fixtureId) {
      // Prompt live match initialization
      const state = startLiveMatch(target, database.players, database.tactics);
      setLiveMatchState(state);
      setCurrentView("liveMatch");
      return;
    }

    const matchday = target.matchday;
    const formByClub = Object.fromEntries(table.map((row) => [row.clubId, row.form.filter((item) => item === "W").length / 5]));
    let selectedResult: MatchResult | undefined;

    const updatedFixtures = fixtures.map((fixture) => {
      if (fixture.matchday !== matchday || fixture.played || fixture.competitionId !== target.competitionId) return fixture;
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
    
    // Mark this calendar matchday completed
    setCalendar((cal) =>
      cal.map((entry) => (entry.type === "match" && entry.fixtureId === target.id ? { ...entry, completed: true } : entry))
    );

    setSaveStatus(`Matchday ${matchday} simulated. Save available.`);
    setCurrentView("matchReport");
  }

  function handleStartLiveMatch(fixture: Fixture) {
    const state = startLiveMatch(fixture, database.players, database.tactics);
    setLiveMatchState(state);
    setCurrentView("liveMatch");
  }

  function handleUpdateLiveState(nextState: LiveMatchState) {
    setLiveMatchState(nextState);
  }

  function handleMatchFinished(finishedState: LiveMatchState) {
    const result = liveStateToResult(finishedState);
    setLastMatchResult(result);
    setLiveMatchState(undefined);

    // Record played match
    const updatedFixtures = fixtures.map((f) => (f.id === finishedState.fixture.id ? { ...f, played: true, result } : f));
    setFixtures(updatedFixtures);

    // Update stats
    setDatabase((current) => ({
      ...current,
      players: updatePlayerStats(current.players, result),
    }));

    // Mark calendar entry completed
    setCalendar((cal) =>
      cal.map((entry) => (entry.type === "match" && entry.fixtureId === finishedState.fixture.id ? { ...entry, completed: true } : entry))
    );

    // Simulate other AI fixtures of this matchday
    const formByClub = Object.fromEntries(table.map((row) => [row.clubId, row.form.filter((item) => item === "W").length / 5]));
    const fullySimulatedFixtures = updatedFixtures.map((fixture) => {
      if (fixture.matchday !== finishedState.fixture.matchday || fixture.played || fixture.competitionId !== finishedState.fixture.competitionId) return fixture;
      const home = database.clubs.find((club) => club.id === fixture.homeClubId);
      const away = database.clubs.find((club) => club.id === fixture.awayClubId);
      if (!home || !away) return fixture;
      const aiResult = simulateMatch(fixture.id, home, away, database.players, database.tactics, formByClub);
      return { ...fixture, played: true, result: aiResult };
    });
    setFixtures(fullySimulatedFixtures);

    setCurrentMatchday(finishedState.fixture.matchday + 1);
    setCurrentDate(advanceDate(currentDate));
    setInbox((messages) => [createMatchMessage(result, database.clubs), ...messages]);

    setSaveStatus(`Live match finished! Recorded.`);
    setCurrentView("matchReport");
  }

  function handleTrainSquad(focus: TrainingFocus) {
    if (!currentClubId) return;
    const trained = trainPlayers(database.players, currentClubId, focus);
    setDatabase((current) => ({
      ...current,
      players: trained,
    }));

    // Update active training entry on this date in calendar
    setCalendar((cal) =>
      cal.map((entry) => (entry.type === "training" && entry.date === currentDate ? { ...entry, completed: true } : entry))
    );

    setInbox((messages) => [
      {
        id: `msg-${Date.now()}`,
        date: currentDate,
        type: "Player",
        title: `Squad Training Complete (${focus.toUpperCase()})`,
        body: `Your players completed a focused training block on ${focus}. Fitness and tactical familiarity have been boosted across all fit participants.`,
        read: false,
      },
      ...messages,
    ]);

    setSaveStatus("Training completed. Stats boosted!");
  }

  function handleMakeOffer(playerId: string, amount: number): { accepted: boolean; reason: string } {
    const player = database.players.find((p) => p.id === playerId);
    const sellingClub = database.clubs.find((c) => c.id === player?.clubId);
    if (!player || !sellingClub || !currentClub) {
      return { accepted: false, reason: "Invalid target player or clubs." };
    }

    const evalRes = evaluateTransferOffer(player, currentClub, amount);
    const newOffer: TransferOffer = {
      id: `offer-${Date.now()}`,
      playerId,
      fromClubId: currentClub.id,
      toClubId: sellingClub.id,
      amount,
      status: evalRes.accepted ? "accepted" : "rejected",
      date: currentDate,
    };

    setTransferOffers((prev) => [...prev, newOffer]);

    if (evalRes.accepted) {
      // Transfer the player
      const updatedPlayers = database.players.map((p) => {
        if (p.id === playerId) {
          return {
            ...p,
            clubId: currentClub.id,
            wage: Math.round(p.wage * 1.1), // wage increase on transfer
          };
        }
        return p;
      });

      // Deduct budget
      const updatedClubs = database.clubs.map((c) => {
        if (c.id === currentClub.id) {
          return { ...c, budget: c.budget - amount };
        }
        if (c.id === sellingClub.id) {
          return { ...c, budget: c.budget + amount };
        }
        return c;
      });

      setDatabase((current) => ({
        ...current,
        players: updatedPlayers,
        clubs: updatedClubs,
      }));

      setInbox((messages) => [
        {
          id: `msg-${Date.now()}`,
          date: currentDate,
          type: "Transfer",
          title: `New Signing: ${player.displayName}!`,
          body: `We are pleased to announce that ${player.displayName} has agreed terms and completed his transfer from ${sellingClub.name} to our club for a fee of ${formatCurrency(amount)}.`,
          read: false,
        },
        ...messages,
      ]);
    }

    return evalRes;
  }

  function handleAdvanceWeek() {
    // Advance date by 7 days
    const nextDate = advanceDate(currentDate);
    setCurrentDate(nextDate);

    // Apply player recovery
    if (currentClubId) {
      const recovered = recoverPlayers(database.players, currentClubId);
      setDatabase((current) => ({
        ...current,
        players: recovered,
      }));
    }

    // AI simulations for intermediate matches if any
    setSaveStatus("Week advanced. Doubtful players recovering.");
  }

  function updateMiniface(playerId: string, dataUrl: string) {
    setDatabase((current) => ({
      ...current,
      players: current.players.map((player) => (player.id === playerId ? { ...player, minifacePath: dataUrl } : player)),
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
    
    // Load new expansion states
    setCups(loaded.cups ?? []);
    setEuropeanCompetitions(loaded.europeanCompetitions ?? []);
    setCalendar(loaded.calendar ?? []);
    setTransferOffers(loaded.transferOffers ?? []);
    setLiveMatchState(loaded.liveMatchState);

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
      cups,
      europeanCompetitions,
      calendar,
      transferOffers,
      liveMatchState,
    };
  }

  function renderView() {
    switch (currentView) {
      case "career":
      case "dashboard":
        return (
          <Dashboard
            currentClub={currentClub}
            opponent={nextOpponent}
            nextFixture={nextFixture}
            table={table.length ? table : createInitialTable(database.clubs)}
            inbox={inbox}
            onNavigate={(v) => {
              if (v === "fixtures") setCurrentView("fixtures");
              if (v === "leagueTable") setCurrentView("leagueTable");
              if (v === "inbox") setCurrentView("inbox");
              if (v === "clubSelect") setCurrentView("clubSelect");
            }}
            onSimulateNext={() => simulateFixture()}
          />
        );
      case "clubSelect":
        return (
          <ClubSelect
            clubs={database.clubs}
            currentClubId={currentClubId}
            onStartCareer={startCareer}
            onNavigateToCreate={() => setCurrentView("createClub")}
          />
        );
      case "createClub":
        return <CreateClub onCreateClub={handleCreateCustomClub} />;
      case "squad":
        return (
          <Squad
            club={currentClub}
            players={currentPlayers}
            onSelectPlayer={(id) => {
              setSelectedPlayerId(id);
              setCurrentView("playerProfile");
            }}
          />
        );
      case "playerProfile":
        return (
          <PlayerProfile
            player={selectedPlayer}
            club={database.clubs.find((club) => club.id === selectedPlayer?.clubId)}
            onBack={() => setCurrentView("squad")}
          />
        );
      case "clubProfile":
        return <ClubProfile club={currentClub} players={currentPlayers} />;
      case "leagueTable":
        return <LeagueTable table={table.length ? table : createInitialTable(database.clubs)} clubs={database.clubs} />;
      case "fixtures":
        return (
          <Fixtures
            fixtures={fixtures}
            clubs={database.clubs}
            currentClubId={currentClubId}
            onSimulate={(fid) => {
              const target = fixtures.find((f) => f.id === fid);
              if (target) {
                // If it's a user club fixture, start live match, otherwise run sim
                const isUser = target.homeClubId === currentClubId || target.awayClubId === currentClubId;
                if (isUser) {
                  handleStartLiveMatch(target);
                } else {
                  simulateFixture(fid);
                }
              }
            }}
          />
        );
      case "matchPreview":
        return <MatchPreview fixture={nextFixture} clubs={database.clubs} />;
      case "liveMatch":
        return (
          <LiveMatch
            liveState={liveMatchState}
            clubs={database.clubs}
            players={database.players}
            tactics={database.tactics}
            userClubId={currentClubId}
            onMatchFinished={handleMatchFinished}
            onUpdateLiveState={handleUpdateLiveState}
          />
        );
      case "matchReport":
        return <MatchReport result={lastMatchResult} clubs={database.clubs} players={database.players} />;
      case "transfers":
        return (
          <Transfers
            players={database.players}
            clubs={database.clubs}
            currentClub={currentClub}
            onMakeOffer={handleMakeOffer}
            transferWindowOpen={transferWindowOpen}
            offers={transferOffers}
          />
        );
      case "inbox":
        return <Inbox messages={inbox} />;
      case "databaseEditor":
        return (
          <DatabaseEditor
            players={database.players}
            clubs={database.clubs}
            query={databaseQuery}
            setQuery={setDatabaseQuery}
            onExport={exportDatabase}
            onImport={importDatabase}
          />
        );
      case "minifaceManager":
        return (
          <MinifaceManager
            players={currentClubId ? currentPlayers : database.players}
            onUpdateMiniface={updateMiniface}
            onRemoveMiniface={removeMiniface}
            warning={minifaceWarning}
            setWarning={setMinifaceWarning}
          />
        );
      case "settings":
        return <Settings onSave={manualSave} onLoad={manualLoad} onDelete={deleteSave} saveStatus={saveStatus} />;
      case "calendar":
        return (
          <Calendar
            calendar={calendar}
            currentDate={currentDate}
            currentClub={currentClub}
            players={database.players}
            onTrainSquad={handleTrainSquad}
            onNavigateMatch={(fid) => {
              const target = fixtures.find((f) => f.id === fid);
              if (target) handleStartLiveMatch(target);
            }}
            onAdvanceDate={handleAdvanceWeek}
          />
        );
      case "competitions":
        return <Competitions leagues={database.leagues} clubs={database.clubs} allFixtures={fixtures} currentClubId={currentClubId} />;
      case "nationalTeam":
        return <NationalTeam players={database.players} clubs={database.clubs} currentClubId={currentClubId} />;
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
    const rating = Number(
      ((player.stats.averageRating * player.stats.appearances + 6.3 + goals * 0.8 + assists * 0.35 - yellowCards * 0.15 - redCards * 0.7) / appeared).toFixed(2)
    );
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
        cleanSheets:
          player.stats.cleanSheets +
          (player.position === "GK" &&
          ((player.clubId === result.homeClubId && result.awayGoals === 0) || (player.clubId === result.awayClubId && result.homeGoals === 0))
            ? 1
            : 0),
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
    date: new Date().toISOString().slice(0, 10),
    type: "Report",
    title: `${home?.shortName ?? "Home"} ${result.homeGoals}-${result.awayGoals} ${away?.shortName ?? "Away"}`,
    body: `Match rating ${result.matchRating}. Possession ended ${result.stats.homePossession}-${result.stats.awayPossession}, with ${
      result.stats.homeShots + result.stats.awayShots
    } total shots. scorers: ${
      result.scorers.length ? result.scorers.map((s) => `Min ${s.minute}`).join(", ") : "None"
    }`,
    read: false,
  };
}

function advanceDate(value: string): string {
  const date = new Date(value);
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

export default App;
