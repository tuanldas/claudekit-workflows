import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Keyboard shortcut chip — e.g. <Kbd>⌘</Kbd><Kbd>K</Kbd>. */
export function Kbd({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface px-1.5 font-mono text-[11px] font-medium text-foreground-muted",
        className,
      )}
      {...rest}
    >
      {children}
    </kbd>
  );
}
