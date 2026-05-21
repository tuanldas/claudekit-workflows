"use client";

import { useEffect, useRef, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  loadSearchIndex,
  type SearchClient,
  type SearchResult,
} from "@/lib/search-client";
import type { Locale } from "@/types/workflow";

const DEBOUNCE_MS = 150;

export function DocsSearch({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [client, setClient] = useState<SearchClient | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cmd+K (Mac) / Ctrl+K toggle
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lazy load index on first open
  useEffect(() => {
    if (open && !client) {
      loadSearchIndex(locale).then(setClient);
    }
  }, [open, client, locale]);

  // Real setTimeout debounce
  useEffect(() => {
    if (!client) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResults(client.search(query));
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [client, query]);

  function select(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/${locale}/docs/${slug}`);
  }

  const placeholder =
    locale === "vi" ? "Tìm trong docs… (Cmd+K)" : "Search docs… (Cmd+K)";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={placeholder}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="hidden sm:inline">{placeholder}</span>
      </button>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search docs"
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 sm:pt-[10vh]"
      >
        <div className="w-full max-w-xl rounded-lg bg-white shadow-2xl">
          <Command.Input
            placeholder={placeholder}
            value={query}
            onValueChange={setQuery}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            className="w-full border-b border-gray-200 px-4 py-3 text-sm focus:outline-none"
          />
          <Command.List className="max-h-80 overflow-y-auto p-2">
            {client?.isEmpty && (
              <div className="p-3 text-sm text-amber-700">
                {locale === "vi" ? (
                  <>
                    Search chưa sẵn sàng trong dev. Chạy{" "}
                    <code translate="no">npm run build:search</code> một lần.
                  </>
                ) : (
                  <>
                    Search unavailable in dev. Run{" "}
                    <code translate="no">npm run build:search</code> once.
                  </>
                )}
              </div>
            )}
            {!client?.isEmpty && results.length === 0 && query && (
              <Command.Empty className="p-3 text-sm text-gray-500">
                {locale === "vi" ? "Không có kết quả" : "No results"}
              </Command.Empty>
            )}
            {results.map((r) => (
              <Command.Item
                key={r.slug}
                value={r.slug}
                onSelect={() => select(r.slug)}
                className="flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm aria-selected:bg-orange-50 aria-selected:text-orange-700"
              >
                <span className="font-medium">{r.title}</span>
                <span
                  className="ml-2 text-xs text-gray-400"
                  translate="no"
                >
                  {r.slug}
                </span>
              </Command.Item>
            ))}
          </Command.List>
        </div>
      </Command.Dialog>
    </>
  );
}
