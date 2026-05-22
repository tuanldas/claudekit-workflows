import { describe, it, expect, vi } from "vitest";
import { renderHook, act, render } from "@testing-library/react";
import {
  MobileDrawerProvider,
  useMobileDrawer,
} from "./mobile-drawer-context";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/vi/workflows"),
}));

describe("MobileDrawerProvider + useMobileDrawer", () => {
  it("starts closed by default", () => {
    const { result } = renderHook(() => useMobileDrawer(), {
      wrapper: ({ children }) => (
        <MobileDrawerProvider>{children}</MobileDrawerProvider>
      ),
    });
    expect(result.current.open).toBe(false);
  });

  it("opens via openDrawer", () => {
    const { result } = renderHook(() => useMobileDrawer(), {
      wrapper: ({ children }) => (
        <MobileDrawerProvider>{children}</MobileDrawerProvider>
      ),
    });
    act(() => result.current.openDrawer());
    expect(result.current.open).toBe(true);
  });

  it("closes via closeDrawer", () => {
    const { result } = renderHook(() => useMobileDrawer(), {
      wrapper: ({ children }) => (
        <MobileDrawerProvider>{children}</MobileDrawerProvider>
      ),
    });
    act(() => result.current.openDrawer());
    act(() => result.current.closeDrawer());
    expect(result.current.open).toBe(false);
  });

  it("throws if used outside provider", () => {
    // Suppress error noise in test output
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      render(<ReadDrawerStateOutsideProvider />);
    }).toThrow(/MobileDrawerProvider/i);
    spy.mockRestore();
  });
});

function ReadDrawerStateOutsideProvider() {
  useMobileDrawer();
  return null;
}
