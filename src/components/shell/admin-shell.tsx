"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/i18n/language-context";
import { MobileDrawer } from "./mobile-drawer";
import {
  MobileDrawerProvider,
  useMobileDrawer,
} from "./mobile-drawer-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <MobileDrawerProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </MobileDrawerProvider>
  );
}

function AdminShellInner({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const { open, openDrawer, closeDrawer } = useMobileDrawer();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
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
        <Sidebar locale={locale} variant="drawer" />
      </MobileDrawer>
    </div>
  );
}
