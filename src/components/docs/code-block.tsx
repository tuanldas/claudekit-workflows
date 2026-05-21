"use client";

import { useRef, useState } from "react";

/**
 * MDX `<pre>` override với copy button overlay. Shiki rehype plugin sản
 * sinh `<pre><code class="language-X">...</code></pre>` markup; wrapper này
 * preserve token styling đồng thời thêm copy affordance.
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
        {...props}
        className={`overflow-x-auto rounded-lg p-4 text-sm ${props.className ?? ""}`}
      />
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-2 right-2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
      >
        {copied ? "Đã copy" : "Copy"}
      </button>
    </div>
  );
}
