"use client";

import { useEffect, useState, type ReactNode } from "react";

interface Props {
  trigger: (open: () => void) => ReactNode;
  children: (close: () => void) => ReactNode;
  label?: string;
}

/**
 * Generic mobile drawer: slide-in panel từ trái, overlay, tap outside để
 * close, ESC để close, focus trap minimum. Used cho sidebar trên mobile.
 */
export function MobileDrawer({ trigger, children, label = "Navigation" }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {trigger(() => setOpen(true))}
      {open && (
        <div
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex-1 bg-black/40"
          />
          <aside className="flex h-full w-[80%] max-w-xs flex-col overflow-y-auto bg-white shadow-xl [overscroll-behavior:contain] motion-safe:-translate-x-full motion-safe:animate-[slideIn_200ms_ease-out_forwards]">
            {/*
              motion-safe: start off-screen (-translate-x-full) + slide in via keyframes
              motion-reduce default: no transform → drawer renders in place immediately
            */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <span className="font-semibold">{label}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="touch-manipulation rounded p-1 text-gray-500 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-1 focus-visible:outline-none"
              >
                ✕
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto p-4 [overscroll-behavior:contain]"
              onClick={(e) => {
                // Auto-close when user click anchor (navigation)
                if ((e.target as HTMLElement).closest("a")) setOpen(false);
              }}
            >
              {children(() => setOpen(false))}
            </div>
          </aside>
        </div>
      )}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
