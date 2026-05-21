"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types/workflow";

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
        className={`block touch-manipulation rounded px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:outline-none ${
          isActive
            ? "bg-orange-50 font-medium text-orange-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        {navTitle}
      </Link>
    </li>
  );
}
