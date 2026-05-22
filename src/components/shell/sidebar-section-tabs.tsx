"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";

interface Section {
  key: "workflows" | "docs" | "skills";
  href: (locale: Locale) => string;
  prefix: (locale: Locale) => string;
}

const SECTIONS: Section[] = [
  {
    key: "workflows",
    href: (l) => `/${l}/workflows`,
    prefix: (l) => `/${l}/workflows`,
  },
  {
    key: "docs",
    href: (l) => `/${l}/docs`,
    prefix: (l) => `/${l}/docs`,
  },
  {
    key: "skills",
    href: (l) => `/${l}/skills`,
    prefix: (l) => `/${l}/skills`,
  },
];

export function SidebarSectionTabs({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label={uiStrings.sections.label[locale]}
      className="border-b border-gray-200 px-2 py-2"
    >
      <ul className="flex flex-col gap-0.5">
        {SECTIONS.map((section) => {
          const active = pathname.startsWith(section.prefix(locale));
          return (
            <li key={section.key}>
              <Link
                href={section.href(locale)}
                aria-current={active ? "page" : undefined}
                className={`block rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none ${
                  active
                    ? "bg-orange-50 font-medium text-orange-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {uiStrings.sections[section.key][locale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
