"use client";

import { useLocale } from "@/i18n/language-context";
import type { Locale } from "@/types/workflow";

const labels: Record<Locale, string> = {
  vi: "VI",
  en: "EN",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white p-0.5 text-xs font-semibold">
      {(["vi", "en"] as Locale[]).map((loc) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`rounded-md px-2.5 py-1 transition-colors ${
            locale === loc
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
