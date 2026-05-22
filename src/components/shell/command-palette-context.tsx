"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCommandPaletteShortcut } from "@/lib/use-command-palette-shortcut";

interface CommandPaletteContextValue {
  open: boolean;
  query: string;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  setQuery: (q: string) => void;
}

const CommandPaletteContext =
  createContext<CommandPaletteContextValue | null>(null);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const openPalette = useCallback(() => setOpen(true), []);
  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);
  const togglePalette = useCallback(() => setOpen((o) => !o), []);

  useCommandPaletteShortcut(togglePalette);

  const value = useMemo(
    () => ({
      open,
      query,
      openPalette,
      closePalette,
      togglePalette,
      setQuery,
    }),
    [open, query, openPalette, closePalette, togglePalette],
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error(
      "useCommandPalette must be used inside CommandPaletteProvider",
    );
  }
  return ctx;
}
