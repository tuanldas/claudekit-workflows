import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  /** Small uppercase label above the title (group, category). */
  eyebrow?: string;
  /** Main heading. Omit when the surrounding article already owns an H1. */
  title?: string;
  /** Optional supporting paragraph below the title. */
  description?: string;
  /** Metadata strip — badges, duration, level. Sits between description and actions. */
  meta?: ReactNode;
  /** Right-aligned actions slot (e.g. close button). */
  actions?: ReactNode;
  className?: string;
}

export function DetailHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
  className,
}: Props) {
  return (
    <header
      className={cn(
        "flex items-start justify-between gap-4",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <p className="mb-1 text-micro font-semibold tracking-wider text-accent uppercase">
            {eyebrow}
          </p>
        )}
        {title && (
          <h1 className="text-h1 font-semibold tracking-tight text-foreground">
            {title}
          </h1>
        )}
        {description && (
          <p className="mt-2 max-w-2xl text-body text-foreground-muted">
            {description}
          </p>
        )}
        {meta && (
          <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
