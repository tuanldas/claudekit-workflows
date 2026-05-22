import type { Locale } from "@/types/workflow";

export const LOCALES = ["vi", "en"] as const satisfies readonly Locale[];
export const DEFAULT_LOCALE: Locale = "vi";

/**
 * Returns the destination pathname when an incoming request should be
 * redirected; returns null when no redirect is needed.
 *
 * Rules (in order):
 *   1. `/` → `/${DEFAULT_LOCALE}` (then rule 3 kicks in on next request)
 *   2. `/xxx` (non-locale prefix) → `/${DEFAULT_LOCALE}/xxx`
 *   3. `/${locale}` (bare locale, no sub-path) → `/${locale}/workflows`
 *   4. `/${locale}/...` (locale + sub-path) → null (handled by app router)
 *
 * Pure function — testable trong Vitest without Next.js runtime.
 */
export function getRedirectTarget(pathname: string): string | null {
  // Defensive guards (matcher also excludes these but keep logic resilient)
  if (pathname.startsWith("/_next")) return null;
  if (pathname.startsWith("/api")) return null;
  if (pathname.includes(".")) return null; // any path with extension (static assets)

  if (pathname === "/") return `/${DEFAULT_LOCALE}`;

  const segments = pathname.split("/").filter(Boolean);
  const seg1 = segments[0];

  if (LOCALES.includes(seg1 as Locale)) {
    // Bare locale → workflows landing
    if (segments.length === 1) return `/${seg1}/workflows`;
    return null;
  }

  // Non-locale prefix → prepend default locale
  return `/${DEFAULT_LOCALE}${pathname}`;
}

/**
 * Swap the locale prefix of a pathname. Returns the input unchanged when no
 * locale prefix is present.
 */
export function swapLocaleInPath(pathname: string, target: Locale): string {
  return pathname.replace(/^\/(vi|en)/, `/${target}`);
}

/**
 * Extract current locale from pathname, fallback to default.
 */
export function getLocaleFromPath(pathname: string): Locale {
  const seg1 = pathname.split("/")[1];
  return LOCALES.includes(seg1 as Locale) ? (seg1 as Locale) : DEFAULT_LOCALE;
}
