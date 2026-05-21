import { evaluate, type EvaluateOptions } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@shikijs/rehype";
import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

const SHIKI_LANGS = [
  "bash",
  "ts",
  "tsx",
  "json",
  "yaml",
  "yml",
  "sh",
  "md",
  "mdx",
  "css",
  "html",
  "js",
  "jsx",
];

/**
 * Compile MDX source string → React component. Caller renders với custom
 * MDX components mapping. Each call compiles fresh (no internal cache);
 * upstream caching is the responsibility of the route handler (e.g. via
 * `unstable_cache` keyed by file mtime + slug).
 */
export async function compileMdx(
  source: string,
): Promise<
  ComponentType<{ components?: MDXComponents }>
> {
  const options: EvaluateOptions = {
    ...(runtime as unknown as Pick<
      EvaluateOptions,
      "Fragment" | "jsx" | "jsxs" | "jsxDEV"
    >),
    // Pure markdown semantics — disables JSX parsing nên `<300 lines` không bị
    // hiểu là JSX tag. Project docs là markdown thuần, không có React inline.
    format: "md",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "append" }],
      [
        rehypeShiki,
        {
          themes: { light: "github-light", dark: "github-dark" },
          langs: SHIKI_LANGS,
        },
      ],
    ],
  };

  const compiled = await evaluate(source, options);
  return compiled.default as ComponentType<{ components?: MDXComponents }>;
}
