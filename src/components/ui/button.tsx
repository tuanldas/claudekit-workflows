import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "accent" | "default" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  accent:
    "bg-accent text-accent-foreground hover:bg-accent-hover active:bg-accent-active",
  default:
    "bg-surface text-foreground border border-border hover:bg-surface-hover",
  ghost: "text-foreground hover:bg-surface-hover",
  outline:
    "border border-border text-foreground bg-transparent hover:bg-surface-hover",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizeClass: Record<Size, string> = {
  sm: "h-7 px-2.5 text-xs gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-9 px-3.5 text-sm gap-2 rounded-[var(--radius-md)]",
  lg: "h-10 px-4 text-sm gap-2 rounded-[var(--radius-md)]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "default",
    size = "md",
    leadingIcon,
    trailingIcon,
    className,
    children,
    type = "button",
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
        "disabled:opacity-50 disabled:pointer-events-none",
        "cursor-pointer touch-manipulation",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {leadingIcon && (
        <span className="shrink-0 [&_svg]:size-4" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
      {trailingIcon && (
        <span className="shrink-0 [&_svg]:size-4" aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  );
});
