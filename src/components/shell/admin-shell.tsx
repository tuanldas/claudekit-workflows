"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/i18n/language-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
      <div className="flex flex-1 flex-col">
        <Topbar locale={locale} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
