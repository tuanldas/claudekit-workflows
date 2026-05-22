import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HamburgerButton } from "./hamburger-button";

describe("HamburgerButton", () => {
  it("is hidden on lg viewports via lg:hidden class", () => {
    render(<HamburgerButton onClick={vi.fn()} label="Open navigation" />);
    expect(screen.getByRole("button")).toHaveClass("lg:hidden");
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<HamburgerButton onClick={onClick} label="Open navigation" />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("uses provided aria-label", () => {
    render(<HamburgerButton onClick={vi.fn()} label="Mở điều hướng" />);
    expect(
      screen.getByRole("button", { name: /mở điều hướng/i }),
    ).toBeInTheDocument();
  });

  it("touch target meets ≥44px (min-h-11/min-w-11)", () => {
    render(<HamburgerButton onClick={vi.fn()} label="Open navigation" />);
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/min-h-11|h-11/);
    expect(btn.className).toMatch(/min-w-11|w-11/);
  });
});
