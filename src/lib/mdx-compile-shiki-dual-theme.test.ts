import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { compileMdx } from "./mdx-compile";

describe("compileMdx — Shiki dual theme", () => {
  it("emits both --shiki-light and --shiki-dark CSS vars on tokens", async () => {
    const Comp = await compileMdx("```ts\nconst x = 1;\n```\n");
    const html = renderToStaticMarkup(createElement(Comp));
    expect(html).toContain("--shiki-light");
    expect(html).toContain("--shiki-dark");
    expect(html).toContain("--shiki-light-bg");
    expect(html).toContain("--shiki-dark-bg");
  });

  it("does NOT emit inline color: attribute (defaultColor false)", async () => {
    const Comp = await compileMdx("```ts\nconst x = 1;\n```\n");
    const html = renderToStaticMarkup(createElement(Comp));
    // shiki without defaultColor still emits style="--shiki-light:#xxx; --shiki-dark:#yyy"
    // — no bare `color:#xxx` outside vars.
    const styleMatches = html.match(/style="[^"]*color:[^"]*"/g) ?? [];
    for (const s of styleMatches) {
      const inner = s.slice('style="'.length, -1);
      const props = inner.split(";").map((p) => p.trim()).filter(Boolean);
      for (const p of props) {
        if (p.startsWith("--")) continue;
        // Only --shiki-* vars allowed; bare `color: ...` is a regression.
        expect(p.startsWith("color:")).toBe(false);
      }
    }
  });
});
