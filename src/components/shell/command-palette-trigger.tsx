"use client";

import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";

export function CommandPaletteTrigger({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      disabled
      aria-label={uiStrings.topbar.searchPlaceholder[locale]}
      className="inline-flex h-8 cursor-not-allowed items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2.5 text-xs text-gray-400"
    >
      <span>{uiStrings.topbar.searchPlaceholder[locale]}</span>
      <kbd
        className="hidden rounded border border-gray-200 bg-white px-1 font-mono text-[10px] text-gray-400 sm:inline"
        translate="no"
      >
        {uiStrings.topbar.searchHint[locale]}
      </kbd>
    </button>
  );
}
