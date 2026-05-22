import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DetailHeader } from "./detail-header";

describe("DetailHeader", () => {
  it("renders title in an h1 when provided", () => {
    render(<DetailHeader title="My Workflow" />);
    const node = screen.getByRole("heading", { level: 1, name: "My Workflow" });
    expect(node).toBeInTheDocument();
  });

  it("omits the h1 when title prop is missing (article owns the heading)", () => {
    render(<DetailHeader eyebrow="Skills" description="An MDX article" />);
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
  });

  it("renders eyebrow, description, meta, and actions slots", () => {
    render(
      <DetailHeader
        eyebrow="Group"
        title="T"
        description="Desc text"
        meta={<span data-testid="meta">M</span>}
        actions={<button>Close</button>}
      />,
    );
    expect(screen.getByText("Group")).toBeInTheDocument();
    expect(screen.getByText("Desc text")).toBeInTheDocument();
    expect(screen.getByTestId("meta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("styles eyebrow with accent + uppercase", () => {
    render(<DetailHeader eyebrow="Eye" title="T" />);
    expect(screen.getByText("Eye").className).toContain("text-accent");
    expect(screen.getByText("Eye").className).toContain("uppercase");
  });
});
