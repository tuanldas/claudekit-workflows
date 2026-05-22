import Link from "next/link";
import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";

export function SidebarHeader({ locale }: { locale: Locale }) {
  return (
    <div className="flex h-14 items-center gap-2 border-b border-gray-200 px-4">
      <Link
        href={`/${locale}/workflows`}
        className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white"
          translate="no"
        >
          CK
        </span>
        <span className="text-sm font-semibold text-gray-900">
          {uiStrings.appTitle[locale]}
        </span>
      </Link>
    </div>
  );
}
