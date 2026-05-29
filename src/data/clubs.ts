import type { Club } from "../types/football";

// ─── Helper ──────────────────────────────────────────────────────────────────
function makeClub(
  id: string, name: string, city: string, stadium: string, cap: number,
  reputation: Club["reputation"], budget: number, leagueId: string,
  primary: string, secondary: string, identity: string,
  rivals: string[] = [],
): Club {
  return {
    id, name,
    shortName: name.replace(/^(FC |SV |VV |SC |RKC |NAC |NEC |AZ |PSV |AFC )/, "").slice(0, 12),
    country: "Netherlands", city, stadiumName: stadium,
    stadiumCapacity: cap, primaryColor: primary, secondaryColor: secondary,
    reputation, budget, leagueId, rivalClubIds: rivals,
    tacticalIdentity: identity, squadIds: [], logoPath: "", isUserClub: false,
  };
}

// ─── Eredivisie (Tier 1) ────────────────────────────────────────────────────
export const eredivisieClubs: Club[] = [
  makeClub("ajax", "AFC Ajax", "Amsterdam", "Johan Cruyff ArenA", 54990, "Elite", 95_000_000, "eredivisie", "#DC143C", "#FFFFFF", "Total football, high press, technical excellence", ["feyenoord", "psv"]),
  makeClub("psv", "PSV Eindhoven", "Eindhoven", "Philips Stadion", 35000, "Elite", 85_000_000, "eredivisie", "#FF0000", "#FFFFFF", "Fast transitions, clinical finishing", ["ajax", "az-alkmaar"]),
  makeClub("feyenoord", "Feyenoord", "Rotterdam", "De Kuip", 51117, "Elite", 72_000_000, "eredivisie", "#CC0000", "#FFFFFF", "Hard-working, passionate, direct play", ["ajax", "sparta-rotterdam"]),
  makeClub("az-alkmaar", "AZ Alkmaar", "Alkmaar", "AFAS Stadion", 17023, "High", 38_000_000, "eredivisie", "#CC0000", "#FFFFFF", "Organized pressing, fast combinations", ["psv"]),
  makeClub("utrecht", "FC Utrecht", "Utrecht", "Stadion Galgenwaard", 24500, "High", 28_000_000, "eredivisie", "#CC0000", "#FFFFFF", "Physical, set-piece strength", []),
  makeClub("twente", "FC Twente", "Enschede", "De Grolsch Veste", 30205, "High", 25_000_000, "eredivisie", "#CC0000", "#FFFFFF", "Disciplined midfield, strong defence", []),
  makeClub("vitesse", "Vitesse", "Arnhem", "GelreDome", 21118, "Balanced", 18_000_000, "eredivisie", "#FFFF00", "#000000", "Technical, attacking football", []),
  makeClub("groningen", "FC Groningen", "Groningen", "Euroborg", 22329, "Balanced", 12_000_000, "eredivisie", "#1C7C35", "#FFFFFF", "Compact, counter-attacking", []),
  makeClub("heerenveen", "SC Heerenveen", "Heerenveen", "Abe Lenstra Stadion", 26100, "Balanced", 14_000_000, "eredivisie", "#1440A0", "#FFFFFF", "Technical, quick transitions", []),
  makeClub("sparta-rotterdam", "Sparta Rotterdam", "Rotterdam", "Het Kasteel", 11000, "Balanced", 10_000_000, "eredivisie", "#CC0000", "#FFFFFF", "Compact, defensive, set pieces", ["feyenoord"]),
  makeClub("nec-nijmegen", "NEC Nijmegen", "Nijmegen", "Goffertstadion", 12500, "Balanced", 11_000_000, "eredivisie", "#FFFF00", "#00AA00", "Direct, physical", []),
  makeClub("heracles", "Heracles Almelo", "Almelo", "Polman Stadion", 10023, "Developing", 9_000_000, "eredivisie", "#000000", "#FFFFFF", "Compact, counter, set pieces", []),
  makeClub("fortuna-sittard", "Fortuna Sittard", "Sittard", "Fortuna Sittard Stadion", 12500, "Developing", 8_000_000, "eredivisie", "#FFFF00", "#008000", "Direct, hard-working", []),
  makeClub("go-ahead-eagles", "Go Ahead Eagles", "Deventer", "De Adelaarshorst", 10400, "Developing", 7_500_000, "eredivisie", "#E31E24", "#FFFF00", "Hard-working, direct", []),
  makeClub("excelsior", "Excelsior Rotterdam", "Rotterdam", "Van Donge & De Roo Stadion", 3531, "Developing", 5_000_000, "eredivisie", "#CC0000", "#FFFFFF", "Possession-based, technical", []),
  makeClub("cambuur", "SC Cambuur", "Leeuwarden", "Cambuur Stadion", 10000, "Developing", 6_000_000, "eredivisie", "#FFFF00", "#000000", "Energetic, pressing", []),
  makeClub("rkc-waalwijk", "RKC Waalwijk", "Waalwijk", "Mandemakers Stadion", 7500, "Modest", 5_500_000, "eredivisie", "#FFFFFF", "#003399", "Defensive, organised", []),
  makeClub("almere-city", "Almere City FC", "Almere", "Yanmar Stadion", 6000, "Modest", 5_000_000, "eredivisie", "#FF6600", "#FFFFFF", "Direct, energetic", []),
];

// ─── Eerste Divisie (Tier 2) ─────────────────────────────────────────────────
export const eersteClubs: Club[] = [
  makeClub("jong-ajax", "Jong Ajax", "Amsterdam", "De Toekomst", 2200, "Developing", 2_000_000, "eerste-divisie", "#DC143C", "#FFFFFF", "Technical, possession, development", []),
  makeClub("jong-psv", "Jong PSV", "Eindhoven", "AFAS Trainingscomplex", 3000, "Developing", 1_500_000, "eerste-divisie", "#FF0000", "#FFFFFF", "Fast, clinical, technical", []),
  makeClub("jong-az", "Jong AZ", "Alkmaar", "AFAS Stadion B", 2500, "Developing", 1_200_000, "eerste-divisie", "#CC0000", "#FFFFFF", "Pressing, technical", []),
  makeClub("roda-jc", "Roda JC Kerkrade", "Kerkrade", "Parkstad Limburg Stadion", 19979, "Balanced", 8_000_000, "eerste-divisie", "#FFFF00", "#000000", "Aggressive pressing, direct", []),
  makeClub("den-bosch", "FC Den Bosch", "Den Bosch", "Stadion De Vliert", 8500, "Developing", 4_000_000, "eerste-divisie", "#CC0000", "#FFFFFF", "Physical, direct, set pieces", []),
  makeClub("telstar", "SC Telstar", "Velsen-Zuid", "Brekelmans Rabobank Stadion", 3700, "Modest", 3_000_000, "eerste-divisie", "#FFFFFF", "#000000", "Compact, counter", []),
  makeClub("dordrecht", "FC Dordrecht", "Dordrecht", "Riwal Hoogwerkers Stadion", 4000, "Modest", 2_500_000, "eerste-divisie", "#CC0000", "#FFFFFF", "Defensive, set pieces", []),
  makeClub("helmond-sport", "Helmond Sport", "Helmond", "Lavans Stadion", 4500, "Modest", 2_000_000, "eerste-divisie", "#FF8C00", "#FFFFFF", "Direct, energetic", []),
  makeClub("fc-eindhoven", "FC Eindhoven", "Eindhoven", "Jan Louwers Stadion", 5200, "Modest", 3_500_000, "eerste-divisie", "#0000CC", "#FFFFFF", "Technical, possession", []),
  makeClub("volendam", "FC Volendam", "Volendam", "Kras Stadion", 7000, "Developing", 5_000_000, "eerste-divisie", "#FF8C00", "#FFFFFF", "Direct, hard-working", []),
  makeClub("jong-utrecht", "Jong FC Utrecht", "Utrecht", "Sportpark Zoudenbalch", 2000, "Developing", 1_000_000, "eerste-divisie", "#CC0000", "#FFFFFF", "Technical youth football", []),
  makeClub("hvv-leiden", "HVV Leiden", "Leiden", "Boerhaaveplein", 3000, "Modest", 1_800_000, "eerste-divisie", "#0000FF", "#FFFFFF", "Compact, counter", []),
  makeClub("maastricht", "MVV Maastricht", "Maastricht", "De Geusselt", 8700, "Modest", 2_200_000, "eerste-divisie", "#CC0000", "#FFFFFF", "Physical, organised", []),
  makeClub("nac-breda", "NAC Breda", "Breda", "Rat Verlegh Stadion", 17018, "Balanced", 7_000_000, "eerste-divisie", "#FFFF00", "#000000", "Direct, passionate", []),
  makeClub("de-graafschap", "De Graafschap", "Doetinchem", "De Vijverberg", 12600, "Balanced", 5_500_000, "eerste-divisie", "#003399", "#FFFF00", "Hard-working, physical", []),
  makeClub("fc-emmen", "FC Emmen", "Emmen", "De Oude Meerdijk", 10200, "Developing", 4_000_000, "eerste-divisie", "#CC0000", "#FFFFFF", "Direct, defensive", []),
  makeClub("sc-cambuur-res", "Jong Cambuur", "Leeuwarden", "Cambuur Training B", 1500, "Modest", 800_000, "eerste-divisie", "#FFFF00", "#000000", "Youth development", []),
  makeClub("fc-oss", "FC Oss", "Oss", "Frans Heesen Stadion", 4600, "Modest", 1_500_000, "eerste-divisie", "#FF0000", "#FFFFFF", "Energetic, direct", []),
  makeClub("jong-vitesse", "Jong Vitesse", "Arnhem", "Papendal", 1800, "Developing", 900_000, "eerste-divisie", "#FFFF00", "#000000", "Technical, attacking", []),
  makeClub("jong-sparta", "Jong Sparta", "Rotterdam", "Het Kasteel B", 1500, "Modest", 700_000, "eerste-divisie", "#CC0000", "#FFFFFF", "Compact youth play", []),
];

// ─── Tweede Divisie (Tier 3) ─────────────────────────────────────────────────
export const tweedeClubs: Club[] = [
  makeClub("afc-amsterdam", "AFC Amsterdam", "Amsterdam", "Sportpark De Toekomst", 2000, "Modest", 500_000, "tweede-divisie", "#DC143C", "#FFFFFF", "Technical, possession", []),
  makeClub("fc-lisse", "FC Lisse", "Lisse", "Sportpark De Vinkenveen", 3000, "Modest", 400_000, "tweede-divisie", "#000080", "#FFFFFF", "Compact, direct", []),
  makeClub("spakenburg", "SV Spakenburg", "Bunschoten", "Westdijk", 4000, "Modest", 300_000, "tweede-divisie", "#000080", "#FFFFFF", "Organised, set pieces", []),
  makeClub("ijsselmeervogels", "IJsselmeervogels", "Bunschoten", "De Nieuwe Gronden", 3500, "Modest", 250_000, "tweede-divisie", "#FF6600", "#FFFFFF", "Physical, direct", []),
  makeClub("vvsb", "VVSB", "Noordwijkerhout", "De Veste", 2000, "Modest", 200_000, "tweede-divisie", "#0000CC", "#FFFFFF", "Defensive, organised", []),
  makeClub("fc-volendam-b", "Jong Volendam", "Volendam", "Kras Stadion B", 1500, "Modest", 180_000, "tweede-divisie", "#FF8C00", "#FFFFFF", "Youth, direct", []),
  makeClub("ter-leede", "Ter Leede", "Sassenheim", "Sportpark Ter Leede", 2500, "Modest", 150_000, "tweede-divisie", "#008000", "#FFFFFF", "Compact, counter", []),
  makeClub("hvv-don-bosco", "VV Katwijk", "Katwijk", "Sportpark Nieuw Duinzicht", 3000, "Modest", 200_000, "tweede-divisie", "#0000FF", "#FFFFFF", "Hard-working", []),
  makeClub("fc-dordrecht-b", "FC Dordrecht B", "Dordrecht", "Riwal Stadion B", 1000, "Modest", 100_000, "tweede-divisie", "#CC0000", "#FFFFFF", "Youth play", []),
  makeClub("usv-hercules", "USV Hercules", "Utrecht", "Sportpark Zilveren Bal", 2000, "Modest", 120_000, "tweede-divisie", "#0000FF", "#FFFFFF", "Energetic, physical", []),
  makeClub("sc-haerlem", "SC Haerlem", "Haarlem", "Sportpark Heksloot", 2500, "Modest", 180_000, "tweede-divisie", "#003399", "#FFFF00", "Compact, set pieces", []),
  makeClub("rfc-reael", "RFC Reael", "Amsterdam", "Sportpark Noord", 1500, "Modest", 100_000, "tweede-divisie", "#FF0000", "#000000", "Direct, physical", []),
  makeClub("kozakken-boys", "Kozakken Boys", "Werkendam", "De Bosschen", 3500, "Modest", 220_000, "tweede-divisie", "#000000", "#FFFF00", "Physical, direct", []),
  makeClub("vv-katwijk", "VV Katwijk A", "Katwijk", "Zeehelden Stadion", 2200, "Modest", 160_000, "tweede-divisie", "#0000FF", "#FFFFFF", "Set pieces, organised", []),
  makeClub("fc-zwolle-am", "PEC Zwolle Amateur", "Zwolle", "Mac³Park B", 1000, "Modest", 90_000, "tweede-divisie", "#003366", "#FFFFFF", "Technical youth", []),
  makeClub("barendrecht", "FC Barendrecht", "Barendrecht", "Sportpark Smitshoek", 2000, "Modest", 130_000, "tweede-divisie", "#CC0000", "#FFFFFF", "Direct, energetic", []),
  makeClub("afc-2", "AFC 34", "Amsterdam", "Sportpark Ookmeer", 1500, "Modest", 80_000, "tweede-divisie", "#CC0000", "#FFFFFF", "Technical, passing", []),
  makeClub("zwolsche-boys", "Zwolsche Boys", "Zwolle", "Sportpark Holtenbroek", 2000, "Modest", 100_000, "tweede-divisie", "#003366", "#FFFFFF", "Physical, compact", []),
];

// ─── Derde Divisie Group A (Tier 4) — includes user club ───────────────────
export const derdeDivClubs: Club[] = [
  // USER CLUB — will be replaced by custom club if created
  {
    id: "user-club",
    name: "Moj Klub FC",
    shortName: "MKF",
    country: "Netherlands",
    city: "Rotterdam",
    stadiumName: "Community Ground",
    stadiumCapacity: 800,
    primaryColor: "#3B82F6",
    secondaryColor: "#FFFFFF",
    reputation: "Modest",
    budget: 50_000,
    leagueId: "derde-divisie-a",
    rivalClubIds: [],
    tacticalIdentity: "Grassroots grit, working hard for every point",
    squadIds: [],
    logoPath: "",
    isUserClub: true,
  },
  makeClub("vv-noordwijk", "VV Noordwijk", "Noordwijk", "Sportpark 't Nieuwland", 1200, "Modest", 60_000, "derde-divisie-a", "#0000FF", "#FFFFFF", "Compact, counter"),
  makeClub("quick-boys", "Quick Boys", "Katwijk", "Duinwijck", 1500, "Modest", 55_000, "derde-divisie-a", "#000000", "#FFFFFF", "Physical, set pieces"),
  makeClub("alphense-boys", "Alphense Boys", "Alphen aan den Rijn", "Sportpark Poldervaart", 1200, "Modest", 50_000, "derde-divisie-a", "#FF0000", "#FFFFFF", "Direct, hard-working"),
  makeClub("vv-katwijk-b", "SVV Scheveningen", "Scheveningen", "Sportpark Houtrust", 1000, "Modest", 45_000, "derde-divisie-a", "#003399", "#FFFFFF", "Organised, defensive"),
  makeClub("rfc-2", "HBS Craeyenhout", "The Hague", "Craeyenhout", 1800, "Modest", 65_000, "derde-divisie-a", "#CC0000", "#FFFF00", "Physical, direct"),
  makeClub("hv-westlandia", "Westlandia", "Naaldwijk", "Sportveld Westland", 900, "Modest", 40_000, "derde-divisie-a", "#008000", "#FFFFFF", "Counter-attack, compact"),
  makeClub("sdouc", "SV Robinhood", "Suriname District NL", "Sportpark Robinhood", 1000, "Modest", 35_000, "derde-divisie-a", "#FF6600", "#FFFFFF", "Energetic, direct"),
  makeClub("vv-rijnsburgse-boys", "Rijnsburgse Boys", "Rijnsburg", "Sportpark De Krom", 1200, "Modest", 45_000, "derde-divisie-a", "#0000FF", "#FFFFFF", "Set pieces, hard-working"),
  makeClub("de-meeuwen", "RVVH", "Ridderkerk", "Sportpark Poolster", 1100, "Modest", 42_000, "derde-divisie-a", "#CC0000", "#FFFFFF", "Compact, organised"),
  makeClub("sc-rheden", "SC Rhedenaar", "Rheden", "Sportveld De Heide", 800, "Modest", 30_000, "derde-divisie-a", "#006400", "#FFFFFF", "Defensive, physical"),
  makeClub("sv-capelle", "SV Capelle", "Capelle aan den IJssel", "Rivium Stadion", 1000, "Modest", 38_000, "derde-divisie-a", "#0000FF", "#FFFFFF", "Direct, energetic"),
  makeClub("fc-lisse-b", "RFC Leiden B", "Leiden", "Sportpark Merenwijk", 900, "Modest", 32_000, "derde-divisie-a", "#003399", "#FFFFFF", "Technical, youth-based"),
];

// ─── All clubs combined ──────────────────────────────────────────────────────
export const clubs: Club[] = [
  ...eredivisieClubs,
  ...eersteClubs,
  ...tweedeClubs,
  ...derdeDivClubs,
];
