import { describe, it, expect } from "vitest";
import path from "node:path";
import { buildDocsTree } from "./docs-tree";

const FIXTURE_VI = path.resolve(__dirname, "../../tests/fixtures/docs/vi");

describe("buildDocsTree", () => {
  it("returns empty tree for non-existent dir", async () => {
    const tree = await buildDocsTree("vi", "/no/such/path");
    expect(tree.sections).toEqual([]);
  });

  it("groups top-level folder = section, root files in _root", async () => {
    const tree = await buildDocsTree("vi", FIXTURE_VI);
    const slugs = tree.sections.map((s) => s.slug);
    expect(slugs).toContain("engineer");
    expect(slugs).toContain("marketing");
    expect(slugs).toContain("_root");
  });

  it("orders items by filename prefix NN-", async () => {
    const tree = await buildDocsTree("vi", FIXTURE_VI);
    const engineer = tree.sections.find((s) => s.slug === "engineer");
    expect(engineer).toBeDefined();
    expect(engineer?.items.map((i) => i.order)).toEqual([1, 2]); // 03-hidden excluded
  });

  it("excludes hidden:true frontmatter", async () => {
    const tree = await buildDocsTree("vi", FIXTURE_VI);
    const engineer = tree.sections.find((s) => s.slug === "engineer");
    const slugs = engineer?.items.map((i) => i.slug) ?? [];
    expect(slugs).not.toContain("engineer/03-hidden");
  });

  it("reads _section.json title override + order", async () => {
    const tree = await buildDocsTree("vi", FIXTURE_VI);
    const engineer = tree.sections.find((s) => s.slug === "engineer");
    expect(engineer?.title.vi).toBe("Engineer Kit");
    expect(engineer?.order).toBe(1);
  });

  it("uses frontmatter nav_title when present", async () => {
    const tree = await buildDocsTree("vi", FIXTURE_VI);
    const engineer = tree.sections.find((s) => s.slug === "engineer");
    const item = engineer?.items.find((i) => i.slug === "engineer/02-thinking");
    expect(item?.navTitle).toBe("Thinking Tools");
  });

  it("falls back to title-cased slug when no frontmatter", async () => {
    const tree = await buildDocsTree("vi", FIXTURE_VI);
    const engineer = tree.sections.find((s) => s.slug === "engineer");
    const item = engineer?.items.find((i) => i.slug === "engineer/01-core");
    expect(item?.navTitle).toBe("Core");
  });
});
