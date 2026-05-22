import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillCard } from "./skill-card";
import type { Skill } from "@/types/skill";

const baseSkill: Skill = {
  id: "ck-plan",
  name: "ck:plan",
  description: "Plan implementations, design architectures.",
  tags: ["planning", "architecture", "roadmap"],
  group: "ck-plan",
  path: "ck-plan/SKILL.md",
  excerpt: "...",
};

describe("SkillCard", () => {
  it("renders skill name", () => {
    render(<SkillCard skill={baseSkill} locale="vi" />);
    expect(screen.getByText("ck:plan")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<SkillCard skill={baseSkill} locale="vi" />);
    expect(
      screen.getByText(/Plan implementations, design architectures/),
    ).toBeInTheDocument();
  });

  it("links to skill detail with locale prefix", () => {
    render(<SkillCard skill={baseSkill} locale="vi" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/vi/skills/ck-plan");
  });

  it("renders plugin badge derived from name prefix", () => {
    render(<SkillCard skill={baseSkill} locale="vi" />);
    expect(screen.getByText("ck")).toBeInTheDocument();
  });

  it("renders ckm plugin badge when name starts with ckm:", () => {
    render(
      <SkillCard
        skill={{ ...baseSkill, name: "ckm:analytics" }}
        locale="vi"
      />,
    );
    expect(screen.getByText("ckm")).toBeInTheDocument();
  });

  it("omits plugin badge for bare-name skills", () => {
    render(
      <SkillCard
        skill={{ ...baseSkill, name: "ai-rules-setup", id: "ai-rules-setup" }}
        locale="vi"
      />,
    );
    expect(screen.queryByText(/^(ck|ckm)$/)).not.toBeInTheDocument();
  });

  it("renders at most 3 tags", () => {
    render(
      <SkillCard
        skill={{
          ...baseSkill,
          tags: ["a", "b", "c", "d", "e"],
        }}
        locale="vi"
      />,
    );
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(screen.getByText("c")).toBeInTheDocument();
    expect(screen.queryByText("d")).not.toBeInTheDocument();
    expect(screen.queryByText("e")).not.toBeInTheDocument();
  });

  it("emits article landmark for catalog grid counting", () => {
    render(<SkillCard skill={baseSkill} locale="vi" />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("respects en locale in href", () => {
    render(<SkillCard skill={baseSkill} locale="en" />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/en/skills/ck-plan",
    );
  });
});
