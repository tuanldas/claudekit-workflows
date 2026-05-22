"use client";

import { useRef, useState } from "react";

/**
 * MDX `<pre>` override with copy button overlay. Shiki rehype plugin emits
 * `<pre><code class="language-X">...</code></pre>`; this wrapper preserves
 * token styling while adding a copy affordance.
 */
export function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = ref.current?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore — older browsers, secure context missing
    }
  }

  return (
    <div className="group relative my-4">
      <pre
        ref={ref}
        translate="no"
        {...props}
        className={`overflow-x-auto rounded-[var(--radius-md)] border border-border p-4 text-[13px] leading-relaxed ${props.className ?? ""}`}
      />
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-2 right-2 cursor-pointer rounded-[var(--radius-sm)] border border-border bg-surface-elevated px-2 py-1 text-[11px] font-medium text-foreground-muted opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)]"
      >
        {copied ? "Đã copy" : "Copy"}
      </button>
    </div>
  );
}
