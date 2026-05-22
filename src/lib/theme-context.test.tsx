import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./theme-context";
import type { ReactNode } from "react";

const STORAGE_KEY = "claudekit-theme";

function setMatchMedia(matches: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const mql = {
    matches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: vi.fn((_: string, h: (e: MediaQueryListEvent) => void) =>
      listeners.add(h),
    ),
    removeEventListener: vi.fn(
      (_: string, h: (e: MediaQueryListEvent) => void) => listeners.delete(h),
    ),
    dispatchEvent: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  };
  window.matchMedia = vi.fn().mockReturnValue(mql);
  return {
    mql,
    fire: (m: boolean) =>
      listeners.forEach((h) => h({ matches: m } as MediaQueryListEvent)),
  };
}

function wrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("ThemeProvider + useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    setMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when used outside provider", () => {
    const original = console.error;
    console.error = vi.fn();
    expect(() => renderHook(() => useTheme())).toThrow(
      /useTheme.*ThemeProvider/i,
    );
    console.error = original;
  });

  it("defaults to system theme on first mount (no storage)", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe("system");
  });

  it("hydrates from localStorage value on mount", () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe("dark");
  });

  it("setTheme persists to localStorage", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setTheme("dark"));
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
    expect(result.current.theme).toBe("dark");
  });

  it("resolvedTheme is light when explicit theme=light", () => {
    localStorage.setItem(STORAGE_KEY, "light");
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.resolvedTheme).toBe("light");
  });

  it("resolvedTheme is dark when explicit theme=dark", () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("resolvedTheme follows matchMedia when theme=system", () => {
    setMatchMedia(true);
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe("system");
    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("toggles html.dark class when resolved dark", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setTheme("dark"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes html.dark class when resolved light", () => {
    document.documentElement.classList.add("dark");
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setTheme("light"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("system mode updates resolvedTheme on matchMedia change event", () => {
    const { fire } = setMatchMedia(false);
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.resolvedTheme).toBe("light");
    act(() => fire(true));
    expect(result.current.resolvedTheme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("ignores matchMedia change event when explicit theme=light", () => {
    const { fire } = setMatchMedia(false);
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setTheme("light"));
    act(() => fire(true));
    expect(result.current.resolvedTheme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
