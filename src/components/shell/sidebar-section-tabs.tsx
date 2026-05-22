"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";
import { cn } from "@/lib/cn";

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
      className="border-b border-border px-2 py-2"
    >
      <ul className="flex flex-col gap-0.5">
        {SECTIONS.map((section) => {
          const active = pathname.startsWith(section.prefix(locale));
          return (
            <li key={section.key}>
              <Link
                href={section.href(locale)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-[var(--radius-sm)] px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)]",
                  active
                    ? "bg-accent-subtle font-medium text-accent"
                    : "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
                )}
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
