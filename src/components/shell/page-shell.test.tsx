import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageShell } from "./page-shell";

describe("PageShell", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders children without TOC slot by default", () => {
    render(
      <PageShell>
        <p>content</p>
      </PageShell>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
    expect(
      screen.queryByRole("complementary", { name: /on this page/i }),
    ).not.toBeInTheDocument();
  });

  it("uses full-width wrapper with horizontal padding (no max-width constraint)", () => {
    const { container } = render(
      <PageShell>
        <p>x</p>
      </PageShell>,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).not.toMatch(/max-w-/);
    expect(wrapper.className).toMatch(/px-6/);
    expect(wrapper.className).toMatch(/lg:px-8/);
  });

  it("renders TOC aside slot when withToc=true and DocsToc finds headings", async () => {
    render(
      <PageShell withToc>
        <article data-docs-content>
          <h2 id="intro">Intro</h2>
          <h2 id="usage">Usage</h2>
        </article>
      </PageShell>,
    );
    const aside = screen.getByRole("complementary", { name: /on this page/i });
    expect(aside).toBeInTheDocument();
    expect(aside.className).toMatch(/hidden/);
    expect(aside.className).toMatch(/xl:block/);
    expect(
      await screen.findByRole("link", { name: "Intro" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Usage" }),
    ).toBeInTheDocument();
  });

  it("TOC slot uses sticky positioning (no fixed viewport-edge overlap)", () => {
    render(
      <PageShell withToc>
        <article data-docs-content>
          <h2 id="x">X</h2>
        </article>
      </PageShell>,
    );
    const aside = screen.getByRole("complementary", { name: /on this page/i });
    // Aside should not use fixed positioning — that's what caused the prior overlap bug.
    expect(aside.className).not.toMatch(/\bfixed\b/);
    // Inner sticky wrapper carries the scroll-following behaviour.
    const stickyInner = aside.querySelector(".sticky");
    expect(stickyInner).not.toBeNull();
  });

  it("uses 2-column grid layout at xl breakpoint when withToc=true", () => {
    const { container } = render(
      <PageShell withToc>
        <article data-docs-content>
          <h2 id="x">X</h2>
        </article>
      </PageShell>,
    );
    const grid = container.querySelector(".xl\\:grid");
    expect(grid).not.toBeNull();
    expect(grid?.className).toMatch(/xl:grid-cols-/);
  });
});
