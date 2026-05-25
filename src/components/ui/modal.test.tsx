import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "./modal";
import { __resetBodyScrollLockForTests } from "@/lib/body-scroll-lock";

describe("Modal", () => {
  beforeEach(() => {
    __resetBodyScrollLockForTests();
    document.body.style.overflow = "";
  });

  it("renders nothing when open=false", () => {
    render(
      <Modal open={false} onClose={() => {}} label="Test">
        <p>content</p>
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("content")).not.toBeInTheDocument();
  });

  it("renders dialog with content when open=true", () => {
    render(
      <Modal open onClose={() => {}} label="Workflow detail">
        <p>content</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { name: /workflow detail/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("calls onClose on Escape keydown", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} label="X">
        <p>x</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open onClose={onClose} label="X">
        <p>x</p>
      </Modal>,
    );
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does NOT call onClose when dialog content is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} label="X">
        <p>inner</p>
      </Modal>,
    );
    fireEvent.click(screen.getByText("inner"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("locks body scroll while open and restores on close", () => {
    const { rerender } = render(
      <Modal open onClose={() => {}} label="X">
        <p>x</p>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    rerender(
      <Modal open={false} onClose={() => {}} label="X">
        <p>x</p>
      </Modal>,
    );
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("applies size class (default xl => max-w-6xl)", () => {
    const { rerender } = render(
      <Modal open onClose={() => {}} label="X">
        <p>x</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog").className).toMatch(/max-w-6xl/);
    rerender(
      <Modal open onClose={() => {}} label="X" size="md">
        <p>x</p>
      </Modal>,
    );
    expect(screen.getByRole("dialog").className).toMatch(/max-w-2xl/);
  });
});
