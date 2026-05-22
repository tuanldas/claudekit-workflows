import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardBody, CardFooter } from "./card";

describe("Card", () => {
  it("renders children with default border", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card).toHaveTextContent("Content");
    expect(card.className).toContain("border-border");
  });

  it("applies selected styles when selected=true", () => {
    render(
      <Card data-testid="card" selected>
        Selected
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("border-accent");
    expect(screen.getByTestId("card").className).toContain("bg-accent-subtle");
  });

  it("applies hover styles when interactive=true and not selected", () => {
    render(
      <Card data-testid="card" interactive>
        Hover me
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("hover:bg-surface");
  });

  it("composes header / body / footer", () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
