"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Skill } from "@/types/skill";
import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";
import { pluginGroupKey } from "@/lib/skill-plugin";
import { useSidebarScroll } from "@/lib/use-sidebar-scroll";
import { SECTION_KEYS } from "@/lib/sidebar-scroll-storage";

interface ClientProps {
  skills: Skill[];
  locale: Locale;
}

export function SidebarSkillsNavClient({ skills, locale }: ClientProps) {
  const pathname = usePathname() ?? "";
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const scrollRef = useSidebarScroll<HTMLDivElement>(SECTION_KEYS.SKILLS);

  const grouped = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    const map = new Map<string, Skill[]>();
    for (const s of skills) {
      if (q) {
        const haystack = `${s.name} ${s.description}`.toLowerCase();
        if (!haystack.includes(q)) continue;
      }
      const key = pluginGroupKey(s);
      const bucket = map.get(key);
      if (bucket) bucket.push(s);
      else map.set(key, [s]);
    }
    return Array.from(map.entries())
      .map(([group, items]) => ({
        group,
        items: items.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort(
        (a, b) =>
          b.items.length - a.items.length ||
          a.group.localeCompare(b.group),
      );
  }, [skills, deferred]);

  if (skills.length === 0) {
    return (
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto px-4 text-sm text-gray-500"
        aria-label="Skills nav empty"
      >
        {uiStrings.skills.emptyCi[locale]}
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto px-2">
      <div className="mb-3 px-1">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={uiStrings.nav.skillsFilter[locale]}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>
      <ul className="space-y-4 text-sm">
        {grouped.map(({ group, items }) => (
          <li key={group}>
            <h3 className="mb-1 px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              {group}
              <span className="ml-1 font-normal lowercase">
                ({items.length})
              </span>
            </h3>
            <ul className="space-y-0.5">
              {items.map((skill) => {
                const href = `/${locale}/skills/${skill.id}`;
                const isActive = pathname === href;
                return (
                  <li key={skill.id}>
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={`block truncate rounded-md px-3 py-1 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none ${
                        isActive
                          ? "bg-orange-50 font-medium text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                      }`}
                    >
                      {skill.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ServerProps {
  locale: Locale;
  skills?: Skill[] | null;
}

export function SidebarSkillsNav({ locale, skills }: ServerProps) {
  return <SidebarSkillsNavClient skills={skills ?? []} locale={locale} />;
}
