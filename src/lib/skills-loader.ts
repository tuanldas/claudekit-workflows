import { promises as fs } from "node:fs";
import * as path from "node:path";
import { unstable_cache } from "next/cache";
import type { Skill } from "@/types/skill";

async function readSkillsIndex(): Promise<Skill[]> {
  const file = path.join(process.cwd(), "src/data/skills-index.json");
  try {
    const raw = await fs.readFile(file, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Skill[]) : [];
  } catch {
    return [];
  }
}

export const loadSkills = unstable_cache(readSkillsIndex, ["skills-index"], {
  revalidate: false,
  tags: ["skills"],
});

export async function loadSkillContent(id: string): Promise<string | null> {
  if (!/^[a-z0-9][a-z0-9-_]*$/i.test(id)) return null;
  const file = path.join(process.cwd(), "src/data/skills-content", `${id}.md`);
  try {
    return await fs.readFile(file, "utf-8");
  } catch {
    return null;
  }
}
