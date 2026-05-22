import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CatalogGrid } from "./catalog-grid";

describe("CatalogGrid", () => {
  it("renders children", () => {
    render(
      <CatalogGrid>
        <div data-testid="child">x</div>
      </CatalogGrid>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("uses cards density (3-col lg) by default", () => {
    const { container } = render(
      <CatalogGrid>
        <div />
      </CatalogGrid>,
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain("lg:grid-cols-3");
    expect(grid.className).not.toContain("xl:grid-cols-4");
  });

  it("applies tight density (4-col xl)", () => {
    const { container } = render(
      <CatalogGrid density="tight">
        <div />
      </CatalogGrid>,
    );
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain("xl:grid-cols-4");
  });

  it("merges custom className", () => {
    const { container } = render(
      <CatalogGrid className="custom-y">
        <div />
      </CatalogGrid>,
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      "custom-y",
    );
  });
});
