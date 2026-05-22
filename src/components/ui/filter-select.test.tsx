import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterSelect } from "./filter-select";

const options = [
  { value: "all", label: "All", count: 39 },
  { value: "core", label: "Core", count: 10 },
  { value: "x", label: "X" },
];

describe("FilterSelect", () => {
  it("renders a native <select> with provided options", () => {
    render(
      <FilterSelect
        value="all"
        onValueChange={() => {}}
        options={options}
        aria-label="Group filter"
      />,
    );
    const select = screen.getByRole("combobox", { name: "Group filter" });
    expect(select.tagName).toBe("SELECT");
    expect(screen.getByRole("option", { name: "All (39)" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Core (10)" })).toBeInTheDocument();
  });

  it("omits the count when option has no count", () => {
    render(
      <FilterSelect
        value="x"
        onValueChange={() => {}}
        options={options}
        aria-label="f"
      />,
    );
    expect(screen.getByRole("option", { name: "X" })).toBeInTheDocument();
  });

  it("calls onValueChange with the new value", () => {
    const onChange = vi.fn();
    render(
      <FilterSelect
        value="all"
        onValueChange={onChange}
        options={options}
        aria-label="f"
      />,
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "core" },
    });
    expect(onChange).toHaveBeenCalledWith("core");
  });

  it("applies focus + border styling classes", () => {
    render(
      <FilterSelect
        value="all"
        onValueChange={() => {}}
        options={options}
        aria-label="f"
      />,
    );
    const select = screen.getByRole("combobox");
    expect(select.className).toContain("border-border");
    expect(select.className).toContain("focus:border-accent");
  });
});
