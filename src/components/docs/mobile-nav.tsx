"use client";

import { MobileDrawer } from "./mobile-drawer";
import type { ReactNode } from "react";

interface Props {
  sidebar: ReactNode;
}

/**
 * Mobile-only top bar với hamburger button → opens drawer chứa sidebar.
 * Visible <1024px, hidden trên desktop.
 */
export function MobileNav({ sidebar }: Props) {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
      <MobileDrawer
        label="Docs"
        trigger={(open) => (
          <button
            type="button"
            onClick={open}
            aria-label="Open docs menu"
            className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded text-gray-700 hover:bg-gray-100"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
      >
        {() => sidebar}
      </MobileDrawer>
      <span className="text-sm font-medium text-gray-900">Docs</span>
    </div>
  );
}
