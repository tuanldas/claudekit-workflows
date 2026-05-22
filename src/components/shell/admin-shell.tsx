"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/i18n/language-context";
import type { DocsTree } from "@/types/docs";
import { MobileDrawer } from "./mobile-drawer";
import {
  MobileDrawerProvider,
  useMobileDrawer,
} from "./mobile-drawer-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface Props {
  children: ReactNode;
  /** Pre-fetched docs tree at server level — passed to sidebar so docs nav
   *  doesn't re-fetch on every client navigation. Null on non-docs routes. */
  docsTree?: DocsTree | null;
}

export function AdminShell({ children, docsTree = null }: Props) {
  return (
    <MobileDrawerProvider>
      <AdminShellInner docsTree={docsTree}>{children}</AdminShellInner>
    </MobileDrawerProvider>
  );
}

function AdminShellInner({
  children,
  docsTree,
}: {
  children: ReactNode;
  docsTree: DocsTree | null;
}) {
  const { locale } = useLocale();
  const { open, openDrawer, closeDrawer } = useMobileDrawer();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} docsTree={docsTree} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          locale={locale}
          onMenuClick={openDrawer}
          menuLabel={locale === "vi" ? "Mở điều hướng" : "Open navigation"}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <MobileDrawer
        open={open}
        onClose={closeDrawer}
        label={locale === "vi" ? "Điều hướng" : "Navigation"}
      >
        <Sidebar locale={locale} docsTree={docsTree} variant="drawer" />
      </MobileDrawer>
    </div>
  );
}
