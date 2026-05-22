const PLUGIN_STYLES: Record<string, string> = {
  ck: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:ring-orange-900",
  ckm: "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:ring-purple-900",
  "anthropic-skills":
    "bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800",
  gstack:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-900",
};

const DEFAULT_STYLE =
  "bg-gray-50 text-gray-700 ring-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-800";

export function SkillPluginBadge({ plugin }: { plugin: string }) {
  const className = PLUGIN_STYLES[plugin] ?? DEFAULT_STYLE;
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {plugin}
    </span>
  );
}
