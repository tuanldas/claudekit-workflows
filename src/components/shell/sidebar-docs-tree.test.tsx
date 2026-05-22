import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { SidebarDocsTree } from "./sidebar-docs-tree";
import type { DocsTree } from "@/types/docs";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const fixtureTree: DocsTree = {
  sections: [
    {
      slug: "engineer",
      title: { vi: "Engineer", en: "Engineer" },
      order: 1,
      items: [
        {
          slug: "engineer/01-core-workflow",
          navTitle: "Core Workflow",
          order: 1,
          hidden: false,
        },
        {
          slug: "engineer/02-thinking-tools",
          navTitle: "Thinking Tools",
          order: 2,
          hidden: false,
        },
      ],
    },
    {
      slug: "marketing",
      title: { vi: "Marketing", en: "Marketing" },
      order: 2,
      items: [
        {
          slug: "marketing/01-overview",
          navTitle: "Overview",
          order: 1,
          hidden: false,
        },
      ],
    },
  ],
};

describe("SidebarDocsTree", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePathname).mockReturnValue("/vi/docs/engineer/01-core-workflow");
  });

  it("renders all section titles from passed tree", () => {
    render(<SidebarDocsTree tree={fixtureTree} locale="vi" />);
    expect(screen.getByText("Engineer")).toBeInTheDocument();
    expect(screen.getByText("Marketing")).toBeInTheDocument();
  });

  it("renders all items from each section", () => {
    render(<SidebarDocsTree tree={fixtureTree} locale="vi" />);
    expect(screen.getByText("Core Workflow")).toBeInTheDocument();
    expect(screen.getByText("Thinking Tools")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
  });

  it("marks the current docs item with aria-current=page", () => {
    vi.mocked(usePathname).mockReturnValue("/vi/docs/engineer/01-core-workflow");
    render(<SidebarDocsTree tree={fixtureTree} locale="vi" />);
    const activeLink = screen.getByText("Core Workflow").closest("a");
    expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  it("renders empty-state when tree has no sections", () => {
    render(<SidebarDocsTree tree={{ sections: [] }} locale="vi" />);
    expect(screen.getByText(/chưa có docs/i)).toBeInTheDocument();
  });
});
