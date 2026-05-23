import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/lib/cn";

type CardElement = "div" | "button" | "a";

type CardOwnProps = {
  /** Add hover state — useful for clickable cards. */
  interactive?: boolean;
  /** Apply accent-themed border + subtle bg (e.g. selected state). */
  selected?: boolean;
  children?: ReactNode;
  className?: string;
};

export type CardProps<T extends CardElement = "div"> = CardOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps | "as">;

type CardRef<T extends CardElement> = T extends "button"
  ? HTMLButtonElement
  : T extends "a"
    ? HTMLAnchorElement
    : HTMLDivElement;

function CardInner<T extends CardElement = "div">(
  { as, interactive, selected, className, children, ...rest }: CardProps<T>,
  ref: ForwardedRef<CardRef<T>>,
) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={cn(
        "rounded-[var(--radius-lg)] border bg-background transition-colors",
        selected ? "border-accent bg-accent-subtle" : "border-border",
        interactive &&
          !selected &&
          "hover:bg-surface-hover hover:border-border-strong",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

export const Card = forwardRef(CardInner) as <T extends CardElement = "div">(
  props: CardProps<T> & { ref?: ForwardedRef<CardRef<T>> },
) => ReactElement | null;

export function CardHeader({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 border-b border-border px-4 py-3",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-border px-4 py-3",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
