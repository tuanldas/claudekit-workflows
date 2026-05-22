import Link from "next/link";
import type { Skill } from "@/types/skill";
import type { Locale } from "@/types/workflow";
import { derivePlugin } from "@/lib/skill-plugin";
import { Badge } from "@/components/ui";
import { SkillPluginBadge } from "./skill-plugin-badge";

interface Props {
  skill: Skill;
  locale: Locale;
}

export function SkillCard({ skill, locale }: Props) {
  const plugin = derivePlugin(skill);
  return (
    <Link
      href={`/${locale}/skills/${skill.id}`}
      className="block rounded-[var(--radius-lg)] border border-border bg-background p-4 transition-colors hover:border-border-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-mono text-[13px] font-semibold tracking-tight text-foreground">
            {skill.name}
          </h3>
          {plugin && <SkillPluginBadge plugin={plugin} />}
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-foreground-muted">
          {skill.description}
        </p>
        {skill.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {skill.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
