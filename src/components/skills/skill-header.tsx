import type { Skill } from "@/types/skill";
import { derivePlugin } from "@/lib/skill-plugin";
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
        <span className="text-xs font-medium tracking-wider text-orange-600 uppercase dark:text-orange-400">
          {skill.group}
        </span>
      )}
      {hasMeta && hasTags && (
        <span className="text-gray-300 dark:text-gray-700">·</span>
      )}
      {skill.tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
