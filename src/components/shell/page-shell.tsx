import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Reserve right margin for floating TOC on 2xl breakpoint */
  withToc?: boolean;
  /** Override container width — default max-w-6xl */
  width?: "default" | "wide";
}

export function PageShell({
  children,
  withToc = false,
  width = "default",
}: Props) {
  const maxW = width === "wide" ? "max-w-7xl" : "max-w-6xl";
  const tocReserve = withToc ? "2xl:max-w-none 2xl:pr-72" : "";
  return (
    <div className={`relative mx-auto ${maxW} px-6 py-8 lg:px-8 ${tocReserve}`}>
      {children}
    </div>
  );
}
