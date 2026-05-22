import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./code-block";

/**
 * Custom MDX component overrides. Uses semantic tokens so prose theme stays
 * in sync with the rest of the design system across light/dark.
 */
export const docsMDXComponents: MDXComponents = {
  pre: CodeBlock,
  h1: (props) => (
    <h1
      className="mt-8 mb-4 text-3xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-8 mb-3 border-b border-border pb-2 text-2xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-6 mb-2 text-xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="mt-4 mb-2 text-lg font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  table: (props) => (
    <div
      className="my-4 overflow-x-auto rounded-[var(--radius-md)] border border-border"
      tabIndex={0}
      role="region"
      aria-label="Table"
    >
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-b border-border bg-surface px-3 py-2 text-left text-sm font-semibold text-foreground"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="border-b border-border px-3 py-2 align-top text-sm text-foreground-muted"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
      {...props}
    />
  ),
  // `code` override applies only to inline code. Block code goes through Shiki
  // and gets a `language-X` class — detect and pass through to preserve tokens.
  code: ({ className, ...props }) => {
    const isBlockCode =
      typeof className === "string" && className.includes("language-");
    if (isBlockCode) {
      return <code translate="no" className={className} {...props} />;
    }
    return (
      <code
        translate="no"
        className="rounded-[var(--radius-sm)] border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        {...props}
      />
    );
  },
};
