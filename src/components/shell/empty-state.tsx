import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ message, icon, action, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border bg-surface px-6 py-12 text-center",
        className,
      )}
      role="status"
    >
      {icon && (
        <div className="text-foreground-subtle [&_svg]:size-8" aria-hidden>
          {icon}
        </div>
      )}
      <p className="text-body text-foreground-muted">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
