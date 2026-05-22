"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/types/workflow";
import {
  LOCALES,
  getLocaleFromPath,
  swapLocaleInPath,
} from "@/lib/locale-routing";
import { cn } from "@/lib/cn";

const labels: Record<Locale, string> = {
  vi: "VI",
  en: "EN",
};

export function LocaleSwitcher() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const current = getLocaleFromPath(pathname);

  function switchTo(target: Locale) {
    if (target === current) return;
    router.push(swapLocaleInPath(pathname, target));
  }

  return (
    <div className="inline-flex h-8 items-center rounded-[var(--radius-md)] border border-border bg-surface p-0.5 text-xs font-semibold">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          aria-pressed={current === loc}
          className={cn(
            "h-7 cursor-pointer touch-manipulation rounded-[var(--radius-sm)] px-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)]",
            current === loc
              ? "bg-accent text-accent-foreground"
              : "text-foreground-muted hover:text-foreground",
          )}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
