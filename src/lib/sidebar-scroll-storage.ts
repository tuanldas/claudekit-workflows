const PREFIX = "sidebar-scroll";

export const SECTION_KEYS = {
  WORKFLOWS: "workflows",
  DOCS: "docs",
  SKILLS: "skills",
} as const;

export type SectionKey = (typeof SECTION_KEYS)[keyof typeof SECTION_KEYS];

function storageKey(key: string): string {
  return `${PREFIX}:${key}`;
}

export function saveSidebarScroll(key: string, position: number): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(storageKey(key), String(Math.trunc(position)));
  } catch {
    // Storage quota or privacy mode — silently ignore.
  }
}

export function getSidebarScroll(key: string): number {
  if (typeof sessionStorage === "undefined") return 0;
  const raw = sessionStorage.getItem(storageKey(key));
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}
