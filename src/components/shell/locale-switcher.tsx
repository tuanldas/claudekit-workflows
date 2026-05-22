"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/types/workflow";
import {
  LOCALES,
  getLocaleFromPath,
  swapLocaleInPath,
} from "@/lib/locale-routing";

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
    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-0.5 text-xs font-semibold">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          aria-pressed={current === loc}
          className={`touch-manipulation rounded-md px-2.5 py-1 transition-colors focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-1 focus-visible:outline-none ${
            current === loc
              ? "bg-orange-500 text-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
