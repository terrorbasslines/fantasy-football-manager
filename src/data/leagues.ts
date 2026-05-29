import type { League } from "../types/football";

export const spotifySuperLiga: League = {
  id: "spotify-super-liga",
  name: "Spotify Super Liga",
  country: "Netherlands",
  teamIds: [
    "nickelodeon-fc",
    "hondsberg-fc",
    "amstel-athletic",
    "rotterdam-rangers",
    "utrecht-united",
    "eindhoven-city",
    "groningen-green",
    "haarlem-harbor",
    "zwolle-zenith",
    "breda-brigade",
    "maastricht-miners",
    "alkmaar-arrow",
    "delft-dynamo",
    "leiden-lions",
    "arnhem-aegis",
    "enschede-eagles",
    "tilburg-titans",
    "den-haag-dunes",
  ],
  promotionRules: "Top clubs qualify for continental fantasy competitions in future versions.",
  relegationRules: "17th and 18th are relegated. 16th enters a playoff.",
  pointsForWin: 3,
  pointsForDraw: 1,
  pointsForLoss: 0,
  playoffSpot: 16,
};

export const leagues: League[] = [spotifySuperLiga];
