import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders message text", () => {
    render(<EmptyState message="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("exposes role=status for assistive tech", () => {
    render(<EmptyState message="empty" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders optional icon + action slots", () => {
    render(
      <EmptyState
        message="empty"
        icon={<span data-testid="icon">i</span>}
        action={<button>Retry</button>}
      />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("uses dashed border styling", () => {
    render(<EmptyState message="x" />);
    expect(screen.getByRole("status").className).toContain("border-dashed");
  });
});
