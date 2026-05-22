import Link from "next/link";
import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";

export function SidebarHeader({ locale }: { locale: Locale }) {
  return (
    <div className="flex h-13 items-center gap-2 border-b border-border px-4">
      <Link
        href={`/${locale}/workflows`}
        className="flex items-center gap-2 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-accent text-[11px] font-bold tracking-tight text-accent-foreground"
          translate="no"
        >
          CK
        </span>
        <span className="text-sm font-semibold tracking-tight text-foreground">
          {uiStrings.appTitle[locale]}
        </span>
      </Link>
    </div>
  );
}
