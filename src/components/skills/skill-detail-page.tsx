import type { ReactNode } from "react";
import type { Skill } from "@/types/skill";
import type { Locale } from "@/types/workflow";
import { DetailPageTemplate } from "@/components/shell/detail-page-template";
import { SkillHeader } from "./skill-header";

interface Props {
  skill: Skill;
  content: ReactNode;
  locale: Locale;
}

export function SkillDetailPage({ skill, content }: Props) {
  return (
    <DetailPageTemplate metaStrip={<SkillHeader skill={skill} />} withToc>
      {content}
    </DetailPageTemplate>
  );
}
