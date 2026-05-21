"use client";

import { useEffect, useRef, useState } from "react";
import { MDX_CONTENT_SELECTOR } from "./constants";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  /** Override default selector; primarily used for tests. */
  selector?: string;
}

/**
 * TOC client component. Extracts headings from rendered article AFTER mount —
 * KHÔNG đọc DOM trong render (gây hydration mismatch). useEffect runs after
 * hydration, setItems triggers re-render với populated nav.
 *
 * NOTE: setState is intentional here (not anti-pattern). This is the canonical
 * pattern for post-mount DOM extraction. It ensures server + client first
 * render emit identical HTML (empty TOC), then useEffect populates after
 * hydration completes.
 */
export function DocsToc({ selector = MDX_CONTENT_SELECTOR }: Props) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const article = document.querySelector(selector);
    if (!article) return;

    const headings = Array.from(article.querySelectorAll("h2, h3"));
    const tocItems = headings
      .filter((h) => h.id)
      .map((h) => ({
        id: h.id,
        text: h.textContent?.trim() ?? "",
        level: Number(h.tagName[1]),
      }));

    // Single computed setState call — hydration-safe pattern
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(tocItems);

    // IntersectionObserver setup happens after setItems
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    headings.forEach((h) => observerRef.current?.observe(h));
    return () => observerRef.current?.disconnect();
  }, [selector]);

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
