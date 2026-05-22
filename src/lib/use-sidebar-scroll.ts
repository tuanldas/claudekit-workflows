"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import { getSidebarScroll, saveSidebarScroll } from "./sidebar-scroll-storage";

const DEBOUNCE_MS = 200;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useSidebarScroll<T extends HTMLElement = HTMLDivElement>(
  sectionKey: string,
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const saved = getSidebarScroll(sectionKey);
    if (saved > 0) el.scrollTop = saved;
  }, [sectionKey]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        saveSidebarScroll(sectionKey, el.scrollTop);
      }, DEBOUNCE_MS);
    };

    el.addEventListener("scroll", handler, { passive: true });
    return () => {
      el.removeEventListener("scroll", handler);
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = null;
      }
      saveSidebarScroll(sectionKey, el.scrollTop);
    };
  }, [sectionKey]);

  return ref;
}
