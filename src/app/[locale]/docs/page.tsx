import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { loadMdx } from "@/lib/mdx-loader";
import { compileMdx } from "@/lib/mdx-compile";
import { docsMDXComponents } from "@/components/docs/mdx-components";
import { TranslationBanner } from "@/components/docs/translation-banner";
import type { Locale } from "@/types/workflow";

const LANDING_SLUG = "claudekit-overview";

const loadLanding = unstable_cache(
  async (locale: Locale) => loadMdx(locale, LANDING_SLUG),
  ["docs-mdx-landing"],
  { tags: ["docs-mdx"], revalidate: false },
);

export default async function DocsLandingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const result = await loadLanding(locale);
  if (!result) notFound();

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
