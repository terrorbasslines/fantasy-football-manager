import type { Player, Position } from "../types/football";

const baseStats = {
  appearances: 0, goals: 0, assists: 0, cleanSheets: 0,
  yellowCards: 0, redCards: 0, averageRating: 0, injuries: 0, minutesPlayed: 0,
};

function player(
  id: string, firstName: string, lastName: string, age: number,
  nationality: string, clubId: string, position: Position,
  secondaryPositions: Position[], overall: number, potential: number,
  value: number, wage: number, preferredFoot: Player["preferredFoot"],
  height: string, bodyType: string, traits: string[], personality: string,
  role?: string, nationalTeam?: string,
): Player {
  return {
    id, firstName, lastName, displayName: `${firstName} ${lastName}`,
    age, nationality, clubId, position, secondaryPositions,
    overall, potential, value, wage,
    contractUntil: "2029-06-30", preferredFoot, height, bodyType,
    morale: overall >= 82 ? "Good" : "Okay",
    fitness: 96, sharpness: 82, injuryStatus: "Fit",
    traits, personality, minifacePath: "", role,
    stats: { ...baseStats },
    nationalTeam,
  };
}

// ─── Ajax (Eredivisie) ───────────────────────────────────────────────────────
export const ajaxPlayers: Player[] = [
  player("ajax-gk1", "Lars", "de Boer", 27, "Dutch", "ajax", "GK", [], 85, 86, 35_000_000, 88_000, "Right", "1.92 m", "Tall", ["Sweeper Keeper", "Organizer"], "Calm", "1st GK", "Netherlands"),
  player("ajax-rb1", "Daan", "van Stein", 23, "Dutch", "ajax", "RB", ["RWB"], 82, 87, 28_000_000, 65_000, "Right", "1.79 m", "Athletic", ["Overlap", "High Stamina"], "Energetic", undefined, "Netherlands"),
  player("ajax-cb1", "Tom", "Brouwer", 26, "Dutch", "ajax", "CB", [], 84, 85, 38_000_000, 82_000, "Right", "1.89 m", "Strong", ["Aerial Threat", "Leadership"], "Commanding", "Captain", "Netherlands"),
  player("ajax-cb2", "Marcos", "Dias", 24, "Portuguese", "ajax", "CB", ["CDM"], 83, 87, 34_000_000, 74_000, "Right", "1.87 m", "Strong", ["Progressive Passer"], "Composed", undefined),
  player("ajax-lb1", "Felix", "Müller", 22, "German", "ajax", "LB", ["LWB"], 81, 88, 26_000_000, 58_000, "Left", "1.77 m", "Lean", ["Overlap", "Early Crosser"], "Ambitious", undefined),
  player("ajax-cdm1", "Ibrahim", "Diallo", 25, "French", "ajax", "CDM", ["CM"], 83, 85, 31_000_000, 72_000, "Right", "1.86 m", "Athletic", ["Ball Winner", "Press Resistant"], "Determined", undefined),
  player("ajax-cm1", "Sander", "Kool", 23, "Dutch", "ajax", "CM", ["CAM"], 82, 89, 30_000_000, 68_000, "Right", "1.82 m", "Balanced", ["Playmaker", "Line Breaker"], "Quiet talent", undefined, "Netherlands"),
  player("ajax-cam1", "Jari", "Litmanen Jr", 21, "Finnish", "ajax", "CAM", ["CM"], 81, 90, 28_000_000, 60_000, "Right", "1.78 m", "Lean", ["Flair", "One Touch"], "Creative", undefined),
  player("ajax-rw1", "Bryan", "Santos", 24, "Brazilian", "ajax", "RW", ["CAM"], 85, 88, 58_000_000, 95_000, "Right", "1.74 m", "Lean", ["Dribbler", "Flair", "Acceleration"], "Flamboyant", undefined),
  player("ajax-lw1", "Elias", "Bakker", 22, "Dutch", "ajax", "LW", ["ST"], 83, 90, 44_000_000, 78_000, "Left", "1.75 m", "Athletic", ["Flair", "Finesse Shot"], "Confident", undefined, "Netherlands"),
  player("ajax-st1", "Viktor", "Sorel", 26, "French", "ajax", "ST", ["LW"], 86, 87, 72_000_000, 110_000, "Right", "1.83 m", "Athletic", ["Clinical Finisher", "Poacher"], "Cold-blooded", undefined),
  player("ajax-gk2", "Pieter", "Nas", 24, "Dutch", "ajax", "GK", [], 76, 81, 9_000_000, 28_000, "Right", "1.90 m", "Tall", ["Reflexes"], "Solid reserve", undefined),
  player("ajax-cm2", "Owen", "Tol", 20, "Dutch", "ajax", "CM", ["CDM"], 79, 88, 18_000_000, 38_000, "Right", "1.84 m", "Balanced", ["Engine"], "Hungry prospect", undefined, "Netherlands"),
  player("ajax-st2", "Andre", "Moreau", 28, "Belgian", "ajax", "ST", [], 80, 81, 16_000_000, 52_000, "Right", "1.84 m", "Strong", ["Target Forward"], "Experienced backup", undefined),
  player("ajax-cb3", "Wouter", "Smit", 21, "Dutch", "ajax", "CB", ["RB"], 78, 85, 14_000_000, 32_000, "Right", "1.87 m", "Strong", ["Aerial"], "Developing talent", undefined),
  player("ajax-lb2", "Kim", "Bergsen", 25, "Norwegian", "ajax", "LB", [], 78, 79, 11_000_000, 34_000, "Left", "1.78 m", "Balanced", ["High Stamina"], "Reliable", undefined),
  player("ajax-rw2", "Levy", "Prins", 19, "Dutch", "ajax", "RW", ["LW"], 75, 87, 12_000_000, 24_000, "Left", "1.72 m", "Lean", ["Acceleration"], "Academy gem", undefined),
  player("ajax-cdm2", "Eddy", "Claes", 27, "Belgian", "ajax", "CDM", [], 79, 80, 13_000_000, 44_000, "Right", "1.88 m", "Strong", ["Tackler"], "Disciplined", undefined),
];

// ─── PSV (Eredivisie) ────────────────────────────────────────────────────────
export const psvPlayers: Player[] = [
  player("psv-gk1", "Marco", "Willemse", 29, "Dutch", "psv", "GK", [], 86, 86, 38_000_000, 90_000, "Right", "1.91 m", "Tall", ["Shot Stopper", "Organizer"], "Vocal", "1st GK", "Netherlands"),
  player("psv-rb1", "Dario", "Ferreira", 25, "Portuguese", "psv", "RB", ["RWB"], 83, 85, 29_000_000, 68_000, "Right", "1.80 m", "Athletic", ["Overlap"], "Professional", undefined),
  player("psv-cb1", "Jens", "Hendrik", 27, "Dutch", "psv", "CB", [], 84, 85, 36_000_000, 80_000, "Right", "1.90 m", "Strong", ["Aerial Threat", "Leadership"], "Commanding", "Captain", "Netherlands"),
  player("psv-cb2", "Malo", "Le Goff", 23, "French", "psv", "CB", [], 82, 88, 30_000_000, 68_000, "Right", "1.87 m", "Strong", ["Interceptions"], "Calm", undefined),
  player("psv-lb1", "Nathan", "Koops", 24, "Dutch", "psv", "LB", ["LWB"], 81, 84, 22_000_000, 56_000, "Left", "1.78 m", "Lean", ["Early Crosser"], "Attacking fullback", undefined, "Netherlands"),
  player("psv-cdm1", "Rasmus", "Holm", 26, "Danish", "psv", "CDM", ["CM"], 82, 83, 28_000_000, 66_000, "Right", "1.85 m", "Athletic", ["Ball Winner"], "Determined", undefined),
  player("psv-cm1", "Frenky", "de Hart", 22, "Dutch", "psv", "CM", ["CAM"], 83, 91, 42_000_000, 78_000, "Right", "1.81 m", "Lean", ["Through Balls", "Playmaker"], "Creative", undefined, "Netherlands"),
  player("psv-cam1", "José", "Mendez", 24, "Spanish", "psv", "CAM", ["CM"], 83, 86, 36_000_000, 72_000, "Left", "1.76 m", "Lean", ["Flair", "Finesse Shot"], "Artistic", undefined),
  player("psv-rw1", "Lasse", "Berg", 25, "Danish", "psv", "RW", ["CAM"], 84, 85, 48_000_000, 86_000, "Right", "1.75 m", "Lean", ["Dribbler", "Acceleration"], "Fearless", undefined),
  player("psv-lw1", "Antony", "Carvalho", 23, "Brazilian", "psv", "LW", ["ST"], 84, 89, 55_000_000, 90_000, "Left", "1.73 m", "Lean", ["Flair", "Outside Foot Shot"], "Explosive", undefined),
  player("psv-st1", "Gunnar", "Nielsen", 27, "Icelandic", "psv", "ST", [], 85, 85, 62_000_000, 100_000, "Right", "1.88 m", "Strong", ["Clinical Finisher", "Target Forward"], "Ruthless", undefined),
  player("psv-gk2", "Bjorn", "Peters", 23, "Dutch", "psv", "GK", [], 74, 80, 7_000_000, 22_000, "Right", "1.89 m", "Tall", ["Reflexes"], "Patient backup", undefined),
  player("psv-cm2", "Rutger", "van Vliet", 21, "Dutch", "psv", "CM", [], 78, 86, 14_000_000, 30_000, "Right", "1.83 m", "Balanced", ["Engine"], "Rising star", undefined),
  player("psv-st2", "Emile", "Dumont", 29, "French", "psv", "ST", ["RW"], 79, 79, 14_000_000, 50_000, "Right", "1.82 m", "Athletic", ["Poacher"], "Reliable", undefined),
  player("psv-cb3", "Nico", "Schmidt", 24, "German", "psv", "CB", [], 80, 83, 17_000_000, 40_000, "Right", "1.88 m", "Strong", ["No Nonsense"], "Solid backup", undefined),
  player("psv-lb2", "Aaron", "de Vries", 26, "Dutch", "psv", "LB", [], 78, 79, 11_000_000, 34_000, "Left", "1.79 m", "Balanced", ["High Stamina"], "Dependable", undefined),
  player("psv-rw2", "Sem", "Wilders", 19, "Dutch", "psv", "RW", ["LW"], 74, 86, 11_000_000, 22_000, "Left", "1.73 m", "Lean", ["Acceleration"], "Academy product", undefined),
  player("psv-cdm2", "Tobias", "Klar", 28, "German", "psv", "CDM", [], 78, 79, 10_000_000, 42_000, "Right", "1.87 m", "Strong", ["Tackler"], "Experienced", undefined),
];

// ─── Feyenoord ───────────────────────────────────────────────────────────────
export const feyenoordPlayers: Player[] = [
  player("fey-gk1", "Rody", "Klaassen", 28, "Dutch", "feyenoord", "GK", [], 84, 85, 32_000_000, 82_000, "Right", "1.90 m", "Tall", ["Sweeper Keeper"], "Vocal", "1st GK", "Netherlands"),
  player("fey-rb1", "Kees", "Otten", 24, "Dutch", "feyenoord", "RB", ["RWB"], 80, 84, 22_000_000, 56_000, "Right", "1.80 m", "Athletic", ["Overlap"], "Direct", undefined, "Netherlands"),
  player("fey-cb1", "Gideon", "Mensah", 27, "Ghanaian", "feyenoord", "CB", [], 83, 84, 32_000_000, 76_000, "Right", "1.91 m", "Strong", ["Aerial Threat", "Leadership"], "Dominant", "Captain", undefined),
  player("fey-cb2", "Lars", "den Ouden", 25, "Dutch", "feyenoord", "CB", [], 81, 84, 24_000_000, 62_000, "Right", "1.87 m", "Strong", ["Progressive Passer"], "Composed", undefined, "Netherlands"),
  player("fey-lb1", "Noam", "Cohen", 23, "Israeli", "feyenoord", "LB", ["LWB"], 80, 85, 20_000_000, 52_000, "Left", "1.77 m", "Lean", ["Early Crosser"], "Technical", undefined),
  player("fey-cdm1", "Terence", "Agyenim", 26, "Ghanaian", "feyenoord", "CDM", [], 81, 82, 24_000_000, 60_000, "Right", "1.85 m", "Athletic", ["Ball Winner", "Engine"], "Physical", undefined),
  player("fey-cm1", "Pieter", "Lindstrøm", 22, "Danish", "feyenoord", "CM", ["CAM"], 82, 90, 36_000_000, 72_000, "Right", "1.80 m", "Balanced", ["Through Balls", "Playmaker"], "Talented", undefined),
  player("fey-cam1", "Emre", "Taşkin", 25, "Turkish", "feyenoord", "CAM", ["CM"], 82, 84, 30_000_000, 68_000, "Right", "1.77 m", "Lean", ["Flair", "Finesse Shot"], "Technical", undefined),
  player("fey-rw1", "Quinten", "Mooij", 22, "Dutch", "feyenoord", "RW", ["CAM"], 83, 90, 42_000_000, 78_000, "Left", "1.74 m", "Lean", ["Dribbler", "Flair"], "Exciting", undefined, "Netherlands"),
  player("fey-lw1", "Igor", "Paixão", 25, "Portuguese", "feyenoord", "LW", ["ST"], 83, 85, 38_000_000, 74_000, "Left", "1.76 m", "Lean", ["Flair", "Outside Foot Shot"], "Creative", undefined),
  player("fey-st1", "Santiago", "Giménez", 24, "Mexican", "feyenoord", "ST", [], 86, 89, 68_000_000, 105_000, "Right", "1.82 m", "Athletic", ["Clinical Finisher", "First Touch"], "Lethal", undefined),
  player("fey-gk2", "Stef", "Wirtz", 22, "Dutch", "feyenoord", "GK", [], 73, 79, 6_000_000, 20_000, "Right", "1.88 m", "Tall", ["Reflexes"], "Learning", undefined),
  player("fey-cm2", "Michiel", "de Jong", 21, "Dutch", "feyenoord", "CM", [], 77, 85, 12_000_000, 28_000, "Right", "1.82 m", "Balanced", ["Engine"], "Energetic", undefined),
  player("fey-st2", "Ayase", "Ueda", 26, "Japanese", "feyenoord", "ST", ["RW"], 79, 80, 14_000_000, 48_000, "Right", "1.80 m", "Athletic", ["Poacher"], "Clinical", undefined),
  player("fey-cb3", "Bryan", "Linssen", 32, "Dutch", "feyenoord", "CB", ["ST"], 76, 76, 5_000_000, 38_000, "Right", "1.83 m", "Strong", ["No Nonsense"], "Veteran", undefined),
  player("fey-lb2", "Sven", "Nieuwpoort", 24, "Dutch", "feyenoord", "LB", [], 78, 81, 12_000_000, 32_000, "Left", "1.79 m", "Balanced", ["High Stamina"], "Reliable", undefined),
  player("fey-rw2", "Alvin", "Kasius", 22, "Dutch", "feyenoord", "RW", ["RB"], 76, 83, 11_000_000, 26_000, "Right", "1.76 m", "Lean", ["Dribbler"], "Promising", undefined),
  player("fey-cdm2", "Dávid", "Hancko", 26, "Slovak", "feyenoord", "CDM", ["CB"], 81, 82, 24_000_000, 58_000, "Left", "1.85 m", "Athletic", ["Interceptor"], "Aggressive", undefined),
];

// ─── User Club (Derde Divisie) — weak squad ──────────────────────────────────
export const userClubPlayers: Player[] = [
  player("uc-gk1", "Bart", "Willems", 34, "Dutch", "user-club", "GK", [], 54, 54, 50_000, 800, "Right", "1.88 m", "Tall", ["Organizer"], "Old veteran", "1st GK"),
  player("uc-rb1", "Mehmet", "Yıldız", 22, "Dutch", "user-club", "RB", ["CB"], 50, 58, 30_000, 500, "Right", "1.77 m", "Balanced", ["High Stamina"], "Energetic amateur"),
  player("uc-cb1", "Rico", "Lammers", 28, "Dutch", "user-club", "CB", [], 53, 54, 40_000, 600, "Right", "1.86 m", "Strong", ["No Nonsense"], "Sunday league regular"),
  player("uc-cb2", "Henk", "de Vos", 30, "Dutch", "user-club", "CB", [], 51, 51, 25_000, 500, "Right", "1.84 m", "Strong", ["Aerial Threat"], "Honest defender"),
  player("uc-lb1", "Joey", "Bosman", 24, "Dutch", "user-club", "LB", [], 50, 55, 28_000, 480, "Left", "1.75 m", "Lean", [], "Willing worker"),
  player("uc-cdm1", "Teun", "Groene", 27, "Dutch", "user-club", "CDM", ["CM"], 52, 54, 35_000, 520, "Right", "1.82 m", "Athletic", ["Tackler"], "Reliable engine"),
  player("uc-cm1", "Stef", "van der Berg", 23, "Dutch", "user-club", "CM", [], 51, 58, 32_000, 480, "Right", "1.80 m", "Balanced", [], "Technical amateur"),
  player("uc-cm2", "Arno", "Ruiter", 26, "Dutch", "user-club", "CM", ["CDM"], 49, 51, 20_000, 400, "Right", "1.81 m", "Balanced", [], "Workmanlike midfielder"),
  player("uc-rw1", "Dries", "Peeters", 25, "Belgian", "user-club", "RW", ["ST"], 52, 55, 38_000, 500, "Right", "1.74 m", "Lean", ["Acceleration"], "Pacey winger"),
  player("uc-lw1", "Kevin", "Morel", 21, "Dutch", "user-club", "LW", ["ST"], 49, 60, 28_000, 420, "Left", "1.72 m", "Lean", [], "Raw talent, high ceiling"),
  player("uc-st1", "Ruud", "van Son", 29, "Dutch", "user-club", "ST", [], 55, 56, 45_000, 620, "Right", "1.83 m", "Strong", ["Target Forward", "Poacher"], "Club's best scorer"),
  player("uc-gk2", "Tim", "Boer", 20, "Dutch", "user-club", "GK", [], 44, 56, 10_000, 300, "Right", "1.87 m", "Tall", [], "Youth keeper"),
  player("uc-cb3", "Piet", "Vries", 31, "Dutch", "user-club", "CB", ["RB"], 48, 48, 15_000, 400, "Right", "1.85 m", "Strong", [], "Experienced backup"),
  player("uc-cm3", "Lars", "Kloos", 19, "Dutch", "user-club", "CM", ["CAM"], 46, 63, 18_000, 350, "Right", "1.78 m", "Lean", [], "Academy prospect"),
  player("uc-st2", "Michel", "Jansen", 27, "Dutch", "user-club", "ST", ["RW"], 50, 51, 22_000, 440, "Right", "1.80 m", "Athletic", [], "Utility forward"),
  player("uc-rb2", "Sander", "Hoek", 22, "Dutch", "user-club", "RB", ["LB"], 47, 54, 14_000, 320, "Right", "1.76 m", "Lean", [], "Backup fullback"),
  player("uc-cam1", "Erwin", "Haan", 24, "Dutch", "user-club", "CAM", ["CM"], 51, 56, 30_000, 460, "Left", "1.75 m", "Balanced", ["Set Pieces"], "Creative spark"),
  player("uc-cdm2", "Martijn", "Bak", 32, "Dutch", "user-club", "CDM", ["CB"], 50, 50, 12_000, 380, "Right", "1.86 m", "Strong", ["Tackler"], "Old warhorse"),
];

// ─── Other Eredivisie clubs — abbreviated squads ─────────────────────────────
function makeSquad(clubId: string, baseOvr: number, count: number = 18): Player[] {
  const positions: Position[] = ["GK","RB","CB","CB","LB","CDM","CM","CM","CAM","RW","LW","ST","GK","CB","CDM","CM","RW","ST"];
  const nats = ["Dutch","Dutch","Dutch","Belgian","German","Danish","Swedish","Dutch"];
  const firstNames = ["Jan","Kees","Sven","Lars","Tom","Erik","Niels","Bram","Tim","Joep","Bart","Ruben","Max","Milan","Arno","Daan","Finn","Piet"];
  const lastNames = ["de Boer","Smit","van den Berg","Willems","Peters","Jansen","Bakker","Visser","Meijer","de Vries","Hendriks","Groot","van Dam","Prins","Klein","van Dijk","Hoek","Brouwer"];
  const results: Player[] = [];
  for (let i = 0; i < count; i++) {
    const pos = positions[i % positions.length];
    const ovr = Math.max(44, baseOvr - Math.floor(i / 3) * 3 + Math.floor(Math.random() * 5));
    const id = `${clubId}-p${i + 1}`;
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i + Math.floor(i / 2)) % lastNames.length];
    results.push({
      id, firstName: fn, lastName: ln, displayName: `${fn} ${ln}`,
      age: 19 + Math.floor(Math.random() * 14),
      nationality: nats[i % nats.length], clubId, position: pos,
      secondaryPositions: [], overall: ovr, potential: Math.min(99, ovr + Math.floor(Math.random() * 8)),
      value: ovr * ovr * 200, wage: ovr * 800,
      contractUntil: "2027-06-30", preferredFoot: Math.random() > 0.2 ? "Right" : "Left",
      height: `${1.72 + Math.random() * 0.2}`.slice(0, 5) + " m",
      bodyType: ["Lean", "Balanced", "Strong", "Athletic"][i % 4],
      morale: ovr >= 75 ? "Good" : "Okay", fitness: 85 + Math.floor(Math.random() * 10),
      sharpness: 70 + Math.floor(Math.random() * 20), injuryStatus: "Fit",
      traits: [], personality: "Professional", minifacePath: "",
      stats: { ...baseStats },
    });
  }
  return results;
}

// Eredivisie squads
export const azPlayers = makeSquad("az-alkmaar", 78);
export const utrechtPlayers = makeSquad("utrecht", 75);
export const twentePlayers = makeSquad("twente", 76);
export const vitessePlayers = makeSquad("vitesse", 73);
export const groningenPlayers = makeSquad("groningen", 72);
export const heerenveen = makeSquad("heerenveen", 73);
export const spartaPlayers = makeSquad("sparta-rotterdam", 71);
export const necPlayers = makeSquad("nec-nijmegen", 71);
export const heraclesPlayers = makeSquad("heracles", 70);
export const fortunaPlayers = makeSquad("fortuna-sittard", 69);
export const goaheadPlayers = makeSquad("go-ahead-eagles", 69);
export const excelsiorPlayers = makeSquad("excelsior", 68);
export const cambuurPlayers = makeSquad("cambuur", 68);
export const rkcPlayers = makeSquad("rkc-waalwijk", 67);
export const almerePlayers = makeSquad("almere-city", 66);

// Eerste Divisie squads
export const eersteSquads = [
  ...makeSquad("jong-ajax", 73),
  ...makeSquad("jong-psv", 71),
  ...makeSquad("jong-az", 70),
  ...makeSquad("roda-jc", 70),
  ...makeSquad("den-bosch", 68),
  ...makeSquad("telstar", 66),
  ...makeSquad("dordrecht", 65),
  ...makeSquad("helmond-sport", 64),
  ...makeSquad("fc-eindhoven", 66),
  ...makeSquad("volendam", 68),
  ...makeSquad("jong-utrecht", 70),
  ...makeSquad("hvv-leiden", 63),
  ...makeSquad("maastricht", 64),
  ...makeSquad("nac-breda", 70),
  ...makeSquad("de-graafschap", 69),
  ...makeSquad("fc-emmen", 67),
  ...makeSquad("sc-cambuur-res", 64),
  ...makeSquad("fc-oss", 63),
  ...makeSquad("jong-vitesse", 70),
  ...makeSquad("jong-sparta", 68),
];

// Tweede Divisie squads
export const tweedeSquads = [
  "afc-amsterdam","fc-lisse","spakenburg","ijsselmeervogels","vvsb",
  "fc-volendam-b","ter-leede","hvv-don-bosco","fc-dordrecht-b","usv-hercules",
  "sc-haerlem","rfc-reael","kozakken-boys","vv-katwijk","fc-zwolle-am",
  "barendrecht","afc-2","zwolsche-boys",
].flatMap((id) => makeSquad(id, 59, 16));

// Derde Divisie squads (minus user-club)
export const derdeDivSquads = [
  "vv-noordwijk","quick-boys","alphense-boys","vv-katwijk-b","rfc-2",
  "hv-westlandia","sdouc","vv-rijnsburgse-boys","de-meeuwen","sc-rheden",
  "sv-capelle","fc-lisse-b",
].flatMap((id) => makeSquad(id, 53, 16));

// Legacy exports for compatibility
export const nickelodeonPlayers = ajaxPlayers;
export const hondsbergPlayers = feyenoordPlayers;

export const players: Player[] = [
  ...ajaxPlayers,
  ...psvPlayers,
  ...feyenoordPlayers,
  ...azPlayers, ...utrechtPlayers, ...twentePlayers, ...vitessePlayers,
  ...groningenPlayers, ...heerenveen, ...spartaPlayers, ...necPlayers,
  ...heraclesPlayers, ...fortunaPlayers, ...goaheadPlayers, ...excelsiorPlayers,
  ...cambuurPlayers, ...rkcPlayers, ...almerePlayers,
  ...eersteSquads,
  ...tweedeSquads,
  ...derdeDivSquads,
  ...userClubPlayers,
];
