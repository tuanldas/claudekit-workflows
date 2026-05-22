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
import { Input } from "@/components/ui";
import { cn } from "@/lib/cn";

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
        className="h-full overflow-y-auto px-4 text-sm text-foreground-muted"
        aria-label="Skills nav empty"
      >
        {uiStrings.skills.emptyCi[locale]}
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto px-2">
      <div className="mb-3 px-1">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={uiStrings.nav.skillsFilter[locale]}
        />
      </div>
      <ul className="space-y-4 text-sm">
        {grouped.map(({ group, items }) => (
          <li key={group}>
            <h3 className="mb-1 px-3 text-[11px] font-semibold tracking-wider text-foreground-subtle uppercase">
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
                      className={cn(
                        "block truncate rounded-[var(--radius-sm)] px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)]",
                        isActive
                          ? "bg-accent-subtle font-medium text-accent"
                          : "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
                      )}
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
