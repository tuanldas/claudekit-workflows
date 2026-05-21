"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/types/workflow";

interface LanguageContextValue {
  locale: Locale;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Provides the active locale to descendants. Locale is derived from the URL
 * segment in `app/[locale]/layout.tsx` — không còn dùng localStorage.
 * Switching locale = client-side navigate to /{target}/... (xem LanguageSwitcher).
 */
export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LanguageContext.Provider value={{ locale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLocale must be used inside LanguageProvider");
  }
  return ctx;
}
