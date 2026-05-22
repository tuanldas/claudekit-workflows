import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { loadSkills, loadSkillContent } from "@/lib/skills-loader";
import { compileMdx } from "@/lib/mdx-compile";
import { docsMDXComponents } from "@/components/docs/mdx-components";
import { SkillDetailPage } from "@/components/skills/skill-detail-page";
import { LOCALES } from "@/lib/locale-routing";
import type { Locale } from "@/types/workflow";

export const dynamicParams = true;

const loadSkillSourceCached = unstable_cache(
  async (id: string) => loadSkillContent(id),
  ["skill-mdx-source"],
  { tags: ["skills"], revalidate: false },
);

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  const skills = await loadSkills();
  const params: Array<{ locale: Locale; id: string }> = [];
  for (const locale of LOCALES) {
    for (const skill of skills) {
      params.push({ locale, id: skill.id });
    }
  }
  return params;
}

export default async function SkillDetailRoute({ params }: PageProps) {
  const { locale, id } = await params;
  const skills = await loadSkills();
  const skill = skills.find((s) => s.id === id);
  if (!skill) notFound();

  const source = await loadSkillSourceCached(id);
  if (!source) notFound();

  // Compile happens outside JSX so a corrupt SKILL.md falls back to a plain
  // pre block rather than crashing the route — eslint react-hooks rule disallows
  // try/catch around JSX construction.
  let MDXContent: Awaited<ReturnType<typeof compileMdx>> | null = null;
  try {
    MDXContent = await compileMdx(source);
  } catch (err) {
    console.warn(`[skills] MDX compile failed for ${id}:`, err);
  }

  const content = MDXContent ? (
    <MDXContent components={docsMDXComponents} />
  ) : (
    <pre className="overflow-x-auto rounded-[var(--radius-md)] border border-border bg-surface p-4 text-sm text-foreground">
      {source}
    </pre>
  );

  return (
    <SkillDetailPage
      skill={skill}
      content={content}
      locale={locale as Locale}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const skills = await loadSkills();
  const skill = skills.find((s) => s.id === id);
  if (!skill) return {};
  return {
    title: `${skill.name} | ClaudeKit Skills`,
    description: skill.description,
  };
}
