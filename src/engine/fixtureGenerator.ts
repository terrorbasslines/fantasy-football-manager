import type { Fixture, League } from "../types/football";

export function generateFixtures(league: League): Fixture[] {
  const teams = [...league.teamIds];
  if (teams.length % 2 !== 0) teams.push("bye");

  const rounds = teams.length - 1;
  const half = teams.length / 2;
  const rotation = [...teams];
  const fixtures: Fixture[] = [];

  for (let round = 0; round < rounds; round += 1) {
    for (let i = 0; i < half; i += 1) {
      const home = rotation[i];
      const away = rotation[rotation.length - 1 - i];
      if (home === "bye" || away === "bye") continue;
      const flip = round % 2 === 1;
      fixtures.push({
        id: `md${round + 1}-${flip ? away : home}-${flip ? home : away}`,
        matchday: round + 1,
        homeClubId: flip ? away : home,
        awayClubId: flip ? home : away,
        played: false,
      });
    }
    const fixed = rotation[0];
    const rest = rotation.slice(1);
    rest.unshift(rest.pop()!);
    rotation.splice(0, rotation.length, fixed, ...rest);
  }

  const reverseFixtures = fixtures.map((fixture) => ({
    ...fixture,
    id: `md${fixture.matchday + rounds}-${fixture.awayClubId}-${fixture.homeClubId}`,
    matchday: fixture.matchday + rounds,
    homeClubId: fixture.awayClubId,
    awayClubId: fixture.homeClubId,
    played: false,
    result: undefined,
  }));

  return [...fixtures, ...reverseFixtures];
}
