import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant =
  | "default"
  | "accent"
  | "outline"
  | "success"
  | "warning"
  | "danger";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  default: "bg-surface text-foreground-muted border border-border",
  accent:
    "bg-accent-subtle text-accent border border-accent-border",
  outline: "bg-transparent text-foreground-muted border border-border",
  success:
    "bg-success-subtle text-success border border-success/40",
  warning:
    "bg-warning-subtle text-warning border border-warning/40",
  danger:
    "bg-danger-subtle text-danger border border-danger/40",
};

const sizeClass: Record<Size, string> = {
  sm: "h-5 px-1.5 text-[11px] gap-1 rounded-[var(--radius-sm)]",
  md: "h-6 px-2 text-xs gap-1.5 rounded-[var(--radius-sm)]",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
}

export function Badge({
  variant = "default",
  size = "md",
  leadingIcon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium tracking-wide whitespace-nowrap",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {leadingIcon && (
        <span aria-hidden="true" className="[&_svg]:size-3">
          {leadingIcon}
        </span>
      )}
      {children}
    </span>
  );
}
