import type { ReactNode } from "react";
import type { Skill } from "@/types/skill";
import type { Locale } from "@/types/workflow";
import { FloatingToc } from "@/components/shell/floating-toc";
import { PageShell } from "@/components/shell/page-shell";
import { SkillHeader } from "./skill-header";

interface Props {
  skill: Skill;
  content: ReactNode;
  locale: Locale;
}

export function SkillDetailPage({ skill, content }: Props) {
  return (
    <PageShell withToc>
      <SkillHeader skill={skill} />
      <article
        data-docs-content
        className="prose prose-zinc max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground-muted prose-strong:text-foreground prose-li:text-foreground-muted prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
      >
        {content}
      </article>
      <FloatingToc />
    </PageShell>
  );
}
