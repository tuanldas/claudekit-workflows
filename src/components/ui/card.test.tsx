import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    expect(screen.getByTestId("card").className).toContain(
      "hover:bg-surface-hover",
    );
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

  it("renders as a div by default", () => {
    render(<Card data-testid="card">Default</Card>);
    expect(screen.getByTestId("card").tagName).toBe("DIV");
  });

  it("renders as a button when as='button'", async () => {
    const onClick = vi.fn();
    render(
      <Card
        as="button"
        data-testid="card"
        onClick={onClick}
        aria-pressed="false"
      >
        Click
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("BUTTON");
    expect(card).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders as an anchor when as='a' and passes href", () => {
    render(
      <Card as="a" href="/skills/ck-plan" data-testid="card">
        Anchor
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card.tagName).toBe("A");
    expect(card).toHaveAttribute("href", "/skills/ck-plan");
  });
});
