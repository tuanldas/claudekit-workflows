# UI Guidelines Fixes — Quick Review Report

**Verdict:** FAIL — 2 blockers found.

## Blocker 1 — themeColor in wrong export (Next.js 16)

**File:** `src/app/layout.tsx:18-22`

`themeColor` configured inside `metadata` export. Next.js 16 deprecated this; must be in `viewport` export.

User claim "no warnings" is incorrect. Build emits repeated:
```
⚠ Unsupported metadata themeColor is configured in metadata export in /[locale]/docs/[...slug].
  Please move it to viewport export instead.
⚠ Unsupported metadata themeColor is configured in metadata export in /_not-found.
```
Warning fires on every inherited route (10+ instances observed).

**Fix:**
```ts
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark", // optional, can replace inline <html style>
};

export const metadata: Metadata = {
  title: "ClaudeKit Workflows",
  description: "Học ClaudeKit qua workflows trực quan, tương tác được",
  // remove themeColor
};
```

Reference: https://nextjs.org/docs/app/api-reference/functions/generate-viewport

## Blocker 2 — Inline transform defeats prefers-reduced-motion fix

**File:** `src/components/docs/mobile-drawer.tsx:48-49`

```tsx
<aside
  className="... motion-safe:animate-[slideIn_200ms_ease-out_forwards] motion-reduce:translate-x-0"
  style={{ transform: "translateX(-100%)" }}
>
```

Inline `style.transform` has higher CSS specificity than any class-based transform. For users with `prefers-reduced-motion: reduce`:

- `motion-safe:animate-[slideIn_...]` does NOT apply (motion-safe gated off)
- `motion-reduce:translate-x-0` (Tailwind utility → `transform: translate(0,0)`) is OVERRIDDEN by inline style
- Result: drawer stays at `translateX(-100%)` (off-screen) when opened → invisible drawer, clicking hamburger appears to do nothing

This is an a11y regression. The motion-reduce branch was added specifically to address the previous "animate margin-left" finding, but the inline style negates it.

**Fix options:**

Option A — remove inline style; set initial position via class, let keyframe interpolate:
```tsx
<aside
  className="... -translate-x-full motion-safe:animate-[slideIn_200ms_ease-out_forwards] motion-reduce:translate-x-0"
>
```
But Tailwind `-translate-x-full` also generates inline-like transform, may conflict with animate keyframe — need to verify both render correctly under Tailwind v4's transform composition rules.

Option B — define keyframes so animation starts from `-100%`, no initial style needed for motion-safe; for motion-reduce branch render conditionally (skip animation class entirely when user prefers reduced):
```tsx
const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
<aside className={prefersReduced ? "translate-x-0" : "animate-[slideIn_200ms_ease-out_forwards]"} />
```
(Requires SSR-safe hook or hydration guard.)

Option C — use CSS-only solution with `@media (prefers-reduced-motion)` block in global styles overriding initial state.

## Spot-checks that PASS

- Focus-visible rings consistent across all interactive elements; ring color (orange-300) + offset visible against backgrounds
- `transition-colors transition-shadow` correctly replaces `transition-all` on workflow-card
- Form labels: search-bar `<label htmlFor>` + `name` + `type="search"` + `autoComplete="off"` + `spellCheck={false}` correct
- `translate="no"` applied consistently on code blocks, CK logo, command tags, slug refs, duration string
- Hamburger 44×44 target (h-11 w-11) meets WCAG 2.5.5
- `aria-pressed` on category-tabs and language-switcher correct
- `aria-modal="true"` + `role="dialog"` on drawer; ESC key handler + body scroll lock present
- Ellipsis chars (…) replace ASCII in translations (33 tests still pass implies snapshot/i18n not broken)
- `min-w-0 flex-1` on header child prevents text overflow issues
- `text-balance` on h1, `text-pretty` on subtitle paragraph

## Unresolved Questions

1. Is `colorScheme: "light dark"` on `<html style>` sufficient, or should it also move to `viewport` export for consistency? (Currently works but mixes patterns.)
2. Mobile drawer: when blocker 2 is fixed, do e2e tests (`e2e/docs-navigation.spec.ts`) explicitly cover `prefers-reduced-motion: reduce` scenario? If not, recommend adding.
3. Mobile drawer focus trap is documented as "minimum" in comment — was full focus trap consciously deferred or is it on the followup list?
