"use client";

import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";
import { useTheme, type Theme } from "@/lib/theme-context";

const NEXT: Record<Theme, Theme> = {
  light: "dark",
  dark: "system",
  system: "light",
};

export function ThemeToggle({ locale }: { locale: Locale }) {
  const { theme, setTheme } = useTheme();
  const baseLabel = uiStrings.topbar.themeToggle[locale];
  const modeLabel = uiStrings.theme[theme][locale];
  const ariaLabel = `${baseLabel} (${modeLabel})`;

  return (
    <button
      type="button"
      onClick={() => setTheme(NEXT[theme])}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface text-foreground-muted transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {theme === "light" && <SunIcon />}
      {theme === "dark" && <MoonIcon />}
      {theme === "system" && <MonitorIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      data-testid="theme-icon-light"
      aria-hidden
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M10 2a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 2Zm5.657 2.343a.75.75 0 0 1 0 1.06l-.707.708a.75.75 0 1 1-1.06-1.061l.707-.707a.75.75 0 0 1 1.06 0ZM18 10a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 18 10Zm-2.343 5.657a.75.75 0 0 1-1.06 0l-.708-.707a.75.75 0 1 1 1.061-1.06l.707.707a.75.75 0 0 1 0 1.06ZM10 16.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 16.25Zm-5.657-2.343a.75.75 0 0 1 1.06 0l.708.707a.75.75 0 1 1-1.06 1.06l-.708-.707a.75.75 0 0 1 0-1.06ZM2 10a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1A.75.75 0 0 1 2 10Zm2.343-5.657a.75.75 0 0 1 1.06 0l.708.707A.75.75 0 1 1 5.05 6.111l-.707-.708a.75.75 0 0 1 0-1.06ZM10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      data-testid="theme-icon-dark"
      aria-hidden
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.512 8.243.75.75 0 0 1 1.05.85 8.5 8.5 0 1 1-11.434-9.86.75.75 0 0 1 .612-.003Z"
      />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      data-testid="theme-icon-system"
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="2.5" y="3.5" width="15" height="10" rx="1.5" />
      <path d="M7 17h6M10 13.5V17" />
    </svg>
  );
}
