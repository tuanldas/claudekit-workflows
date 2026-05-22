import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  /** Search slot — typically a SearchBar or Input. */
  search?: ReactNode;
  /** Filter slot — typically a FilterSelect or button group. */
  filter?: ReactNode;
  /** Right-side count / status text (e.g. "39 workflows"). */
  count?: ReactNode;
  className?: string;
}

export function PageToolbar({ search, filter, count, className }: Props) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        {search && <div className="sm:max-w-sm sm:flex-1">{search}</div>}
        {filter}
      </div>
      {count && (
        <p className="text-caption text-foreground-muted">{count}</p>
      )}
    </div>
  );
}
