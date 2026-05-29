import type { League } from "../types/football";

// ─── Tier 1: Eredivisie ────────────────────────────────────────────────────
export const eredivisie: League = {
  id: "eredivisie",
  name: "Eredivisie",
  shortName: "ERE",
  country: "Netherlands",
  tier: 1,
  type: "league",
  teamIds: [
    "ajax", "psv", "feyenoord", "az-alkmaar", "utrecht",
    "twente", "vitesse", "groningen", "heerenveen", "sparta-rotterdam",
    "nec-nijmegen", "heracles", "fortuna-sittard", "go-ahead-eagles",
    "excelsior", "cambuur", "rkc-waalwijk", "almere-city",
  ],
  promotionRules: "Top 2 qualify for UCL. 3rd-5th for UEL/UECL.",
  relegationRules: "16th-18th relegated. 15th playoff.",
  pointsForWin: 3, pointsForDraw: 1, pointsForLoss: 0,
  playoffSpot: 15,
  europeanSpots: 5,
  cupId: "knvb-beker",
};

// ─── Tier 2: Eerste Divisie ─────────────────────────────────────────────────
export const eersteDiv: League = {
  id: "eerste-divisie",
  name: "Eerste Divisie",
  shortName: "ED",
  country: "Netherlands",
  tier: 2,
  type: "league",
  teamIds: [
    "jong-ajax", "jong-psv", "jong-az", "roda-jc", "den-bosch",
    "telstar", "dordrecht", "helmond-sport", "fc-eindhoven", "volendam",
    "jong-utrecht", "hvv-leiden", "maastricht", "nac-breda",
    "de-graafschap", "fc-emmen", "sc-cambuur-res", "fc-oss",
    "jong-vitesse", "jong-sparta",
  ],
  promotionRules: "1st promoted. 2nd-4th playoff for 2nd spot.",
  relegationRules: "19th-20th relegated to Tweede Divisie.",
  pointsForWin: 3, pointsForDraw: 1, pointsForLoss: 0,
  playoffSpot: 2,
  parentLeagueId: "eredivisie",
  cupId: "knvb-beker",
};

// ─── Tier 3: Tweede Divisie ─────────────────────────────────────────────────
export const tweedeDiv: League = {
  id: "tweede-divisie",
  name: "Tweede Divisie",
  shortName: "TD",
  country: "Netherlands",
  tier: 3,
  type: "league",
  teamIds: [
    "afc-amsterdam", "fc-lisse", "spakenburg", "ijsselmeervogels",
    "vvsb", "fc-volendam-b", "ter-leede", "hvv-don-bosco",
    "fc-dordrecht-b", "usv-hercules", "sc-haerlem", "rfc-reael",
    "kozakken-boys", "vv-katwijk", "fc-zwolle-am", "barendrecht",
    "afc-2", "zwolsche-boys",
  ],
  promotionRules: "1st and 2nd promoted. 3rd-4th playoff.",
  relegationRules: "17th-18th relegated to Derde Divisie.",
  pointsForWin: 3, pointsForDraw: 1, pointsForLoss: 0,
  playoffSpot: 3,
  parentLeagueId: "eerste-divisie",
  cupId: "knvb-beker",
};

// ─── Tier 4: Derde Divisie (Group A – where user's club starts) ─────────────
export const derdeDiv: League = {
  id: "derde-divisie-a",
  name: "Derde Divisie – Groep A",
  shortName: "DDA",
  country: "Netherlands",
  tier: 4,
  type: "league",
  teamIds: [
    "user-club",           // Player's own club
    "vv-noordwijk", "quick-boys", "alphense-boys", "vv-katwijk-b",
    "rfc-2", "hv-westlandia", "sdouc", "vv-rijnsburgse-boys",
    "de-meeuwen", "sc-rheden", "sv-capelle", "fc-lisse-b",
  ],
  promotionRules: "1st promoted to Tweede Divisie playoffs.",
  relegationRules: "12th relegated.",
  pointsForWin: 3, pointsForDraw: 1, pointsForLoss: 0,
  playoffSpot: 0,
  parentLeagueId: "tweede-divisie",
};

// ─── KNVB Beker ─────────────────────────────────────────────────────────────
export const knvbBeker: League = {
  id: "knvb-beker",
  name: "KNVB Beker",
  shortName: "KNVB",
  country: "Netherlands",
  tier: 0,
  type: "cup",
  teamIds: [],  // populated dynamically from all Dutch leagues
  promotionRules: "Winner qualifies for UECL.",
  relegationRules: "Single elimination.",
  pointsForWin: 1, pointsForDraw: 0, pointsForLoss: 0,
  playoffSpot: 0,
};

// ─── European Competitions ───────────────────────────────────────────────────
export const championsLeague: League = {
  id: "champions-league",
  name: "UEFA Champions League",
  shortName: "UCL",
  country: "Europe",
  tier: 0,
  type: "european",
  teamIds: [],
  promotionRules: "Group winners and runners-up advance to R16.",
  relegationRules: "3rd drops to UEL. 4th eliminated.",
  pointsForWin: 3, pointsForDraw: 1, pointsForLoss: 0,
  playoffSpot: 0,
};

export const europaLeague: League = {
  id: "europa-league",
  name: "UEFA Europa League",
  shortName: "UEL",
  country: "Europe",
  tier: 0,
  type: "european",
  teamIds: [],
  promotionRules: "Group winners and runners-up advance to R16.",
  relegationRules: "3rd drops to UECL. 4th eliminated.",
  pointsForWin: 3, pointsForDraw: 1, pointsForLoss: 0,
  playoffSpot: 0,
};

export const conferenceleague: League = {
  id: "conference-league",
  name: "UEFA Conference League",
  shortName: "UECL",
  country: "Europe",
  tier: 0,
  type: "european",
  teamIds: [],
  promotionRules: "Group winners advance to R16.",
  relegationRules: "Runners-up enter R32 playoff. 3rd-4th eliminated.",
  pointsForWin: 3, pointsForDraw: 1, pointsForLoss: 0,
  playoffSpot: 0,
};

// ─── Legacy (keep for compatibility) ────────────────────────────────────────
export const spotifySuperLiga: League = eredivisie;

export const leagues: League[] = [
  eredivisie, eersteDiv, tweedeDiv, derdeDiv,
  knvbBeker, championsLeague, europaLeague, conferenceleague,
];
