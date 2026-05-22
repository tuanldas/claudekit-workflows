import { describe, it, expect, vi } from "vitest";
import { renderHook, act, render } from "@testing-library/react";
import {
  CommandPaletteProvider,
  useCommandPalette,
} from "./command-palette-context";

function wrapper({ children }: { children: React.ReactNode }) {
  return <CommandPaletteProvider>{children}</CommandPaletteProvider>;
}

describe("CommandPaletteProvider + useCommandPalette", () => {
  it("starts closed with empty query", () => {
    const { result } = renderHook(() => useCommandPalette(), { wrapper });
    expect(result.current.open).toBe(false);
    expect(result.current.query).toBe("");
  });

  it("opens via openPalette", () => {
    const { result } = renderHook(() => useCommandPalette(), { wrapper });
    act(() => result.current.openPalette());
    expect(result.current.open).toBe(true);
  });

  it("closes via closePalette and resets query", () => {
    const { result } = renderHook(() => useCommandPalette(), { wrapper });
    act(() => {
      result.current.openPalette();
      result.current.setQuery("plan");
    });
    expect(result.current.query).toBe("plan");
    act(() => result.current.closePalette());
    expect(result.current.open).toBe(false);
    expect(result.current.query).toBe("");
  });

  it("togglePalette flips open state", () => {
    const { result } = renderHook(() => useCommandPalette(), { wrapper });
    act(() => result.current.togglePalette());
    expect(result.current.open).toBe(true);
    act(() => result.current.togglePalette());
    expect(result.current.open).toBe(false);
  });

  it("Cmd+K toggles palette state", () => {
    const { result } = renderHook(() => useCommandPalette(), { wrapper });
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k", metaKey: true }),
      );
    });
    expect(result.current.open).toBe(true);
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k", metaKey: true }),
      );
    });
    expect(result.current.open).toBe(false);
  });

  it("setQuery updates query value", () => {
    const { result } = renderHook(() => useCommandPalette(), { wrapper });
    act(() => result.current.setQuery("hello"));
    expect(result.current.query).toBe("hello");
  });

  it("throws when used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function ConsumerOutsideProvider() {
      useCommandPalette();
      return null;
    }
    expect(() => render(<ConsumerOutsideProvider />)).toThrow(
      /CommandPaletteProvider/i,
    );
    spy.mockRestore();
  });
});
