import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillDetailPage } from "./skill-detail-page";
import type { Skill } from "@/types/skill";

const fixtureSkill: Skill = {
  id: "ck-plan",
  name: "ck:plan",
  description: "Plan implementations.",
  tags: ["planning"],
  group: "ck-plan",
  path: "ck-plan/SKILL.md",
  excerpt: "...",
};

describe("SkillDetailPage", () => {
  it("delegates H1 to MDX content (avoids duplicate skill-name heading)", () => {
    render(
      <SkillDetailPage
        skill={fixtureSkill}
        content={<h1>ck:plan</h1>}
        locale="vi"
      />,
    );
    // Only the MDX content provides the H1 — SkillHeader is metadata-only.
    expect(
      screen.getAllByRole("heading", { level: 1, name: /ck:plan/ }),
    ).toHaveLength(1);
  });

  it("renders provided content node", () => {
    render(
      <SkillDetailPage
        skill={fixtureSkill}
        content={<div data-testid="mdx">MDX body</div>}
        locale="vi"
      />,
    );
    expect(screen.getByTestId("mdx")).toBeInTheDocument();
  });

  it("renders plugin badge for ck:* skills", () => {
    render(
      <SkillDetailPage
        skill={fixtureSkill}
        content={<div>x</div>}
        locale="vi"
      />,
    );
    expect(screen.getByText("ck")).toBeInTheDocument();
  });

  it("renders tags", () => {
    render(
      <SkillDetailPage
        skill={{ ...fixtureSkill, tags: ["foo", "bar"] }}
        content={<div>x</div>}
        locale="vi"
      />,
    );
    expect(screen.getByText("foo")).toBeInTheDocument();
    expect(screen.getByText("bar")).toBeInTheDocument();
  });

  it("renders article container with MDX selector attribute (TOC integration)", () => {
    const { container } = render(
      <SkillDetailPage
        skill={fixtureSkill}
        content={<p>x</p>}
        locale="vi"
      />,
    );
    expect(container.querySelector("article[data-docs-content]")).toBeTruthy();
  });
});
