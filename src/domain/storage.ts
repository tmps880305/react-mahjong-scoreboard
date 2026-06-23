import type { GameState } from "./types";

const STORAGE_KEY = "mahjong-scoreboard-state-v1";

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable or full; scoreboard simply won't persist
  }
}

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw) as GameState;
    // Backfill fields added after this state may have been saved.
    state.round.riichiDeclaredSeats ??= [];
    state.settings.westEntryScore ??= 30000;
    return state;
  } catch {
    return null;
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
