import type { Skill } from "@/types/skill";
import { derivePlugin } from "@/lib/skill-plugin";
import { SkillPluginBadge } from "./skill-plugin-badge";

interface Props {
  skill: Skill;
}

export function SkillHeader({ skill }: Props) {
  const plugin = derivePlugin(skill);
  return (
    <header className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {plugin && <SkillPluginBadge plugin={plugin} />}
        <span className="text-xs font-medium tracking-wider text-orange-600 uppercase dark:text-orange-400">
          {skill.group}
        </span>
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        {skill.name}
      </h1>
      {skill.description && (
        <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          {skill.description}
        </p>
      )}
      {skill.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
