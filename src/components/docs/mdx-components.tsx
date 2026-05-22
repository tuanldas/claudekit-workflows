import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./code-block";

/**
 * Custom MDX component overrides. Headings get base styling; tables get
 * border + padding; anchor links inherit prose colors. `pre` wrapped trong
 * CodeBlock cho copy button affordance.
 */
export const docsMDXComponents: MDXComponents = {
  pre: CodeBlock,
  h1: (props) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight" {...props} />
  ),
  h2: (props) => (
    <h2
      className="mt-8 mb-3 border-b border-gray-200 pb-2 text-2xl font-semibold"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-6 mb-2 text-xl font-semibold" {...props} />
  ),
  h4: (props) => <h4 className="mt-4 mb-2 text-lg font-semibold" {...props} />,
  table: (props) => (
    // tabIndex=0 makes the horizontal-scroll wrapper keyboard-accessible
    // (axe scrollable-region-focusable). role/aria-label name the region for
    // assistive tech.
    <div
      className="my-4 overflow-x-auto"
      tabIndex={0}
      role="region"
      aria-label="Table"
    >
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border border-gray-200 px-3 py-2 align-top" {...props} />
  ),
  a: (props) => (
    <a className="text-orange-600 underline hover:text-orange-700" {...props} />
  ),
  // `code` override CHỈ apply cho inline code (text trong paragraph).
  // Code blocks (`<pre><code class="language-X">`) đi qua shiki → có inline
  // styles + className "shiki". Detect: shiki-processed code có class chứa
  // "language-" prefix; inline plain `<code>` thì không.
  code: ({ className, ...props }) => {
    const isBlockCode =
      typeof className === "string" && className.includes("language-");
    if (isBlockCode) {
      // Pass-through: shiki tokens + styling intact, no extra padding/bg
      return <code translate="no" className={className} {...props} />;
    }
    return (
      <code
        translate="no"
        className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.9em]"
        {...props}
      />
    );
  },
};
