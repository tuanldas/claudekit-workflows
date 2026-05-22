"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";

export function SidebarWorkflowsNav({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "";
  const href = `/${locale}/workflows`;
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <ul className="space-y-0.5 px-2">
      <li>
        <Link
          href={href}
          aria-current={isActive ? "page" : undefined}
          className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none ${
            isActive
              ? "bg-orange-50 text-orange-700"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          {uiStrings.nav.workflows[locale]}
        </Link>
      </li>
    </ul>
  );
}
