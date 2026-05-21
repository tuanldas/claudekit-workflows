"use client";

import { useEffect, useState, useMemo } from "react";
import { MDX_CONTENT_SELECTOR } from "./constants";

interface Props {
  /** Override default selector; primarily used for tests. */
  selector?: string;
}

export function DocsToc({ selector = MDX_CONTENT_SELECTOR }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Extract and memoize TOC items synchronously (no setState in effect)
  const items = useMemo(() => {
    if (typeof document === "undefined") return [];
    const article = document.querySelector(selector);
    if (!article) return [];
    const headings = Array.from(article.querySelectorAll("h2, h3"));
    return headings
      .filter((h) => h.id)
      .map((h) => ({
        id: h.id,
        text: h.textContent?.trim() ?? "",
        level: Number(h.tagName[1]),
      }));
  }, [selector]);

  // Separate effect for IntersectionObserver
  useEffect(() => {
    if (items.length === 0) return;
    const article = document.querySelector(selector);
    if (!article) return;
    const headings = Array.from(article.querySelectorAll("h2, h3"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [selector, items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-2 font-semibold text-gray-900">Trên trang</p>
      <ul className="space-y-1 border-l border-gray-200">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ml-3" : ""}>
            <a
              href={`#${item.id}`}
              className={`block border-l-2 py-0.5 pl-3 transition-colors ${
                activeId === item.id
                  ? "border-orange-500 font-medium text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
