import type { AppState } from "@/types";

const STORAGE_KEY = "docx_app_state_v1";

// PUBLIC_INTERFACE
export function loadState(): AppState | undefined {
  /** Loads application state from localStorage, if available and valid. */
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as AppState;
    // Basic shape validation
    if (!parsed || typeof parsed !== "object") return undefined;
    if (parsed.documents && !Array.isArray(parsed.documents)) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

// PUBLIC_INTERFACE
export function saveState(state: AppState) {
  /** Saves application state to localStorage. */
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors etc.
  }
}

// PUBLIC_INTERFACE
export function clearState() {
  /** Clears stored application state from localStorage. */
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
