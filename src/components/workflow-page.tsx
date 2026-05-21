"use client";

import { useState, useMemo } from "react";
import type { WorkflowCategory } from "@/types/workflow";
import { workflows } from "@/data/workflows";
import { uiStrings } from "@/i18n/translations";
import { useLocale } from "@/i18n/language-context";
import { CategoryTabs } from "./category-tabs";
import { SearchBar } from "./search-bar";
import { WorkflowCard } from "./workflow-card";
import { WorkflowDetail } from "./workflow-detail";
import { LanguageSwitcher } from "./language-switcher";

export function WorkflowPage() {
  const { locale } = useLocale();
  const [activeCategory, setActiveCategory] = useState<WorkflowCategory>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white">
                  CK
                </div>
                <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                  {uiStrings.appBadge[locale]}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {uiStrings.appTitle[locale]}
              </h1>
              <p className="mt-1 text-gray-500">
                {uiStrings.appSubtitle[locale]}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <LanguageSwitcher />
              <div className="w-64">
                <SearchBar value={search} onChange={setSearch} />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <CategoryTabs
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {selectedWorkflow && (
          <div className="mb-6">
            <WorkflowDetail
              workflow={selectedWorkflow}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}

        <div className="mb-4 text-sm text-gray-400">
          {uiStrings.workflowsCount[locale](filtered.length)}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              isSelected={selectedId === workflow.id}
              onClick={() =>
                setSelectedId(
                  selectedId === workflow.id ? null : workflow.id
                )
              }
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400">
            {uiStrings.noResults[locale]}
          </div>
        )}
      </main>
    </div>
  );
}
