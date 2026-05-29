import { UserRound } from "lucide-react";

interface MinifaceProps {
  src: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

export function Miniface({ src, name, size = "md" }: MinifaceProps) {
  return (
    <div className={`miniface miniface-${size}`} title={name}>
      {src ? <img src={src} alt={name} /> : <UserRound aria-hidden="true" />}
    </div>
  );
}
