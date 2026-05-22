"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { WorkflowCategory } from "@/types/workflow";
import { workflows } from "@/data/workflows";
import { uiStrings } from "@/i18n/translations";
import { useLocale } from "@/i18n/language-context";
import { normalizeCategory, categoryLabel } from "@/lib/category-utils";
import { PageShell } from "@/components/shell/page-shell";
import { PageHeader } from "@/components/shell/page-header";
import { SearchBar } from "@/components/search-bar";
import { WorkflowCard } from "@/components/workflow-card";
import { WorkflowDetail } from "@/components/workflow-detail";

export function WorkflowsPageContent() {
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = normalizeCategory(searchParams?.get("category") ?? null);
  const search = searchParams?.get("q") ?? "";

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const buildQuery = useCallback(
    (next: { category?: WorkflowCategory; q?: string }) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (next.category !== undefined) {
        if (next.category === "all") params.delete("category");
        else params.set("category", next.category);
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

  const basePath = pathname ?? `/${locale}/workflows`;

  const handleSearchChange = useCallback(
    (value: string) => {
      router.replace(`${basePath}${buildQuery({ q: value })}`, {
        scroll: false,
      });
    },
    [router, buildQuery, basePath],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return workflows.filter((w) => {
      const matchesCategory =
        activeCategory === "all" || w.category === activeCategory;
      const matchesSearch =
        !q ||
        w.title[locale].toLowerCase().includes(q) ||
        w.description[locale].toLowerCase().includes(q) ||
        w.steps.some((s) => s.command.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, locale]);

  const selectedWorkflow = workflows.find((w) => w.id === selectedId);

  const activeLabel =
    activeCategory === "all"
      ? null
      : categoryLabel(activeCategory, locale);

  return (
    <PageShell>
      <PageHeader
        eyebrow={activeLabel ?? undefined}
        title={uiStrings.appTitle[locale]}
        description={uiStrings.appSubtitle[locale]}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <SearchBar value={search} onChange={handleSearchChange} />
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {uiStrings.workflowsCount[locale](filtered.length)}
        </span>
      </div>

      {selectedWorkflow && (
        <div className="mb-6">
          <WorkflowDetail
            workflow={selectedWorkflow}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            isSelected={selectedId === workflow.id}
            onClick={() =>
              setSelectedId(selectedId === workflow.id ? null : workflow.id)
            }
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          {uiStrings.noResults[locale]}
        </div>
      )}
    </PageShell>
  );
}
