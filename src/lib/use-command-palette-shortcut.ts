"use client";

import { useEffect } from "react";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

/**
 * Global Cmd+K / Ctrl+K listener.
 * Skips when a text input / contenteditable is focused so users can still
 * type characters that contain "k" in form fields.
 */
export function useCommandPaletteShortcut(onTrigger: () => void): void {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key !== "k" && e.key !== "K") return;
      if (!e.metaKey && !e.ctrlKey) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      onTrigger();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onTrigger]);
}
