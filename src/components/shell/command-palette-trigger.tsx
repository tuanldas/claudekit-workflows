"use client";

import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";
import { useCommandPalette } from "./command-palette-context";

export function CommandPaletteTrigger({ locale }: { locale: Locale }) {
  const { openPalette } = useCommandPalette();
  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label={uiStrings.palette.placeholder[locale]}
      className="inline-flex h-8 items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-500 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
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
      <kbd
        className="hidden rounded border border-gray-200 bg-gray-50 px-1 font-mono text-[10px] text-gray-500 sm:inline dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        translate="no"
      >
        {uiStrings.topbar.searchHint[locale]}
      </kbd>
    </button>
  );
}
