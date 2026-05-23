"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Skill } from "@/types/skill";
import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";
import { pluginGroupKey } from "@/lib/skill-plugin";
import { CatalogTemplate } from "@/components/shell/catalog-template";
import { FilterSelect, Input, type FilterSelectOption } from "@/components/ui";
import { SkillCard } from "./skill-card";

interface Props {
  skills: Skill[];
  locale: Locale;
}

const GROUP_ALL = "";
const SEARCH_DEBOUNCE_MS = 150;

export function SkillsCatalogContent({ skills, locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const group = searchParams?.get("group") ?? GROUP_ALL;
  const urlQuery = searchParams?.get("q") ?? "";
  // Seed local state from URL on first render; subsequent URL changes from
  // user typing flow through `handleSearchChange` so we don't fight them.
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const basePath = pathname ?? `/${locale}/skills`;

  const buildQuery = useCallback(
    (next: { group?: string; q?: string }) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (next.group !== undefined) {
        if (!next.group) params.delete("group");
        else params.set("group", next.group);
      }
      if (next.q !== undefined) {
        if (!next.q) params.delete("q");
        else params.set("q", next.q);
      }
      const qs = params.toString();
      return qs ? `?${qs}` : "";
    },
    [searchParams],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        router.replace(`${basePath}${buildQuery({ q: value })}`, {
          scroll: false,
        });
      }, SEARCH_DEBOUNCE_MS);
    },
    [router, buildQuery, basePath],
  );

  const handleGroupChange = useCallback(
    (value: string) => {
      router.replace(`${basePath}${buildQuery({ group: value })}`, {
        scroll: false,
      });
    },
    [router, buildQuery, basePath],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const groupOptions = useMemo<FilterSelectOption[]>(() => {
    const counts = new Map<string, number>();
    for (const s of skills) {
      const key = pluginGroupKey(s);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const entries = Array.from(counts.entries())
      .map(([value, count]) => ({ value, label: value, count }))
      .sort(
        (a, b) => b.count - a.count || a.value.localeCompare(b.value),
      );
    return [
      {
        value: GROUP_ALL,
        label: uiStrings.skills.groupAll[locale],
        count: skills.length,
      },
      ...entries,
    ];
  }, [skills, locale]);

  const filtered = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    return skills.filter((s) => {
      if (group && pluginGroupKey(s) !== group) return false;
      if (!q) return true;
      const haystack =
        `${s.name} ${s.description} ${s.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [skills, group, localQuery]);

  const catalogDescription =
    locale === "vi"
      ? `${skills.length} skills sẵn sàng để khám phá.`
      : `${skills.length} skills ready to explore.`;

  if (skills.length === 0) {
    return (
      <CatalogTemplate
        title={uiStrings.skills.title[locale]}
        description={uiStrings.skills.emptyCi[locale]}
        isEmpty
        emptyMessage={uiStrings.skills.emptyCi[locale]}
      >
        {null}
      </CatalogTemplate>
    );
  }

  return (
    <CatalogTemplate
      title={uiStrings.skills.title[locale]}
      description={catalogDescription}
      search={
        <Input
          type="search"
          value={localQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={uiStrings.skills.searchPlaceholder[locale]}
          leadingIcon={
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="m17 17-3.5-3.5" />
            </svg>
          }
        />
      }
      filter={
        <FilterSelect
          aria-label={uiStrings.skills.groupFilter[locale]}
          options={groupOptions}
          value={group}
          onValueChange={handleGroupChange}
        />
      }
      isEmpty={filtered.length === 0}
      emptyMessage={uiStrings.skills.empty[locale]}
      gridDensity="tight"
    >
      {filtered.map((skill) => (
        <SkillCard key={skill.id} skill={skill} locale={locale} />
      ))}
    </CatalogTemplate>
  );
}
