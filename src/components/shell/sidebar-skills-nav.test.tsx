import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname } from "next/navigation";
import { SidebarSkillsNavClient } from "./sidebar-skills-nav";
import type { Skill } from "@/types/skill";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const fixtureSkills: Skill[] = [
  {
    id: "ck-plan",
    name: "ck:plan",
    description: "planning",
    tags: [],
    group: "ck-plan",
    path: "ck-plan/SKILL.md",
    excerpt: "...",
  },
  {
    id: "ck-cook",
    name: "ck:cook",
    description: "cook",
    tags: [],
    group: "ck-cook",
    path: "ck-cook/SKILL.md",
    excerpt: "...",
  },
  {
    id: "analytics",
    name: "ckm:analytics",
    description: "analytics",
    tags: [],
    group: "analytics",
    path: "analytics/SKILL.md",
    excerpt: "...",
  },
  {
    id: "ai-rules-setup",
    name: "ai-rules-setup",
    description: "rules",
    tags: [],
    group: "ai-rules-setup",
    path: "ai-rules-setup/SKILL.md",
    excerpt: "...",
  },
];

describe("SidebarSkillsNavClient", () => {
  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue("/vi/skills");
  });

  it("groups skills by derived plugin (ck, ckm, other)", () => {
    render(<SidebarSkillsNavClient skills={fixtureSkills} locale="vi" />);
    expect(screen.getByText(/^ck$/i)).toBeInTheDocument();
    expect(screen.getByText(/^ckm$/i)).toBeInTheDocument();
  });

  it("renders inline filter input", () => {
    render(<SidebarSkillsNavClient skills={fixtureSkills} locale="vi" />);
    expect(
      screen.getByPlaceholderText(/lọc|filter/i),
    ).toBeInTheDocument();
  });

  it("filters skills by name as user types", async () => {
    const user = userEvent.setup();
    render(<SidebarSkillsNavClient skills={fixtureSkills} locale="vi" />);
    const input = screen.getByPlaceholderText(/lọc|filter/i);
    await user.type(input, "analytics");
    expect(screen.getByText("ckm:analytics")).toBeInTheDocument();
    expect(screen.queryByText("ck:plan")).not.toBeInTheDocument();
  });

  it("renders skill links to /[locale]/skills/[id]", () => {
    render(<SidebarSkillsNavClient skills={fixtureSkills} locale="vi" />);
    const link = screen.getByText("ck:plan").closest("a");
    expect(link).toHaveAttribute("href", "/vi/skills/ck-plan");
  });

  it("marks active skill with aria-current=page", () => {
    vi.mocked(usePathname).mockReturnValue("/vi/skills/ck-plan");
    render(<SidebarSkillsNavClient skills={fixtureSkills} locale="vi" />);
    const activeLink = screen.getByText("ck:plan").closest("a");
    expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  it("renders empty state when skills array is empty", () => {
    render(<SidebarSkillsNavClient skills={[]} locale="vi" />);
    expect(
      screen.getByText(/skills sync|chưa được|chưa cấu hình/i),
    ).toBeInTheDocument();
  });

  it("respects en locale for filter placeholder", () => {
    render(<SidebarSkillsNavClient skills={fixtureSkills} locale="en" />);
    expect(screen.getByPlaceholderText(/filter/i)).toBeInTheDocument();
  });
});
