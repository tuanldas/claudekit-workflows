import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, act, cleanup } from "@testing-library/react";
import { useSidebarScroll } from "./use-sidebar-scroll";
import type { RefObject } from "react";

function Probe({
  sectionKey,
  outRef,
  scrollHeight = 1000,
  clientHeight = 400,
}: {
  sectionKey: string;
  outRef: { current: HTMLDivElement | null };
  scrollHeight?: number;
  clientHeight?: number;
}) {
  const hookRef = useSidebarScroll(
    sectionKey,
  ) as RefObject<HTMLDivElement | null>;
  const assign = (node: HTMLDivElement | null) => {
    hookRef.current = node;
    outRef.current = node;
    if (node) {
      Object.defineProperty(node, "scrollHeight", {
        configurable: true,
        value: scrollHeight,
      });
      Object.defineProperty(node, "clientHeight", {
        configurable: true,
        value: clientHeight,
      });
    }
  };
  return (
    <div
      ref={assign}
      data-testid="scroll-container"
      style={{ height: clientHeight, overflowY: "auto" }}
    />
  );
}

describe("useSidebarScroll", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("restores scrollTop from sessionStorage on mount (before paint)", () => {
    sessionStorage.setItem("sidebar-scroll:docs", "300");
    const outRef = { current: null as HTMLDivElement | null };
    render(<Probe sectionKey="docs" outRef={outRef} />);
    expect(outRef.current?.scrollTop).toBe(300);
  });

  it("does not change scrollTop when no stored value", () => {
    const outRef = { current: null as HTMLDivElement | null };
    render(<Probe sectionKey="docs" outRef={outRef} />);
    expect(outRef.current?.scrollTop).toBe(0);
  });

  it("saves scroll position to sessionStorage after debounce", () => {
    const outRef = { current: null as HTMLDivElement | null };
    render(<Probe sectionKey="workflows" outRef={outRef} />);
    const el = outRef.current!;
    el.scrollTop = 175;
    act(() => {
      el.dispatchEvent(new Event("scroll"));
    });
    expect(sessionStorage.getItem("sidebar-scroll:workflows")).toBeNull();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(sessionStorage.getItem("sidebar-scroll:workflows")).toBe("175");
  });

  it("debounces multiple scroll events into single save", () => {
    const outRef = { current: null as HTMLDivElement | null };
    render(<Probe sectionKey="workflows" outRef={outRef} />);
    const el = outRef.current!;

    el.scrollTop = 50;
    act(() => el.dispatchEvent(new Event("scroll")));
    el.scrollTop = 100;
    act(() => el.dispatchEvent(new Event("scroll")));
    el.scrollTop = 150;
    act(() => el.dispatchEvent(new Event("scroll")));

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(sessionStorage.getItem("sidebar-scroll:workflows")).toBe("150");
  });

  it("performs final save on unmount", () => {
    const outRef = { current: null as HTMLDivElement | null };
    const { unmount } = render(<Probe sectionKey="docs" outRef={outRef} />);
    const el = outRef.current!;
    el.scrollTop = 420;
    unmount();
    expect(sessionStorage.getItem("sidebar-scroll:docs")).toBe("420");
  });

  it("isolates memory per section key", () => {
    sessionStorage.setItem("sidebar-scroll:docs", "300");
    const docsRef = { current: null as HTMLDivElement | null };
    const { unmount: unmountDocs } = render(
      <Probe sectionKey="docs" outRef={docsRef} />,
    );
    expect(docsRef.current?.scrollTop).toBe(300);
    unmountDocs();

    const skillsRef = { current: null as HTMLDivElement | null };
    render(<Probe sectionKey="skills" outRef={skillsRef} />);
    expect(skillsRef.current?.scrollTop).toBe(0);
  });

  it("removes scroll listener on unmount", () => {
    const outRef = { current: null as HTMLDivElement | null };
    const { unmount } = render(<Probe sectionKey="docs" outRef={outRef} />);
    const el = outRef.current!;
    const removeSpy = vi.spyOn(el, "removeEventListener");
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("returns a stable ref object across renders", () => {
    const outRef = { current: null as HTMLDivElement | null };
    const { rerender } = render(<Probe sectionKey="docs" outRef={outRef} />);
    const first = outRef.current;
    rerender(<Probe sectionKey="docs" outRef={outRef} />);
    expect(outRef.current).toBe(first);
  });
});
