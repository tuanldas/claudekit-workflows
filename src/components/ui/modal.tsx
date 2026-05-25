"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/body-scroll-lock";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible label for the dialog. */
  label: string;
  children: ReactNode;
  /** Dialog max-width. Default `6xl` (≈1152px). */
  size?: "md" | "lg" | "xl";
  /** Optional className passed to the dialog box. */
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<ModalProps["size"]>, string> = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export function Modal({
  open,
  onClose,
  label,
  children,
  size = "xl",
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    lockBodyScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      unlockBodyScroll();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn(
          "relative w-full max-h-[85vh] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-background shadow-2xl focus:outline-none",
          SIZE_CLASS[size],
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
