import type { Club } from "../types/football";

// European clubs for UCL/UEL/UECL – fictional names inspired by real clubs
function eu(
  id: string, name: string, country: string, city: string,
  reputation: Club["reputation"], budget: number, primary: string, secondary: string,
): Club {
  return {
    id, name, shortName: name.slice(0, 12),
    country, city, stadiumName: `${city} Stadium`,
    stadiumCapacity: 40000 + Math.floor(Math.random() * 35000),
    primaryColor: primary, secondaryColor: secondary,
    reputation, budget, leagueId: "european",
    rivalClubIds: [], tacticalIdentity: "European elite football",
    squadIds: [], logoPath: "", isUserClub: false,
  };
}

export const europeanClubs: Club[] = [
  // Germany
  eu("fc-munchen", "FC München", "Germany", "Munich", "Elite", 120_000_000, "#CC0000", "#FFFFFF"),
  eu("dortmund-city", "Dortmund City", "Germany", "Dortmund", "Elite", 95_000_000, "#FFFF00", "#000000"),
  eu("leipzig-rb", "RB Leipzig", "Germany", "Leipzig", "High", 65_000_000, "#CC0000", "#FFFFFF"),
  eu("bayer-le", "Bayer Leverkusen FC", "Germany", "Leverkusen", "High", 55_000_000, "#000000", "#CC0000"),

  // Spain
  eu("real-mad", "Real Madrid CF", "Spain", "Madrid", "Elite", 200_000_000, "#FFFFFF", "#003399"),
  eu("fc-barca", "FC Barcelona", "Spain", "Barcelona", "Elite", 180_000_000, "#003399", "#CC0000"),
  eu("atletico-mad", "Atlético Madrid", "Spain", "Madrid", "Elite", 90_000_000, "#CC0000", "#FFFFFF"),
  eu("sevilla-cf", "Sevilla CF", "Spain", "Seville", "High", 50_000_000, "#CC0000", "#FFFFFF"),

  // England
  eu("city-fc", "City FC", "England", "Manchester", "Elite", 220_000_000, "#6CADDF", "#FFFFFF"),
  eu("united-fc", "United FC", "England", "Manchester", "Elite", 180_000_000, "#CC0000", "#FFFFFF"),
  eu("arsenal-fc", "Arsenal FC", "England", "London", "Elite", 160_000_000, "#CC0000", "#FFFFFF"),
  eu("chelsea-fc", "Chelsea FC", "England", "London", "Elite", 170_000_000, "#003399", "#FFFFFF"),
  eu("liverpool-fc", "Liverpool FC", "England", "Liverpool", "Elite", 175_000_000, "#CC0000", "#FFFFFF"),
  eu("spurs-fc", "Spurs FC", "England", "London", "High", 110_000_000, "#FFFFFF", "#003399"),

  // France
  eu("psg-fc", "Paris SG", "France", "Paris", "Elite", 250_000_000, "#003399", "#CC0000"),
  eu("marseille-om", "Olympique Marseille", "France", "Marseille", "High", 60_000_000, "#FFFFFF", "#003399"),

  // Italy
  eu("juventus-fc", "Juventus FC", "Italy", "Turin", "Elite", 120_000_000, "#000000", "#FFFFFF"),
  eu("inter-milan", "Inter Milan", "Italy", "Milan", "Elite", 100_000_000, "#003399", "#000000"),
  eu("ac-milan", "AC Milan", "Italy", "Milan", "Elite", 100_000_000, "#CC0000", "#000000"),
  eu("as-roma", "AS Roma", "Italy", "Rome", "High", 65_000_000, "#CC0000", "#FFFF00"),

  // Portugal
  eu("benfica-sl", "SL Benfica", "Portugal", "Lisbon", "High", 70_000_000, "#CC0000", "#FFFFFF"),
  eu("porto-fc", "FC Porto", "Portugal", "Porto", "High", 65_000_000, "#003399", "#FFFFFF"),
  eu("sporting-cp", "Sporting CP", "Portugal", "Lisbon", "High", 55_000_000, "#008000", "#FFFFFF"),

  // Belgium
  eu("anderlecht", "RSC Anderlecht", "Belgium", "Brussels", "Balanced", 35_000_000, "#663399", "#FFFFFF"),
  eu("club-brugge", "Club Brugge", "Belgium", "Bruges", "Balanced", 40_000_000, "#003399", "#000000"),

  // Turkey
  eu("galatasaray", "Galatasaray", "Turkey", "Istanbul", "High", 45_000_000, "#CC0000", "#FFFF00"),
  eu("fenerbahce", "Fenerbahçe", "Turkey", "Istanbul", "High", 42_000_000, "#FFFF00", "#003399"),

  // Scotland
  eu("celtic-fc", "Celtic FC", "Scotland", "Glasgow", "Balanced", 30_000_000, "#008000", "#FFFFFF"),
  eu("rangers-fc", "Rangers FC", "Scotland", "Glasgow", "Balanced", 28_000_000, "#003399", "#FFFFFF"),

  // Austria
  eu("salzburg-rb", "RB Salzburg", "Austria", "Salzburg", "Balanced", 35_000_000, "#CC0000", "#FFFFFF"),

  // Croatia
  eu("dinamo-zagreb", "Dinamo Zagreb", "Croatia", "Zagreb", "Developing", 20_000_000, "#003399", "#FFFFFF"),
];
