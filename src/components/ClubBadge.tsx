import type { Club } from "../types/football";

export function ClubBadge({ club }: { club: Club }) {
  return (
    <span className="club-badge" title={club.name}>
      <span className="club-dot" style={{ background: colorValue(club.primaryColor) }} />
      {club.shortName}
    </span>
  );
}

function colorValue(color: string): string {
  const map: Record<string, string> = {
    Orange: "#f58220",
    Green: "#43b36f",
    "Dark Blue": "#1b3b6f",
    White: "#f3f6fb",
    Steel: "#8091a7",
    Crimson: "#b23b4a",
  };
  return map[color] ?? color;
}
