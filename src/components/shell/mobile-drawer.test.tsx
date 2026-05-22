import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileDrawer } from "./mobile-drawer";
import { __resetBodyScrollLockForTests } from "@/lib/body-scroll-lock";

describe("MobileDrawer", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    __resetBodyScrollLockForTests();
  });

  it("renders nothing when closed", () => {
    render(
      <MobileDrawer open={false} onClose={vi.fn()}>
        <div>content</div>
      </MobileDrawer>,
    );
    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("renders content when open", () => {
    render(
      <MobileDrawer open onClose={vi.fn()}>
        <div>content</div>
      </MobileDrawer>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("exposes a dialog role with aria-modal", () => {
    render(
      <MobileDrawer open onClose={vi.fn()}>
        <div>content</div>
      </MobileDrawer>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("calls onClose when backdrop clicked", async () => {
    const onClose = vi.fn();
    render(
      <MobileDrawer open onClose={onClose}>
        <div>content</div>
      </MobileDrawer>,
    );
    await userEvent.click(screen.getByTestId("drawer-backdrop"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose on Escape key", async () => {
    const onClose = vi.fn();
    render(
      <MobileDrawer open onClose={onClose}>
        <div>content</div>
      </MobileDrawer>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("locks body scroll when open", () => {
    const { rerender } = render(
      <MobileDrawer open={false} onClose={vi.fn()}>
        <div>x</div>
      </MobileDrawer>,
    );
    expect(document.body.style.overflow).not.toBe("hidden");
    rerender(
      <MobileDrawer open onClose={vi.fn()}>
        <div>x</div>
      </MobileDrawer>,
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("releases body scroll lock when closed", () => {
    const { rerender } = render(
      <MobileDrawer open onClose={vi.fn()}>
        <div>x</div>
      </MobileDrawer>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(
      <MobileDrawer open={false} onClose={vi.fn()}>
        <div>x</div>
      </MobileDrawer>,
    );
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("traps focus inside drawer (Tab wraps from last to first)", async () => {
    render(
      <MobileDrawer open onClose={vi.fn()}>
        <button>first</button>
        <button>last</button>
      </MobileDrawer>,
    );
    const last = screen.getByText("last");
    last.focus();
    expect(last).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByText("first")).toHaveFocus();
  });

  it("traps focus inside drawer (Shift+Tab wraps from first to last)", async () => {
    render(
      <MobileDrawer open onClose={vi.fn()}>
        <button>first</button>
        <button>last</button>
      </MobileDrawer>,
    );
    const first = screen.getByText("first");
    first.focus();
    expect(first).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(screen.getByText("last")).toHaveFocus();
  });

  it("dialog panel has fixed width for slide-over", () => {
    render(
      <MobileDrawer open onClose={vi.fn()}>
        <div>content</div>
      </MobileDrawer>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toMatch(/w-\[280px\]|w-72/);
  });
});
