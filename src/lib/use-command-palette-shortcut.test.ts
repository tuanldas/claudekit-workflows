import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCommandPaletteShortcut } from "./use-command-palette-shortcut";

afterEach(() => {
  document.body.innerHTML = "";
});

function fireKeydown(init: KeyboardEventInit & { target?: EventTarget }) {
  const ev = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
  if (init.target) {
    init.target.dispatchEvent(ev);
  } else {
    window.dispatchEvent(ev);
  }
  return ev;
}

describe("useCommandPaletteShortcut", () => {
  it("invokes toggle on Cmd+K", () => {
    const toggle = vi.fn();
    renderHook(() => useCommandPaletteShortcut(toggle));
    const ev = fireKeydown({ key: "k", metaKey: true });
    expect(toggle).toHaveBeenCalledTimes(1);
    expect(ev.defaultPrevented).toBe(true);
  });

  it("invokes toggle on Ctrl+K", () => {
    const toggle = vi.fn();
    renderHook(() => useCommandPaletteShortcut(toggle));
    fireKeydown({ key: "k", ctrlKey: true });
    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it("ignores plain 'k'", () => {
    const toggle = vi.fn();
    renderHook(() => useCommandPaletteShortcut(toggle));
    fireKeydown({ key: "k" });
    expect(toggle).not.toHaveBeenCalled();
  });

  it("skips when an INPUT is focused", () => {
    const toggle = vi.fn();
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    renderHook(() => useCommandPaletteShortcut(toggle));
    fireKeydown({ key: "k", metaKey: true, target: input });
    expect(toggle).not.toHaveBeenCalled();
  });

  it("skips when a TEXTAREA is focused", () => {
    const toggle = vi.fn();
    const ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.focus();
    renderHook(() => useCommandPaletteShortcut(toggle));
    fireKeydown({ key: "k", metaKey: true, target: ta });
    expect(toggle).not.toHaveBeenCalled();
  });

  it("skips when a contenteditable element is focused", () => {
    const toggle = vi.fn();
    const div = document.createElement("div");
    div.setAttribute("contenteditable", "true");
    document.body.appendChild(div);
    div.focus();
    renderHook(() => useCommandPaletteShortcut(toggle));
    fireKeydown({ key: "k", metaKey: true, target: div });
    expect(toggle).not.toHaveBeenCalled();
  });

  it("detaches listener on unmount", () => {
    const toggle = vi.fn();
    const { unmount } = renderHook(() => useCommandPaletteShortcut(toggle));
    unmount();
    fireKeydown({ key: "k", metaKey: true });
    expect(toggle).not.toHaveBeenCalled();
  });
});
