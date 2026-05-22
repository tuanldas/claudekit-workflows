import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  /** Header content — pass a DetailHeader composition. */
  header: ReactNode;
  /** Left column body — info, phases, tips. */
  leftContent: ReactNode;
  /** Right column body — typically a canvas / visualization. */
  rightContent: ReactNode;
  /** Optional close button rendered absolutely top-right of the right column. */
  closeButton?: ReactNode;
  /** Optional close button rendered next to header on mobile (lg:hidden). */
  mobileCloseButton?: ReactNode;
  className?: string;
}

export function DetailInlineTemplate({
  header,
  leftContent,
  rightContent,
  closeButton,
  mobileCloseButton,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)] border border-accent bg-background",
        className,
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b border-border lg:border-r lg:border-b-0">
          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">{header}</div>
              {mobileCloseButton && (
                <div className="lg:hidden">{mobileCloseButton}</div>
              )}
            </div>
            {leftContent}
          </div>
        </div>
        <div className="relative bg-surface p-4">
          {closeButton && (
            <div className="absolute top-3 right-3 z-10 hidden lg:flex">
              {closeButton}
            </div>
          )}
          {rightContent}
        </div>
      </div>
    </div>
  );
}
