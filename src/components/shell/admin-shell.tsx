"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/i18n/language-context";
import type { DocsTree } from "@/types/docs";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface Props {
  children: ReactNode;
  /** Pre-fetched docs tree at server level — passed to sidebar so docs nav
   *  doesn't re-fetch on every client navigation. Null on non-docs routes. */
  docsTree?: DocsTree | null;
}

export function AdminShell({ children, docsTree = null }: Props) {
  const { locale } = useLocale();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} docsTree={docsTree} />
      <div className="flex flex-1 flex-col">
        <Topbar locale={locale} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
