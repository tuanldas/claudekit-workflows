import type { ReactNode } from "react";
import { PageShell } from "./page-shell";

interface Props {
  /** Top metadata strip — typically a DetailHeader or SkillHeader composition. */
  metaStrip?: ReactNode;
  /** Optional banner above the article (e.g. translation fallback notice). */
  banner?: ReactNode;
  /** Article body — usually MDX content. Wrapped in a unified prose theme. */
  children: ReactNode;
  /** Toggle the side-floating TOC on very wide viewports. Default true. */
  withToc?: boolean;
}

const PROSE_CLASS =
  "prose prose-zinc max-w-none dark:prose-invert " +
  "prose-headings:text-foreground prose-p:text-foreground-muted " +
  "prose-strong:text-foreground prose-li:text-foreground-muted " +
  "prose-a:text-accent prose-a:no-underline hover:prose-a:underline";

export function DetailPageTemplate({
  metaStrip,
  banner,
  children,
  withToc = true,
}: Props) {
  return (
    <PageShell withToc={withToc}>
      {metaStrip}
      {banner}
      <article data-docs-content className={PROSE_CLASS}>
        {children}
      </article>
    </PageShell>
  );
}
