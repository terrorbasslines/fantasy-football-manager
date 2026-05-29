import { Save, Trash2 } from "lucide-react";

interface SettingsProps {
  onSave: () => void;
  onLoad: () => void;
  onDelete: () => void;
  saveStatus: string;
}

export function Settings({ onSave, onLoad, onDelete, saveStatus }: SettingsProps) {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Settings</h1>
          <p>LocalStorage save manager for the MVP.</p>
        </div>
      </div>
      <div className="settings-grid">
        <article className="panel">
          <h3>Save Game Manager</h3>
          <p>{saveStatus}</p>
          <div className="action-row">
            <button className="primary" onClick={onSave}><Save size={16} /> Save</button>
            <button onClick={onLoad}>Load</button>
            <button className="danger" onClick={onDelete}><Trash2 size={16} /> Delete</button>
          </div>
        </article>
      </div>
    </section>
  );
}
