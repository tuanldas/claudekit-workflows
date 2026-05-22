import { loadSkills } from "@/lib/skills-loader";
import { SkillsCatalogContent } from "@/components/skills/skills-catalog-content";
import type { Locale } from "@/types/workflow";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function SkillsPage({ params }: PageProps) {
  const { locale } = await params;
  const skills = await loadSkills();
  return (
    <SkillsCatalogContent skills={skills} locale={locale as Locale} />
  );
}

export const metadata = {
  title: "Skills | ClaudeKit Workflows",
};
