"use client";

import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";

export function ThemeToggle({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      disabled
      aria-label={uiStrings.topbar.themeToggle[locale]}
      title={uiStrings.topbar.themeToggle[locale]}
      className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-400"
    >
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path d="M10 2a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 2Zm5.657 2.343a.75.75 0 0 1 0 1.06l-.707.708a.75.75 0 1 1-1.06-1.061l.707-.707a.75.75 0 0 1 1.06 0ZM18 10a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1A.75.75 0 0 1 18 10Zm-2.343 5.657a.75.75 0 0 1-1.06 0l-.708-.707a.75.75 0 1 1 1.061-1.06l.707.707a.75.75 0 0 1 0 1.06ZM10 16.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1A.75.75 0 0 1 10 16.25Zm-5.657-2.343a.75.75 0 0 1 1.06 0l.708.707a.75.75 0 1 1-1.06 1.06l-.708-.707a.75.75 0 0 1 0-1.06ZM2 10a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1A.75.75 0 0 1 2 10Zm2.343-5.657a.75.75 0 0 1 1.06 0l.708.707A.75.75 0 1 1 5.05 6.111l-.707-.708a.75.75 0 0 1 0-1.06ZM10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
      </svg>
    </button>
  );
}
