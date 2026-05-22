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
    <header className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-gray-800">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-xs font-medium tracking-wider text-orange-600 uppercase dark:text-orange-400">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
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
