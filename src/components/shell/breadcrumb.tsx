"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/types/workflow";
import { uiStrings } from "@/i18n/translations";

type Segment = { label: string; href?: string };

function buildSegments(pathname: string, locale: Locale): Segment[] {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [];
  const localeParts = parts.slice(1);
  if (localeParts.length === 0) {
    return [{ label: uiStrings.breadcrumb.home[locale] }];
  }

  const root = localeParts[0];
  const segments: Segment[] = [];

  if (root === "workflows") {
    segments.push({ label: uiStrings.breadcrumb.workflows[locale] });
  } else if (root === "docs") {
    segments.push({
      label: uiStrings.breadcrumb.docs[locale],
      href: `/${locale}/docs`,
    });
    for (let i = 1; i < localeParts.length; i++) {
      const href =
        i === localeParts.length - 1
          ? undefined
          : `/${locale}/${localeParts.slice(0, i + 1).join("/")}`;
      segments.push({ label: localeParts[i], href });
    }
  } else if (root === "skills") {
    segments.push({
      label: uiStrings.breadcrumb.skills[locale],
      href: `/${locale}/skills`,
    });
    for (let i = 1; i < localeParts.length; i++) {
      const href =
        i === localeParts.length - 1
          ? undefined
          : `/${locale}/${localeParts.slice(0, i + 1).join("/")}`;
      segments.push({ label: localeParts[i], href });
    }
  } else {
    segments.push({ label: root });
  }

  return segments;
}

export function Breadcrumb({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "";
  const segments = buildSegments(pathname, locale);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
      <ol className="flex items-center gap-2 text-sm text-gray-500">
        {segments.length === 0 && (
          <li className="text-gray-400">
            {uiStrings.breadcrumb.home[locale]}
          </li>
        )}
        {segments.map((seg, idx) => (
          <li key={`${seg.label}-${idx}`} className="flex items-center gap-2">
            {idx > 0 && <span aria-hidden className="text-gray-300">/</span>}
            {seg.href ? (
              <Link
                href={seg.href}
                className="truncate hover:text-gray-900"
              >
                {seg.label}
              </Link>
            ) : (
              <span
                aria-current={idx === segments.length - 1 ? "page" : undefined}
                className="truncate font-medium text-gray-900"
              >
                {seg.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
