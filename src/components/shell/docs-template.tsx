import type { ReactNode } from "react";
import { PageShell } from "./page-shell";
import { FloatingToc } from "./floating-toc";

interface Props {
  /** Optional banner above the article (translation fallback, deprecation notice). */
  banner?: ReactNode;
  /** MDX article body. Wrapped in unified prose theme with dark-mode support. */
  children: ReactNode;
  /** Toggle the side-floating TOC on very wide viewports. Default true. */
  withToc?: boolean;
  /** Forwarded to <article> (e.g. data-fallback). */
  articleProps?: Record<string, string | undefined>;
}

const PROSE_CLASS =
  "prose prose-zinc max-w-none dark:prose-invert " +
  "prose-headings:text-foreground prose-p:text-foreground-muted " +
  "prose-strong:text-foreground prose-li:text-foreground-muted " +
  "prose-a:text-accent prose-a:no-underline hover:prose-a:underline";

export function DocsTemplate({
  banner,
  children,
  withToc = true,
  articleProps,
}: Props) {
  return (
    <PageShell withToc={withToc}>
      {banner}
      <article data-docs-content className={PROSE_CLASS} {...articleProps}>
        {children}
      </article>
      {withToc && <FloatingToc />}
    </PageShell>
  );
}
