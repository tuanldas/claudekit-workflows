import { Suspense } from "react";
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
    <Suspense fallback={null}>
      <SkillsCatalogContent skills={skills} locale={locale as Locale} />
    </Suspense>
  );
}

export const metadata = {
  title: "Skills | ClaudeKit Workflows",
};
