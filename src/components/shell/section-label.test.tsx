import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionLabel } from "./section-label";

describe("SectionLabel", () => {
  it("renders children inside an h3 element", () => {
    render(<SectionLabel>Phases</SectionLabel>);
    const node = screen.getByText("Phases");
    expect(node.tagName).toBe("H3");
  });

  it("applies uppercase + tracked typography", () => {
    render(<SectionLabel>Tips</SectionLabel>);
    const node = screen.getByText("Tips");
    expect(node.className).toContain("uppercase");
    expect(node.className).toContain("tracking-wider");
  });

  it("merges custom className", () => {
    render(<SectionLabel className="custom-x">x</SectionLabel>);
    expect(screen.getByText("x").className).toContain("custom-x");
  });
});
