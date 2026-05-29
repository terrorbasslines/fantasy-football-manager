export type Reputation = "Elite" | "High" | "Balanced" | "Developing" | "Modest";
export type Morale = "Excellent" | "Good" | "Okay" | "Low" | "Poor";
export type InjuryStatus = "Fit" | "Doubtful" | "Injured";
export type PreferredFoot = "Right" | "Left" | "Both";
export type CompetitionType = "league" | "cup" | "european";
export type TrainingFocus = "fitness" | "attack" | "defence" | "set-pieces" | "youth" | "rest";
export type CalendarEntryType = "match" | "training" | "transfer-window-open" | "transfer-window-close" | "international-break" | "season-start" | "season-end";

export type Position =
  | "GK"
  | "RB"
  | "CB"
  | "LB"
  | "RWB"
  | "LWB"
  | "CDM"
  | "CM"
  | "CAM"
  | "RM"
  | "LM"
  | "RW"
  | "LW"
  | "ST";

export interface Club {
  id: string;
  name: string;
  shortName: string;
  country: string;
  city: string;
  stadiumName: string;
  stadiumCapacity: number;
  primaryColor: string;
  secondaryColor: string;
  reputation: Reputation;
  budget: number;
  leagueId: string;
  rivalClubIds: string[];
  tacticalIdentity: string;
  squadIds: string[];
  logoPath: string;
  isUserClub?: boolean;
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  averageRating: number;
  injuries: number;
  minutesPlayed: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  age: number;
  nationality: string;
  clubId: string;
  position: Position;
  secondaryPositions: Position[];
  overall: number;
  potential: number;
  value: number;
  wage: number;
  contractUntil: string;
  preferredFoot: PreferredFoot;
  height: string;
  bodyType: string;
  morale: Morale;
  fitness: number;
  sharpness: number;
  injuryStatus: InjuryStatus;
  traits: string[];
  personality: string;
  minifacePath: string;
  role?: string;
  stats: PlayerStats;
  nationalTeam?: string;
  trainingBoost?: Partial<Record<TrainingFocus, number>>;
}

export interface League {
  id: string;
  name: string;
  shortName?: string;
  country: string;
  teamIds: string[];
  promotionRules: string;
  relegationRules: string;
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
  playoffSpot: number;
  type: CompetitionType;
  tier: number;
  parentLeagueId?: string;
  europeanSpots?: number;
  cupId?: string;
}

export interface CupRound {
  id: string;
  name: string;
  fixtures: Fixture[];
  completed: boolean;
}

export interface Cup {
  id: string;
  name: string;
  shortName: string;
  country: string;
  type: CompetitionType;
  currentRound: number;
  rounds: CupRound[];
  teamIds: string[];
}

export interface EuropeanGroup {
  groupId: string;
  teamIds: string[];
  fixtures: Fixture[];
  table: LeagueTableRow[];
}

export interface EuropeanCompetition {
  id: string;
  name: string;
  shortName: string;
  type: CompetitionType;
  phase: "group" | "r32" | "r16" | "qf" | "sf" | "final" | "complete";
  groups: EuropeanGroup[];
  knockoutRounds: CupRound[];
  qualifiedTeamIds: string[];
  season: string;
}

export interface Tactics {
  clubId: string;
  formation: Formation;
  mentality: "Defensive" | "Balanced" | "Attacking";
  pressingIntensity: "Low" | "Medium" | "High";
  defensiveLine: "Deep" | "Standard" | "High";
  passingStyle: "Direct" | "Mixed" | "Short";
  tempo: "Patient" | "Normal" | "Fast";
  width: "Narrow" | "Standard" | "Wide";
  counterAttack: boolean;
  playmakerId: string;
  captainId: string;
  penaltyTakerId: string;
  freeKickTakerId: string;
  cornerTakerId: string;
}

export type Formation =
  | "4-3-3"
  | "4-2-3-1"
  | "4-4-2"
  | "3-5-2"
  | "3-4-3"
  | "5-3-2"
  | "4-1-4-1";

export interface Fixture {
  id: string;
  matchday: number;
  homeClubId: string;
  awayClubId: string;
  played: boolean;
  result?: MatchResult;
  competitionId?: string;
  competitionName?: string;
  date?: string;
}

export interface MatchEvent {
  minute: number;
  type: "commentary" | "goal" | "card" | "injury" | "substitution" | "tactical";
  text: string;
  clubId?: string;
  playerId?: string;
}

export interface MatchResult {
  fixtureId: string;
  homeClubId: string;
  awayClubId: string;
  homeGoals: number;
  awayGoals: number;
  scorers: { playerId: string; clubId: string; minute: number }[];
  assists: { playerId: string; clubId: string; minute: number }[];
  yellowCards: { playerId: string; clubId: string; minute: number }[];
  redCards: { playerId: string; clubId: string; minute: number }[];
  injuries: { playerId: string; clubId: string; minute: number }[];
  substitutions: { offPlayerId: string; onPlayerId: string; clubId: string; minute: number }[];
  stats: {
    homePossession: number;
    awayPossession: number;
    homeShots: number;
    awayShots: number;
    homeShotsOnTarget: number;
    awayShotsOnTarget: number;
    homeCorners: number;
    awayCorners: number;
    homeFouls: number;
    awayFouls: number;
  };
  matchRating: number;
  commentary: MatchEvent[];
}

export interface LiveMatchState {
  fixture: Fixture;
  homeClubId: string;
  awayClubId: string;
  currentMinute: number;
  homeGoals: number;
  awayGoals: number;
  events: MatchEvent[];
  substitutionsUsed: { home: number; away: number };
  homeLineup: string[];
  awayLineup: string[];
  homeBench: string[];
  awayBench: string[];
  homeTactics?: Tactics;
  awayTactics?: Tactics;
  isFinished: boolean;
  pendingEvents: MatchEvent[];
}

export interface LeagueTableRow {
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
}

export interface CalendarEntry {
  id: string;
  date: string;
  type: CalendarEntryType;
  title: string;
  description?: string;
  fixtureId?: string;
  competitionId?: string;
  trainingFocus?: TrainingFocus;
  completed?: boolean;
}

export interface TransferOffer {
  id: string;
  playerId: string;
  fromClubId: string;
  toClubId: string;
  amount: number;
  status: "pending" | "accepted" | "rejected";
  date: string;
}

export interface InboxMessage {
  id: string;
  date: string;
  type: "Board" | "Injury" | "Transfer" | "Player" | "Preview" | "Report" | "Rival" | "League" | "International" | "Cup";
  title: string;
  body: string;
  read: boolean;
}

export interface NationalTeamSelection {
  country: string;
  playerIds: string[];
  competition: string;
  dates: string[];
}

export interface CareerSave {
  id: string;
  name: string;
  currentClubId: string;
  currentDate: string;
  currentSeason: string;
  currentMatchday: number;
  clubs: Club[];
  players: Player[];
  leagues: League[];
  fixtures: Fixture[];
  table: LeagueTableRow[];
  tactics: Tactics[];
  inbox: InboxMessage[];
  lastMatchResult?: MatchResult;
  updatedAt: string;
  // New fields
  cups?: Cup[];
  europeanCompetitions?: EuropeanCompetition[];
  calendar?: CalendarEntry[];
  transferOffers?: TransferOffer[];
  liveMatchState?: LiveMatchState;
  nationalTeamSelections?: NationalTeamSelection[];
}

export interface DatabaseState {
  clubs: Club[];
  players: Player[];
  leagues: League[];
  tactics: Tactics[];
  cups?: Cup[];
  europeanCompetitions?: EuropeanCompetition[];
}

export interface CustomClubConfig {
  name: string;
  shortName: string;
  city: string;
  stadiumName: string;
  primaryColor: string;
  secondaryColor: string;
}
