"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/i18n/language-context";
import type { DocsTree } from "@/types/docs";
import type { Skill } from "@/types/skill";
import { CommandPalette } from "./command-palette";
import { CommandPaletteProvider } from "./command-palette-context";
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
  /** Pre-fetched skills index at server level. Null on non-skills routes. */
  skills?: Skill[] | null;
}

export function AdminShell({
  children,
  docsTree = null,
  skills = null,
}: Props) {
  return (
    <CommandPaletteProvider>
      <MobileDrawerProvider>
        <AdminShellInner docsTree={docsTree} skills={skills}>
          {children}
        </AdminShellInner>
      </MobileDrawerProvider>
    </CommandPaletteProvider>
  );
}

function AdminShellInner({
  children,
  docsTree,
  skills,
}: {
  children: ReactNode;
  docsTree: DocsTree | null;
  skills: Skill[] | null;
}) {
  const { locale } = useLocale();
  const { open, openDrawer, closeDrawer } = useMobileDrawer();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} docsTree={docsTree} skills={skills} />
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
        <Sidebar
          locale={locale}
          docsTree={docsTree}
          skills={skills}
          variant="drawer"
        />
      </MobileDrawer>
      <CommandPalette />
    </div>
  );
}
