import type { Skill } from "@/types/skill";
import { derivePlugin } from "@/lib/skill-plugin";
import { Badge } from "@/components/ui";
import { DetailHeader } from "@/components/shell/detail-header";
import { SkillPluginBadge } from "./skill-plugin-badge";

interface Props {
  skill: Skill;
}

/**
 * Metadata strip rendered above the MDX article. MDX content owns the H1
 * (typically `# {skill-name}` at top of SKILL.md), so DetailHeader's title
 * slot is intentionally omitted — only the meta strip renders.
 */
export function SkillHeader({ skill }: Props) {
  const plugin = derivePlugin(skill);
  const hasMeta = plugin || skill.group;
  const hasTags = skill.tags.length > 0;
  if (!hasMeta && !hasTags) return null;

  return (
    <DetailHeader
      className="mb-4"
      meta={
        <>
          {plugin && <SkillPluginBadge plugin={plugin} />}
          {skill.group && (
            <span className="text-micro font-semibold tracking-wider text-accent uppercase">
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
        </>
      }
    />
  );
}
