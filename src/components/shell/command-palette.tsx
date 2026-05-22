"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useLocale } from "@/i18n/language-context";
import { uiStrings } from "@/i18n/translations";
import {
  loadSearchIndex,
  type GroupedSearchResults,
  type SearchClient,
  type SearchResult,
} from "@/lib/search-client";
import {
  RECENT_SEARCHES_KEY,
  clearRecentSearches,
  getRecentSearches,
  saveRecentSearch,
} from "@/lib/recent-searches";
import { useCommandPalette } from "./command-palette-context";

const EMPTY_GROUPED: GroupedSearchResults = {
  workflows: [],
  docs: [],
  skills: [],
};

export function CommandPalette() {
  const { open, query, setQuery, closePalette } = useCommandPalette();
  const { locale } = useLocale();
  const router = useRouter();

  const [client, setClient] = useState<SearchClient | null>(null);
  const recent = useSyncExternalStore(
    subscribeRecent,
    getRecentSnapshot,
    getRecentServerSnapshot,
  );
  const deferredQuery = useDeferredValue(query);

  // Lazy-load search index on first open.
  useEffect(() => {
    if (!open || client) return;
    let cancelled = false;
    loadSearchIndex(locale).then((c) => {
      if (!cancelled) setClient(c);
    });
    return () => {
      cancelled = true;
    };
  }, [open, client, locale]);

  const grouped = useMemo<GroupedSearchResults>(() => {
    if (!client || !deferredQuery.trim()) return EMPTY_GROUPED;
    return client.searchGrouped(deferredQuery);
  }, [client, deferredQuery]);

  const hasResults =
    grouped.workflows.length + grouped.docs.length + grouped.skills.length > 0;

  if (!open) return null;

  const buildHref = (r: SearchResult): string => {
    switch (r.kind) {
      case "workflow":
        return `/${locale}/workflows?selected=${slugTail(r.slug)}`;
      case "skill":
        return `/${locale}/skills/${slugTail(r.slug)}`;
      case "doc":
      default:
        return `/${locale}/docs/${stripLocalePrefix(r.slug, locale)}`;
    }
  };

  function selectResult(r: SearchResult) {
    if (deferredQuery.trim()) {
      saveRecentSearch(deferredQuery.trim());
      notifyRecentChanged();
    }
    closePalette();
    router.push(buildHref(r));
  }

  function selectRecent(q: string) {
    setQuery(q);
  }

  function handleClearRecent() {
    clearRecentSearches();
    notifyRecentChanged();
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) closePalette();
      }}
      label={uiStrings.palette.label[locale]}
      shouldFilter={false}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 backdrop-blur-[2px] sm:pt-[12vh]"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface-elevated shadow-2xl">
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder={uiStrings.palette.placeholder[locale]}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          className="w-full border-b border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none"
        />
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          {!query.trim() && recent.length === 0 && client?.isEmpty && (
            <div className="rounded-[var(--radius-sm)] bg-warning-subtle p-3 text-sm text-warning">
              {uiStrings.palette.emptyIndex[locale]}
            </div>
          )}

          {!query.trim() && recent.length > 0 && (
            <Command.Group
              heading={
                <span className="flex items-center justify-between px-3 py-1 text-[11px] font-semibold tracking-wider text-foreground-subtle uppercase">
                  <span>{uiStrings.palette.recent[locale]}</span>
                  <button
                    type="button"
                    onClick={handleClearRecent}
                    className="text-[11px] normal-case font-normal tracking-normal text-foreground-subtle transition-colors hover:text-foreground"
                  >
                    {uiStrings.palette.clearRecent[locale]}
                  </button>
                </span>
              }
            >
              {recent.map((q) => (
                <Command.Item
                  key={q}
                  value={`recent-${q}`}
                  onSelect={() => selectRecent(q)}
                  className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-foreground aria-selected:bg-surface-hover"
                >
                  <span className="text-foreground-subtle">
                    <ClockIcon />
                  </span>
                  <span>{q}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {query.trim() && !hasResults && client && !client.isEmpty && (
            <Command.Empty className="p-3 text-sm text-foreground-muted">
              {uiStrings.palette.empty[locale]}
            </Command.Empty>
          )}

          {query.trim() && grouped.workflows.length > 0 && (
            <ResultGroup
              heading={uiStrings.palette.workflowsGroup[locale]}
              results={grouped.workflows}
              icon={<WorkflowIcon />}
              onSelect={selectResult}
            />
          )}

          {query.trim() && grouped.docs.length > 0 && (
            <ResultGroup
              heading={uiStrings.palette.docsGroup[locale]}
              results={grouped.docs}
              icon={<DocIcon />}
              onSelect={selectResult}
            />
          )}

          {query.trim() && grouped.skills.length > 0 && (
            <ResultGroup
              heading={uiStrings.palette.skillsGroup[locale]}
              results={grouped.skills}
              icon={<SkillIcon />}
              onSelect={selectResult}
            />
          )}
        </Command.List>

        <div className="flex items-center justify-end gap-3 border-t border-border bg-surface px-3 py-2 text-[11px] text-foreground-subtle">
          <span>{uiStrings.palette.footerNav[locale]}</span>
          <span>{uiStrings.palette.footerSelect[locale]}</span>
          <span>{uiStrings.palette.footerClose[locale]}</span>
        </div>
      </div>
    </Command.Dialog>
  );
}

function ResultGroup({
  heading,
  results,
  icon,
  onSelect,
}: {
  heading: string;
  results: SearchResult[];
  icon: ReactNode;
  onSelect: (r: SearchResult) => void;
}) {
  return (
    <Command.Group
      heading={
        <span className="block px-3 py-1 text-[11px] font-semibold tracking-wider text-foreground-subtle uppercase">
          {heading}
        </span>
      }
    >
      {results.map((r) => (
        <Command.Item
          key={`${r.kind}:${r.slug}`}
          value={`${r.kind}:${r.slug}`}
          onSelect={() => onSelect(r)}
          className="flex cursor-pointer items-start gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-foreground aria-selected:bg-surface-hover"
        >
          <span className="mt-0.5 text-foreground-subtle">{icon}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{r.title}</span>
            {r.subtitle && (
              <span className="block truncate text-xs text-foreground-muted">
                {r.subtitle}
              </span>
            )}
          </span>
        </Command.Item>
      ))}
    </Command.Group>
  );
}

const RECENT_CHANGE_EVENT = "claudekit:recent-searches-changed";

function subscribeRecent(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const storageHandler = (e: StorageEvent) => {
    if (e.key === RECENT_SEARCHES_KEY) onChange();
  };
  window.addEventListener(RECENT_CHANGE_EVENT, onChange);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(RECENT_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", storageHandler);
  };
}

let recentSnapshot: string[] = [];
let lastSerialized = "";

function getRecentSnapshot(): string[] {
  const current = getRecentSearches();
  const serialized = JSON.stringify(current);
  if (serialized !== lastSerialized) {
    recentSnapshot = current;
    lastSerialized = serialized;
  }
  return recentSnapshot;
}

const EMPTY_RECENT: string[] = [];

function getRecentServerSnapshot(): string[] {
  return EMPTY_RECENT;
}

function notifyRecentChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(RECENT_CHANGE_EVENT));
}

function slugTail(slug: string): string {
  const qmark = slug.indexOf("=");
  if (qmark >= 0) return slug.slice(qmark + 1);
  const slash = slug.lastIndexOf("/");
  if (slash >= 0) return slug.slice(slash + 1);
  return slug;
}

function stripLocalePrefix(slug: string, locale: string): string {
  const prefix = `${locale}/`;
  return slug.startsWith(prefix) ? slug.slice(prefix.length) : slug;
}

function WorkflowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function SkillIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}
