import {
  forwardRef,
  type ChangeEvent,
  type SelectHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

export interface FilterSelectOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: FilterSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
}

export const FilterSelect = forwardRef<HTMLSelectElement, FilterSelectProps>(
  function FilterSelect(
    { options, value, onValueChange, className, ...rest },
    ref,
  ) {
    return (
      <select
        ref={ref}
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onValueChange(e.target.value)
        }
        className={cn(
          "h-9 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-body text-foreground transition-colors",
          "focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-ring)]",
          className,
        )}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.count !== undefined ? `${opt.label} (${opt.count})` : opt.label}
          </option>
        ))}
      </select>
    );
  },
);
