import { ImageUp, Trash2 } from "lucide-react";
import { Miniface } from "../components/Miniface";
import type { Player } from "../types/football";

interface MinifaceManagerProps {
  players: Player[];
  onUpdateMiniface: (playerId: string, dataUrl: string) => void;
  onRemoveMiniface: (playerId: string) => void;
  warning: string;
  setWarning: (message: string) => void;
}

export function MinifaceManager({ players, onUpdateMiniface, onRemoveMiniface, warning, setWarning }: MinifaceManagerProps) {
  function handleFile(playerId: string, file?: File) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setWarning("Only PNG, JPG, JPEG, and WEBP files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const image = new Image();
      image.onload = () => {
        setWarning(image.width === image.height ? "Miniface imported." : `Warning: this image is ${image.width}x${image.height}. Recommended size is a square 256x256 image.`);
        onUpdateMiniface(playerId, dataUrl);
      };
      image.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Miniface Import Manager</h1>
          <p>Import, replace, or remove local player minifaces. The game keeps working without images.</p>
        </div>
      </div>
      {warning && <div className="notice">{warning}</div>}
      <div className="miniface-list">
        {players.map((player) => (
          <article key={player.id} className="miniface-row">
            <Miniface src={player.minifacePath} name={player.displayName} />
            <strong>{player.displayName}</strong>
            <span>{player.position} · {player.overall}</span>
            <label className="file-button">
              <ImageUp size={16} /> Import
              <input type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" onChange={(event) => handleFile(player.id, event.target.files?.[0])} />
            </label>
            <button onClick={() => onRemoveMiniface(player.id)}><Trash2 size={16} /> Remove</button>
          </article>
        ))}
      </div>
    </section>
  );
}
