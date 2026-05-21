import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { loadMdx, listAllSlugs } from "@/lib/mdx-loader";
import { compileMdx } from "@/lib/mdx-compile";
import { docsMDXComponents } from "@/components/docs/mdx-components";
import { TranslationBanner } from "@/components/docs/translation-banner";
import { LOCALES } from "@/lib/locale-routing";
import type { Locale } from "@/types/workflow";

// Vercel serverful: dynamicParams=true (default). generateStaticParams chỉ
// generate routes có file thực; unknown slugs fall to dynamic SSR + cache.
export const dynamicParams = true;

export async function generateStaticParams() {
  const params: Array<{ locale: Locale; slug: string[] }> = [];
  for (const locale of LOCALES) {
    const slugs = await listAllSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug: slug.split("/") });
    }
  }
  return params;
}

const loadMdxCached = unstable_cache(
  async (locale: Locale, slugStr: string) => loadMdx(locale, slugStr),
  ["docs-mdx-source"],
  { tags: ["docs-mdx"], revalidate: false },
);

interface PageProps {
  params: Promise<{ locale: string; slug: string[] }>;
}

export default async function DocsPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const result = await loadMdxCached(locale, slug.join("/"));
  if (!result) notFound();

  // React component is not serializable — compile fresh per render.
  const MDXContent = await compileMdx(result.source);

  return (
    <>
      {result.fallback && (
        <TranslationBanner
          originalLocale={result.originalLocale}
          resolvedLocale={result.resolvedLocale}
        />
      )}
      <article
        data-docs-content
        data-fallback={result.fallback ? "true" : "false"}
        className="prose prose-slate max-w-none"
      >
        <MDXContent components={docsMDXComponents} />
      </article>
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const result = await loadMdxCached(locale, slug.join("/"));
  if (!result) return {};
  const title =
    (typeof result.frontmatter.title === "string" &&
      result.frontmatter.title) ||
    slug[slug.length - 1];
  return {
    title: `${title} | ClaudeKit Workflows`,
    alternates: {
      canonical: result.fallback
        ? `/${result.resolvedLocale}/docs/${slug.join("/")}`
        : undefined,
    },
  };
}
