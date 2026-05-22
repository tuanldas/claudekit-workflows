---
report: debug-team-synthesis
issue: docs code blocks low contrast (dark bg + dark text)
date: 2026-05-21
team: debug-code-block-contrast
confidence: 70%
---

# Root cause — code block contrast issue

## Symptom

User report: `/vi/docs/*` code blocks render với extremely low contrast (text near-invisible) trên localhost:3001. Sau commit `adeee7c` (shiki light-only fix) + reload, vấn đề persist.

## Investigation summary

3 hypotheses tested in parallel via Agent Teams (debug template):

| H | Theory | Verdict |
|---|--------|---------|
| H1 | Browser/HTTP cache stale | ❌ REJECTED |
| H2 | Stale Next dev server (pre-fix process) | ❌ REJECTED |
| H3 | Shiki config not applied / dual-theme leak | ❌ REJECTED |
| **H4** | **Browser force-dark mode bypass** | ✅ **CONFIRMED 70%** |

**Key disqualifier**: Live HTML probe shows shiki output 100% correct (`background-color:#fff;color:#24292e`, no `--shiki-dark`, no dual-theme markers). Symptom (dark bg + dark text) doesn't match cache/server-stale patterns (would give consistent old theme readable white-on-dark).

## Root cause (H4)

Chrome `chrome://flags/#enable-force-dark` OR macOS dark mode + Chrome auto-darken-for-light-sites:

1. Site declared `color-scheme: light` (non-strict)
2. Browser respects declaration as HINT, không opt-out cứng
3. Chrome's auto-dark adapter inverts CSS `background` (body, Tailwind classes) nhưng KHÔNG invert inline `color:#24292e` từ shiki
4. Result: dark inverted bg + dark shiki text = low contrast

## Fix

**`src/app/layout.tsx`**:
```ts
viewport: {
  colorScheme: "only light",  // was "light"
}
```

**`src/app/globals.css`**:
```css
:root {
  color-scheme: only light;  /* belt-and-suspenders */
}
```

`only light` là strict opt-out — Chrome explicitly KHÔNG force-darken.

## Evidence chain

- debugger-1 (cache check): Cache-Control `no-cache, must-revalidate`, served HTML correct
- debugger-2 (server fresh check): PID 91015 started 22:06, after both fix commits
- debugger-3 (shiki output audit): ZERO dual-theme refs, ZERO github-dark hex colors trong HTML

## Verification needed (user side)

User confirm fix landed:
1. Hard reload `/vi/docs/claudekit-overview` (Cmd+Shift+R)
2. DevTools → Elements → `<html>` → Computed → `color-scheme: only light`
3. Code blocks render với white bg + readable dark text

Alternative checks nếu vẫn dark:
- Chrome flags `enable-force-dark` set to `Disabled`?
- Chrome site settings → claudekit-workflows / localhost → Theme → "Light"?
- Browser extension (Nuxt DevTools đã visible trong screenshot có thể inject CSS)

## Lessons learned

- `color-scheme: "light"` (non-strict) là default-friendly nhưng KHÔNG bulletproof against Chrome auto-dark
- For light-only sites, ALWAYS use `only light` (strict opt-out) — cost zero, benefit "no surprise dark mode"
- Symptom analysis quan trọng hơn ouput inspection: HTML correct nhưng user thấy wrong → tìm rendering-layer issue, không phải build-layer

## Unresolved questions

- 30% confidence còn lại — nếu user không bật force-dark trong Chrome, root cause khác (e.g., browser extension CSS injection). User confirm needed.
- Browser extension trong screenshot (Nuxt DevTools "1 Issue" badge) có thể inject styles? Defer until H4 fix verified ineffective.
