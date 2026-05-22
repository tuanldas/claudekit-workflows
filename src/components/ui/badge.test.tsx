import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders children inside a span", () => {
    render(<Badge>Beta</Badge>);
    const node = screen.getByText("Beta");
    expect(node.tagName).toBe("SPAN");
  });

  it("applies accent variant", () => {
    render(<Badge variant="accent">New</Badge>);
    expect(screen.getByText("New").className).toContain("bg-accent-subtle");
  });

  it("applies size sm classes", () => {
    render(<Badge size="sm">x</Badge>);
    expect(screen.getByText("x").className).toContain("h-5");
  });

  it("applies success / warning / danger variants", () => {
    const { rerender } = render(<Badge variant="success">ok</Badge>);
    expect(screen.getByText("ok").className).toContain("text-success");

    rerender(<Badge variant="warning">warn</Badge>);
    expect(screen.getByText("warn").className).toContain("text-warning");

    rerender(<Badge variant="danger">err</Badge>);
    expect(screen.getByText("err").className).toContain("text-danger");
  });

  it("renders leading icon slot when provided", () => {
    render(
      <Badge leadingIcon={<svg data-testid="icon" />}>Tag</Badge>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
