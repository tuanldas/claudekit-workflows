import type { Skill } from "@/types/skill";
import { derivePlugin } from "@/lib/skill-plugin";
import { Badge } from "@/components/ui";
import { SkillPluginBadge } from "./skill-plugin-badge";

interface Props {
  skill: Skill;
}

/**
 * Compact metadata strip rendered above the MDX article. Intentionally
 * omits the skill name as H1 — the MDX content owns the canonical H1
 * (typically `# {skill-name}` at the top of SKILL.md) so we don't end up
 * with duplicated headings.
 */
export function SkillHeader({ skill }: Props) {
  const plugin = derivePlugin(skill);
  const hasMeta = plugin || skill.group;
  const hasTags = skill.tags.length > 0;
  if (!hasMeta && !hasTags) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {plugin && <SkillPluginBadge plugin={plugin} />}
      {skill.group && (
        <span className="text-[11px] font-semibold tracking-wider text-accent uppercase">
          {skill.group}
        </span>
      )}
      {hasMeta && hasTags && (
        <span aria-hidden className="text-foreground-subtle">
          ·
        </span>
      )}
      {skill.tags.map((tag) => (
        <Badge key={tag} variant="outline" size="sm">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
