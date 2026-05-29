import type { Club, Fixture, LeagueTableRow, MatchResult } from "../types/football";

export function createInitialTable(clubs: Club[]): LeagueTableRow[] {
  return clubs.map((club) => ({
    clubId: club.id,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    form: [],
  }));
}

export function buildTableFromFixtures(clubs: Club[], fixtures: Fixture[]): LeagueTableRow[] {
  const table = createInitialTable(clubs);
  fixtures.forEach((fixture) => {
    if (fixture.played && fixture.result) {
      applyResult(table, fixture.result);
    }
  });
  return sortTable(table);
}

export function applyResult(table: LeagueTableRow[], result: MatchResult): LeagueTableRow[] {
  const home = table.find((row) => row.clubId === result.homeClubId);
  const away = table.find((row) => row.clubId === result.awayClubId);
  if (!home || !away) return table;

  updateRow(home, result.homeGoals, result.awayGoals);
  updateRow(away, result.awayGoals, result.homeGoals);

  if (result.homeGoals > result.awayGoals) {
    home.won += 1;
    away.lost += 1;
    home.points += 3;
    home.form = ["W", ...home.form].slice(0, 5);
    away.form = ["L", ...away.form].slice(0, 5);
  } else if (result.homeGoals < result.awayGoals) {
    away.won += 1;
    home.lost += 1;
    away.points += 3;
    away.form = ["W", ...away.form].slice(0, 5);
    home.form = ["L", ...home.form].slice(0, 5);
  } else {
    home.drawn += 1;
    away.drawn += 1;
    home.points += 1;
    away.points += 1;
    home.form = ["D", ...home.form].slice(0, 5);
    away.form = ["D", ...away.form].slice(0, 5);
  }

  return sortTable(table);
}

function updateRow(row: LeagueTableRow, forGoals: number, againstGoals: number) {
  row.played += 1;
  row.goalsFor += forGoals;
  row.goalsAgainst += againstGoals;
  row.goalDifference = row.goalsFor - row.goalsAgainst;
}

export function sortTable(table: LeagueTableRow[]): LeagueTableRow[] {
  return [...table].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.clubId.localeCompare(b.clubId);
  });
}
