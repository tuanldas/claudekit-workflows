"use client";

import type { Locale } from "@/types/workflow";
import { Breadcrumb } from "./breadcrumb";
import { CommandPaletteTrigger } from "./command-palette-trigger";
import { HamburgerButton } from "./hamburger-button";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

interface Props {
  locale: Locale;
  onMenuClick?: () => void;
  menuLabel?: string;
}

export function Topbar({ locale, onMenuClick, menuLabel }: Props) {
  return (
    <header
      role="banner"
      className="flex h-13 shrink-0 items-center gap-2 border-b border-border bg-background px-2 sm:gap-4 sm:px-6"
    >
      {onMenuClick && (
        <HamburgerButton
          onClick={onMenuClick}
          label={menuLabel ?? (locale === "vi" ? "Mở điều hướng" : "Open navigation")}
        />
      )}
      <Breadcrumb locale={locale} />
      <div className="flex items-center gap-2">
        <CommandPaletteTrigger locale={locale} />
        <LocaleSwitcher />
        <ThemeToggle locale={locale} />
      </div>
    </header>
  );
}
