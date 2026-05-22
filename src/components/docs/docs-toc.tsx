"use client";

import { useEffect, useRef, useState } from "react";
import { MDX_CONTENT_SELECTOR } from "./constants";
import { cn } from "@/lib/cn";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface Props {
  /** Override default selector; primarily used for tests. */
  selector?: string;
}

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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(tocItems);

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
      <p className="mb-2 text-[11px] font-semibold tracking-wider text-foreground-subtle uppercase">
        Trên trang
      </p>
      <ul className="space-y-0.5 border-l border-border">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ml-3" : ""}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block -ml-px border-l py-1 pl-3 text-[13px] transition-colors",
                activeId === item.id
                  ? "border-accent font-medium text-accent"
                  : "border-transparent text-foreground-muted hover:text-foreground",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
