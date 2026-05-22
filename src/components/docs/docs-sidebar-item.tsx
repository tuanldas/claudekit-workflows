"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types/workflow";
import { cn } from "@/lib/cn";

interface Props {
  slug: string;
  navTitle: string;
  locale: Locale;
  onNavigate?: () => void;
}

export function DocsSidebarItem({ slug, navTitle, locale, onNavigate }: Props) {
  const pathname = usePathname();
  const href = `/${locale}/docs/${slug}`;
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "block touch-manipulation rounded-[var(--radius-sm)] px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)]",
          isActive
            ? "bg-accent-subtle font-medium text-accent"
            : "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
        )}
      >
        {navTitle}
      </Link>
    </li>
  );
}
