import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  children: ReactNode;
  /**
   * Reserve right margin for floating TOC. Kept as a flag for backward
   * compatibility; floating TOC now positions itself outside the content flow
   * (only visible on very wide viewports), so this prop is a no-op for width.
   */
  withToc?: boolean;
  /** Override container width — default max-w-6xl */
  width?: "default" | "wide";
}

export function PageShell({ children, width = "default" }: Props) {
  const maxW = width === "wide" ? "max-w-7xl" : "max-w-6xl";
  return (
    <div className={cn("relative mx-auto px-6 py-8 lg:px-8", maxW)}>
      {children}
    </div>
  );
}
