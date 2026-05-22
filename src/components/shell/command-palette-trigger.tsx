"use client";

import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";
import { Kbd } from "@/components/ui";
import { useCommandPalette } from "./command-palette-context";

export function CommandPaletteTrigger({ locale }: { locale: Locale }) {
  const { openPalette } = useCommandPalette();
  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label={uiStrings.palette.placeholder[locale]}
      className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-2.5 text-xs text-foreground-muted transition-colors hover:border-border-strong hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span className="hidden sm:inline">
        {uiStrings.topbar.searchPlaceholder[locale]}
      </span>
      <Kbd className="hidden sm:inline-flex">
        {uiStrings.topbar.searchHint[locale]}
      </Kbd>
    </button>
  );
}
