"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface MobileDrawerContextValue {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const MobileDrawerContext = createContext<MobileDrawerContextValue | null>(
  null,
);

export function MobileDrawerProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <MobileDrawerStateProvider key={pathname ?? ""}>
      {children}
    </MobileDrawerStateProvider>
  );
}

function MobileDrawerStateProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openDrawer, closeDrawer }),
    [open, openDrawer, closeDrawer],
  );

  return (
    <MobileDrawerContext.Provider value={value}>
      {children}
    </MobileDrawerContext.Provider>
  );
}

export function useMobileDrawer() {
  const ctx = useContext(MobileDrawerContext);
  if (!ctx) {
    throw new Error(
      "useMobileDrawer must be used inside MobileDrawerProvider",
    );
  }
  return ctx;
}
