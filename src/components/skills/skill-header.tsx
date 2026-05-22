import type { Skill } from "@/types/skill";
import { derivePlugin } from "@/lib/skill-plugin";
import { SkillPluginBadge } from "./skill-plugin-badge";

interface Props {
  skill: Skill;
}

export function SkillHeader({ skill }: Props) {
  const plugin = derivePlugin(skill);
  return (
    <header className="mb-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {plugin && <SkillPluginBadge plugin={plugin} />}
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {skill.group}
        </span>
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {skill.name}
      </h1>
      {skill.description && (
        <p className="text-base text-gray-600 dark:text-gray-400">
          {skill.description}
        </p>
      )}
      {skill.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
