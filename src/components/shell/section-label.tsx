import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: Props) {
  return (
    <h3
      className={cn(
        "mt-5 mb-3 text-micro font-semibold tracking-wider text-foreground-subtle uppercase",
        className,
      )}
    >
      {children}
    </h3>
  );
}
