import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  /** Right-aligned actions (search, filter, buttons). Hidden if empty. */
  actions?: ReactNode;
  /** Optional eyebrow text above title (group label, breadcrumb fragment) */
  eyebrow?: string;
}

export function PageHeader({ title, description, actions, eyebrow }: Props) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold tracking-wider text-accent uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-foreground-muted">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}
