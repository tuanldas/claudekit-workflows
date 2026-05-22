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
      <div className="max-w-3xl">
        <SkillHeader skill={skill} />
        <article
          data-docs-content
          className="prose prose-slate max-w-none dark:prose-invert"
        >
          {content}
        </article>
      </div>
      <FloatingToc />
    </PageShell>
  );
}
