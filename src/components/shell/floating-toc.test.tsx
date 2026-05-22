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

  it("hides below the 2xl breakpoint via responsive classes", () => {
    document.body.innerHTML = `<article data-docs-content><h2 id="x">X</h2></article>`;
    render(<FloatingToc />);
    const aside = screen.getByRole("complementary", { name: /on this page/i });
    expect(aside.className).toMatch(/hidden/);
    expect(aside.className).toMatch(/2xl:block/);
  });

  it("positions itself fixed at the right edge of the viewport on wide screens", () => {
    document.body.innerHTML = `<article data-docs-content><h2 id="x">X</h2></article>`;
    render(<FloatingToc />);
    const aside = screen.getByRole("complementary", { name: /on this page/i });
    expect(aside.className).toMatch(/2xl:fixed/);
    expect(aside.className).toMatch(/2xl:right/);
  });
});
