# Fantasy Football Text Manager

A React + TypeScript MVP for a fictional, text-based football management simulator.

## MVP Features

- Select Nickelodeon FC or Hondsberg FC
- View squad lists and player profiles
- Import, replace, and remove square miniface images
- Generate a double round-robin Spotify Super Liga fixture list
- Simulate matchdays with text commentary, scorers, cards, injuries, substitutions, stats, and reports
- View the league table
- Save, load, and delete career progress with LocalStorage
- Import and export the editable database as JSON

## Run

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

For a non-technical Windows review flow, use:

```text
install-windows.bat
run-windows.bat
```

The app includes web app metadata, so Chrome and Edge can install it as a standalone browser app after it is running.

## Structure

- `src/types/football.ts` contains the shared data model interfaces.
- `src/data/` contains starter database seed data and JSON reference files.
- `src/engine/` contains fixtures, match simulation, league table, development, and transfer logic.
- `src/storage/saveManager.ts` contains the LocalStorage MVP save system.
- `src/components/` contains reusable UI.
- `src/pages/` contains the game screens.
