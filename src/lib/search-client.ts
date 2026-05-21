import FlexSearch from "flexsearch";
import type { Locale } from "@/types/workflow";

export interface SearchResult {
  slug: string;
  title: string;
}

export interface SearchClient {
  search: (query: string) => SearchResult[];
  isEmpty: boolean;
}

interface IndexableDoc {
  id: number;
  slug: string;
  title: string;
  searchable: string;
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

export async function loadSearchIndex(locale: Locale): Promise<SearchClient> {
  const cached = cache.get(locale);
  if (cached) return cached;

  let client: SearchClient;
  try {
    const res = await fetch(`/search-index-${locale}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = (await res.json()) as IndexPayload;

    if (payload.docs.length === 0) {
      client = { search: () => [], isEmpty: true };
    } else {
      const index = new FlexSearch.Index({
        tokenize: "forward",
        encode: viEncode,
      });
      for (const doc of payload.docs) {
        index.add(doc.id, doc.searchable);
      }
      const metaById = new Map(
        payload.docs.map((d) => [d.id, { slug: d.slug, title: d.title }]),
      );
      client = {
        isEmpty: false,
        search: (query) => {
          if (!query.trim()) return [];
          const hits = index.search(query, 10) as number[];
          return hits
            .map((id) => metaById.get(id))
            .filter((m): m is { slug: string; title: string } => Boolean(m))
            .map((m) => ({ slug: m.slug, title: m.title }));
        },
      };
    }
  } catch (err) {
    console.warn("[search] index load failed:", err);
    client = { search: () => [], isEmpty: true };
  }

  cache.set(locale, client);
  return client;
}
