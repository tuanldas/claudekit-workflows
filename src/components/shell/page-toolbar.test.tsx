import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageToolbar } from "./page-toolbar";

describe("PageToolbar", () => {
  it("renders nothing when all slots are empty", () => {
    const { container } = render(<PageToolbar />);
    expect(container.querySelector("input")).toBeNull();
  });

  it("renders the search slot", () => {
    render(<PageToolbar search={<input data-testid="s" />} />);
    expect(screen.getByTestId("s")).toBeInTheDocument();
  });

  it("renders the filter slot", () => {
    render(
      <PageToolbar
        filter={
          <select data-testid="f">
            <option>a</option>
          </select>
        }
      />,
    );
    expect(screen.getByTestId("f")).toBeInTheDocument();
  });

  it("renders the count slot", () => {
    render(<PageToolbar count={<span>39 items</span>} />);
    expect(screen.getByText("39 items")).toBeInTheDocument();
  });

  it("stacks slots on mobile via flex-col", () => {
    const { container } = render(
      <PageToolbar search={<input />} count={<span>x</span>} />,
    );
    expect((container.firstChild as HTMLElement).className).toContain(
      "flex-col",
    );
  });
});
