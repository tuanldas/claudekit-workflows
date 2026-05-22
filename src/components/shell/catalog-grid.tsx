import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type GridDensity = "cards" | "tight";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * `cards` (default): 1 / 2 / 3 columns (sm/md/lg). Used by Workflows.
   * `tight`: 1 / 2 / 3 / 4 columns (sm/md/lg/xl). Used by Skills (denser catalog).
   */
  density?: GridDensity;
}

const densityClass: Record<GridDensity, string> = {
  cards: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
  tight: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function CatalogGrid({
  children,
  density = "cards",
  className,
  ...rest
}: Props) {
  return (
    <div className={cn(densityClass[density], className)} {...rest}>
      {children}
    </div>
  );
}
