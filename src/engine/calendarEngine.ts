import type { CalendarEntry, TrainingFocus } from "../types/football";

/**
 * Generates a full seasonal calendar from July to May.
 * Includes match slots, training days, transfer windows, and international breaks.
 */
export function generateSeasonCalendar(
  season: string,
  startYear: number,
  totalMatchdays: number,
  leagueName: string,
): CalendarEntry[] {
  const entries: CalendarEntry[] = [];
  let id = 0;
  const next = () => `cal-${++id}`;

  const date = (year: number, month: number, day: number) =>
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Season start
  entries.push({
    id: next(), date: date(startYear, 7, 1), type: "season-start",
    title: `${season} Season Begins`, description: "Pre-season training camp opens.",
  });

  // Summer transfer window
  entries.push({
    id: next(), date: date(startYear, 7, 1), type: "transfer-window-open",
    title: "Summer Transfer Window Opens", description: "You can buy and sell players.",
  });
  entries.push({
    id: next(), date: date(startYear, 8, 31), type: "transfer-window-close",
    title: "Summer Transfer Window Closes", description: "No more signings until January.",
  });

  // International breaks
  const intlBreaks = [
    [startYear, 9, 2], [startYear, 9, 7],
    [startYear, 10, 7], [startYear, 10, 12],
    [startYear + 1, 3, 17], [startYear + 1, 3, 22],
  ] as const;
  for (const [y, m, d] of intlBreaks) {
    entries.push({
      id: next(), date: date(y, m, d), type: "international-break",
      title: "International Break", description: "Your national team players travel for international duty.",
    });
  }

  // Winter transfer window
  entries.push({
    id: next(), date: date(startYear + 1, 1, 1), type: "transfer-window-open",
    title: "Winter Transfer Window Opens", description: "January transfer window is open.",
  });
  entries.push({
    id: next(), date: date(startYear + 1, 1, 31), type: "transfer-window-close",
    title: "Winter Transfer Window Closes", description: "No more signings until summer.",
  });

  // Training days – generate one per week throughout the season
  const trainingFocuses: TrainingFocus[] = ["fitness", "attack", "defence", "set-pieces", "youth"];
  let weekCursor = new Date(startYear, 6, 8); // July 8
  const seasonEnd = new Date(startYear + 1, 4, 31); // May 31
  let focusIdx = 0;
  while (weekCursor < seasonEnd) {
    const dayStr = weekCursor.toISOString().slice(0, 10);
    entries.push({
      id: next(), date: dayStr, type: "training",
      title: `Training – ${trainingFocuses[focusIdx % trainingFocuses.length]}`,
      description: "Click to run this training session.",
      trainingFocus: trainingFocuses[focusIdx % trainingFocuses.length],
      completed: false,
    });
    weekCursor.setDate(weekCursor.getDate() + 7);
    focusIdx++;
  }

  // Match slots – spread matchdays from August through May
  const matchStartDate = new Date(startYear, 7, 5); // August 5
  const matchEndDate = new Date(startYear + 1, 4, 15); // May 15
  const totalMs = matchEndDate.getTime() - matchStartDate.getTime();
  for (let md = 1; md <= totalMatchdays; md++) {
    const t = totalMs * ((md - 1) / (totalMatchdays - 1));
    const matchDate = new Date(matchStartDate.getTime() + t);
    // Snap to Saturday
    const dayOfWeek = matchDate.getDay();
    matchDate.setDate(matchDate.getDate() + ((6 - dayOfWeek + 7) % 7));
    entries.push({
      id: next(),
      date: matchDate.toISOString().slice(0, 10),
      type: "match",
      title: `${leagueName} – Matchday ${md}`,
      description: `Matchday ${md} of ${totalMatchdays}`,
      completed: false,
    });
  }

  // Season end
  entries.push({
    id: next(), date: date(startYear + 1, 5, 31), type: "season-end",
    title: `${season} Season Ends`, description: "The season is over. Review your final standings.",
  });

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

export function isTransferWindowOpen(calendar: CalendarEntry[], currentDate: string): boolean {
  const relevant = calendar
    .filter((e) => e.date <= currentDate && (e.type === "transfer-window-open" || e.type === "transfer-window-close"))
    .sort((a, b) => b.date.localeCompare(a.date));
  return relevant[0]?.type === "transfer-window-open";
}
