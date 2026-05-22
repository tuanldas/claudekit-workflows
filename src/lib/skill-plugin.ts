import type { Skill } from "@/types/skill";

export function derivePlugin(skill: Pick<Skill, "name" | "plugin">): string | null {
  if (skill.plugin) return skill.plugin;
  const idx = skill.name.indexOf(":");
  if (idx > 0) return skill.name.slice(0, idx);
  return null;
}

export function pluginGroupKey(skill: Pick<Skill, "name" | "plugin" | "group">): string {
  return derivePlugin(skill) ?? skill.group;
}
