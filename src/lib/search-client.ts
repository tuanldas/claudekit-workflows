import FlexSearch from "flexsearch";
import type { Locale } from "@/types/workflow";

export type SearchKind = "doc" | "skill" | "workflow";

export interface SearchResult {
  slug: string;
  title: string;
  kind?: SearchKind;
  subtitle?: string;
  group?: string;
}

export interface GroupedSearchResults {
  workflows: SearchResult[];
  docs: SearchResult[];
  skills: SearchResult[];
}

export interface SearchClient {
  search: (query: string) => SearchResult[];
  searchGrouped: (query: string) => GroupedSearchResults;
  isEmpty: boolean;
}

interface IndexableDoc {
  id: number;
  slug: string;
  title: string;
  searchable: string;
  kind?: SearchKind;
  subtitle?: string;
  group?: string;
}

interface IndexPayload {
  docs: IndexableDoc[];
}

const cache = new Map<Locale, SearchClient>();

/** Custom encoder: lowercase + strip Vietnamese diacritics. */
function viEncode(str: string): string[] {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .split(/\W+/)
    .filter(Boolean);
}

const PER_KIND_LIMIT = 8;
const FLAT_LIMIT = 12;

function emptyGrouped(): GroupedSearchResults {
  return { workflows: [], docs: [], skills: [] };
}

export async function loadSearchIndex(locale: Locale): Promise<SearchClient> {
  const cached = cache.get(locale);
  if (cached) return cached;

  let client: SearchClient;
  try {
    const res = await fetch(`/search-index-${locale}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = (await res.json()) as IndexPayload;

    if (payload.docs.length === 0) {
      client = {
        search: () => [],
        searchGrouped: () => emptyGrouped(),
        isEmpty: true,
      };
    } else {
      const index = new FlexSearch.Index({
        tokenize: "forward",
        encode: viEncode,
      });
      for (const doc of payload.docs) {
        index.add(doc.id, doc.searchable);
      }
      const metaById = new Map(
        payload.docs.map((d) => [
          d.id,
          {
            slug: d.slug,
            title: d.title,
            kind: (d.kind ?? "doc") as SearchKind,
            subtitle: d.subtitle,
            group: d.group,
          },
        ]),
      );

      const flat = (query: string): SearchResult[] => {
        if (!query.trim()) return [];
        const hits = index.search(query, FLAT_LIMIT) as number[];
        return hits
          .map((id) => metaById.get(id))
          .filter(
            (m): m is NonNullable<ReturnType<typeof metaById.get>> => Boolean(m),
          )
          .map((m) => ({
            slug: m.slug,
            title: m.title,
            kind: m.kind,
            subtitle: m.subtitle,
            group: m.group,
          }));
      };

      const grouped = (query: string): GroupedSearchResults => {
        if (!query.trim()) return emptyGrouped();
        // Larger pool than flat so we can fill per-kind buckets evenly.
        const hits = index.search(query, FLAT_LIMIT * 3) as number[];
        const result = emptyGrouped();
        for (const id of hits) {
          const meta = metaById.get(id);
          if (!meta) continue;
          const item: SearchResult = {
            slug: meta.slug,
            title: meta.title,
            kind: meta.kind,
            subtitle: meta.subtitle,
            group: meta.group,
          };
          if (meta.kind === "workflow" && result.workflows.length < PER_KIND_LIMIT) {
            result.workflows.push(item);
          } else if (meta.kind === "skill" && result.skills.length < PER_KIND_LIMIT) {
            result.skills.push(item);
          } else if (meta.kind === "doc" && result.docs.length < PER_KIND_LIMIT) {
            result.docs.push(item);
          }
        }
        return result;
      };

      client = {
        isEmpty: false,
        search: flat,
        searchGrouped: grouped,
      };
    }
  } catch (err) {
    console.warn("[search] index load failed:", err);
    client = {
      search: () => [],
      searchGrouped: () => emptyGrouped(),
      isEmpty: true,
    };
  }

  cache.set(locale, client);
  return client;
}
