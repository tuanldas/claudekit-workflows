import Link from "next/link";
import type { Skill } from "@/types/skill";
import type { Locale } from "@/types/workflow";
import { derivePlugin } from "@/lib/skill-plugin";
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
      className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-orange-300 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-700"
    >
      <article>
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {skill.name}
          </h3>
          {plugin && <SkillPluginBadge plugin={plugin} />}
        </div>
        <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
          {skill.description}
        </p>
        {skill.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {skill.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
