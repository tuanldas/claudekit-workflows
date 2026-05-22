"use client";

import { useMemo, useState, useDeferredValue } from "react";
import type { Skill } from "@/types/skill";
import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";
import { pluginGroupKey } from "@/lib/skill-plugin";
import { PageShell } from "@/components/shell/page-shell";
import { PageHeader } from "@/components/shell/page-header";
import { SkillCard } from "./skill-card";

interface Props {
  skills: Skill[];
  locale: Locale;
}

const GROUP_ALL = "__all__";

export function SkillsCatalogContent({ skills, locale }: Props) {
  const [group, setGroup] = useState<string>(GROUP_ALL);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const groupOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of skills) {
      const key = pluginGroupKey(s);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  }, [skills]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return skills.filter((s) => {
      if (group !== GROUP_ALL && pluginGroupKey(s) !== group) return false;
      if (!q) return true;
      const haystack =
        `${s.name} ${s.description} ${s.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [skills, group, deferredQuery]);

  const catalogDescription =
    locale === "vi"
      ? `${skills.length} skills sẵn sàng để khám phá.`
      : `${skills.length} skills ready to explore.`;

  if (skills.length === 0) {
    return (
      <PageShell>
        <PageHeader
          title={uiStrings.skills.title[locale]}
          description={uiStrings.skills.emptyCi[locale]}
        />
        <EmptyState message={uiStrings.skills.emptyCi[locale]} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title={uiStrings.skills.title[locale]}
        description={catalogDescription}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={uiStrings.skills.searchPlaceholder[locale]}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none sm:max-w-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        />
        <select
          aria-label={uiStrings.skills.groupFilter[locale]}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        >
          <option value={GROUP_ALL}>
            {uiStrings.skills.groupAll[locale]} ({skills.length})
          </option>
          {groupOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.value} ({opt.count})
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={uiStrings.skills.empty[locale]} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((skill) => (
            <SkillCard key={skill.id} skill={skill} locale={locale} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
      {message}
    </div>
  );
}
