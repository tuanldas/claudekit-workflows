import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Icon rendered inside the input on the left (e.g. search glyph). */
  leadingIcon?: ReactNode;
  /** Icon/element rendered inside the input on the right (e.g. clear button). */
  trailingIcon?: ReactNode;
  /** Wrapper className — applies to outer container that holds icons + input. */
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leadingIcon, trailingIcon, className, wrapperClassName, type = "text", ...rest },
  ref,
) {
  return (
    <div
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm transition-colors",
        "focus-within:border-accent focus-within:ring-2 focus-within:ring-[var(--color-accent-ring)]",
        wrapperClassName,
      )}
    >
      {leadingIcon && (
        <span
          className="shrink-0 text-foreground-subtle [&_svg]:size-4"
          aria-hidden="true"
        >
          {leadingIcon}
        </span>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-foreground placeholder:text-foreground-subtle outline-none",
          className,
        )}
        {...rest}
      />
      {trailingIcon && (
        <span
          className="shrink-0 text-foreground-subtle [&_svg]:size-4"
          aria-hidden="true"
        >
          {trailingIcon}
        </span>
      )}
    </div>
  );
});
