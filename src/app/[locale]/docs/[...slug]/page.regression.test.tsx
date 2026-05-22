import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/cache", () => ({
  unstable_cache: <Args extends unknown[], R>(
    fn: (...args: Args) => R,
  ) => fn,
}));

vi.mock("@/lib/mdx-loader", () => ({
  loadMdx: vi.fn(async (locale: string, slug: string) => {
    if (locale === "en" && slug === "engineer/01-core-workflow") {
      return {
        source: "# Core Workflow\n\nIntro paragraph.\n\n## Section A\n\nBody.",
        frontmatter: { title: "Core Workflow" },
        fallback: true,
        originalLocale: "en",
        resolvedLocale: "vi",
      };
    }
    return {
      source: "# Core Workflow\n\nIntro paragraph.\n\n## Section A\n\nBody.",
      frontmatter: { title: "Core Workflow" },
      fallback: false,
      originalLocale: locale,
      resolvedLocale: locale,
    };
  }),
  listAllSlugs: vi.fn(async () => ["engineer/01-core-workflow"]),
}));

import DocsPage from "./page";

describe("DocsPage regression (post-shell-refactor)", () => {
  it("renders article wrapper with data-docs-content attribute", async () => {
    const node = await DocsPage({
      params: Promise.resolve({
        locale: "vi",
        slug: ["engineer", "01-core-workflow"],
      }),
    });
    const { container } = render(node as React.ReactElement);
    const article = container.querySelector("article[data-docs-content]");
    expect(article).not.toBeNull();
  });

  it("renders main heading from MDX source", async () => {
    const node = await DocsPage({
      params: Promise.resolve({
        locale: "vi",
        slug: ["engineer", "01-core-workflow"],
      }),
    });
    render(node as React.ReactElement);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1.textContent).toMatch(/core workflow/i);
  });

  it("renders translation banner when serving fallback locale", async () => {
    const node = await DocsPage({
      params: Promise.resolve({
        locale: "en",
        slug: ["engineer", "01-core-workflow"],
      }),
    });
    const { container } = render(node as React.ReactElement);
    const article = container.querySelector("article[data-docs-content]");
    expect(article?.getAttribute("data-fallback")).toBe("true");
    expect(container.querySelector('[role="status"]')).not.toBeNull();
  });
});
