export const RECENT_SEARCHES_KEY = "claudekit-recent-searches";
export const RECENT_SEARCHES_MAX = 5;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getRecentSearches(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string): void {
  if (!isBrowser()) return;
  const trimmed = query.trim();
  if (!trimmed) return;
  const current = getRecentSearches().filter((q) => q !== trimmed);
  current.unshift(trimmed);
  const capped = current.slice(0, RECENT_SEARCHES_MAX);
  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(capped));
  } catch {
    // Quota or privacy mode — silently ignore.
  }
}

export function clearRecentSearches(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // ignore
  }
}
