import type { CareerSave } from "../types/football";

const SAVE_KEY = "fftm-career-save";

export function saveCareer(save: CareerSave): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ ...save, updatedAt: new Date().toISOString() }));
}

export function loadCareer(): CareerSave | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CareerSave;
  } catch {
    return null;
  }
}

export function deleteCareerSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function hasCareerSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}
