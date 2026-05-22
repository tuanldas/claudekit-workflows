"use client";

import type { Locale } from "@/types/workflow";
import { Breadcrumb } from "./breadcrumb";
import { CommandPaletteTrigger } from "./command-palette-trigger";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

export function Topbar({ locale }: { locale: Locale }) {
  return (
    <header
      role="banner"
      className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6"
    >
      <Breadcrumb locale={locale} />
      <div className="flex items-center gap-2 sm:gap-3">
        <CommandPaletteTrigger locale={locale} />
        <LocaleSwitcher />
        <ThemeToggle locale={locale} />
      </div>
    </header>
  );
}
