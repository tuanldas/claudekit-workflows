import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SkillsCatalogContent } from "./skills-catalog-content";
import type { Skill } from "@/types/skill";

const fixtureSkills: Skill[] = [
  {
    id: "ck-plan",
    name: "ck:plan",
    description: "Planning skill for architecture",
    tags: ["planning"],
    group: "ck-plan",
    path: "ck-plan/SKILL.md",
    excerpt: "...",
  },
  {
    id: "ck-cook",
    name: "ck:cook",
    description: "Implementation skill",
    tags: ["coding"],
    group: "ck-cook",
    path: "ck-cook/SKILL.md",
    excerpt: "...",
  },
  {
    id: "analytics",
    name: "ckm:analytics",
    description: "Marketing analytics dashboards",
    tags: ["marketing"],
    group: "analytics",
    path: "analytics/SKILL.md",
    excerpt: "...",
  },
  {
    id: "ai-rules-setup",
    name: "ai-rules-setup",
    description: "Setup AI agent rules",
    tags: [],
    group: "ai-rules-setup",
    path: "ai-rules-setup/SKILL.md",
    excerpt: "...",
  },
];

describe("SkillsCatalogContent", () => {
  it("renders all skills initially", () => {
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    expect(screen.getAllByRole("article")).toHaveLength(fixtureSkills.length);
  });

  it("renders search input with placeholder", () => {
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    expect(
      screen.getByPlaceholderText(/tìm|search/i),
    ).toBeInTheDocument();
  });

  it("filters by group/plugin dropdown", async () => {
    const user = userEvent.setup();
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    const select = screen.getByLabelText(/nhóm|group/i);
    await user.selectOptions(select, "ck");
    const cards = screen.getAllByRole("article");
    expect(cards.length).toBe(2);
  });

  it("filters by search query across name+description+tags", async () => {
    const user = userEvent.setup();
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    const input = screen.getByPlaceholderText(/tìm|search/i);
    await user.type(input, "marketing");
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("ckm:analytics")).toBeInTheDocument();
  });

  it("search is case-insensitive", async () => {
    const user = userEvent.setup();
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    await user.type(screen.getByPlaceholderText(/tìm|search/i), "PLAN");
    expect(screen.getByText("ck:plan")).toBeInTheDocument();
  });

  it("shows empty state when no match", async () => {
    const user = userEvent.setup();
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    await user.type(
      screen.getByPlaceholderText(/tìm|search/i),
      "nonexistent-xyz-abc",
    );
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText(/không|no match|no skills/i)).toBeInTheDocument();
  });

  it("shows CI-aware empty state when skills array is empty", () => {
    render(<SkillsCatalogContent skills={[]} locale="vi" />);
    expect(
      screen.getByText(/skills sync|chưa được|chưa cấu hình/i),
    ).toBeInTheDocument();
  });

  it("renders group filter options based on derived plugin", () => {
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    const select = screen.getByLabelText(/nhóm|group/i) as HTMLSelectElement;
    const optionValues = Array.from(select.options).map((o) => o.value);
    expect(optionValues).toContain("ck");
    expect(optionValues).toContain("ckm");
  });
});
