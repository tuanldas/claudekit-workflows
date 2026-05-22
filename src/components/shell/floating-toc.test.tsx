import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FloatingToc } from "./floating-toc";

describe("FloatingToc", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders TOC items extracted from rendered article content", async () => {
    document.body.innerHTML = `
      <article data-docs-content>
        <h2 id="intro">Intro</h2>
        <h2 id="usage">Usage</h2>
      </article>
    `;
    render(<FloatingToc />);
    expect(
      await screen.findByRole("link", { name: "Intro" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Usage" }),
    ).toBeInTheDocument();
  });

  it("hides below the wide-viewport breakpoint via responsive classes", () => {
    document.body.innerHTML = `<article data-docs-content><h2 id="x">X</h2></article>`;
    render(<FloatingToc />);
    const aside = screen.getByRole("complementary", { name: /on this page/i });
    expect(aside.className).toMatch(/hidden/);
    // Threshold raised to min-[1700px] so floating TOC only appears when there
    // is enough room next to a max-w-6xl content column to avoid overlap.
    expect(aside.className).toMatch(/min-\[1700px\]:block/);
  });

  it("positions itself fixed at the right edge of the viewport on wide screens", () => {
    document.body.innerHTML = `<article data-docs-content><h2 id="x">X</h2></article>`;
    render(<FloatingToc />);
    const aside = screen.getByRole("complementary", { name: /on this page/i });
    expect(aside.className).toMatch(/min-\[1700px\]:fixed/);
    expect(aside.className).toMatch(/min-\[1700px\]:right/);
  });
});
