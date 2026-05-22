export function SkillGroupBadge({ group }: { group: string }) {
  return (
    <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
      {group}
    </span>
  );
}
