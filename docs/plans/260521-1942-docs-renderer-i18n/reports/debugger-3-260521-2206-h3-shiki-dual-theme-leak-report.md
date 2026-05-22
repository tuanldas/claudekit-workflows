---
name: debugger-3-h3-shiki-dual-theme-leak
date: 2026-05-21 22:10
agent: debugger-3
task: #3 — H3 Shiki config dual-theme leak in served HTML
verdict: REJECTED (Shiki config đúng). New H4 surfaced — browser auto-dark adapter.
---

# H3: Shiki dual-theme leak — REJECTED

## Hypothesis

Despite mdx-compile.ts đặt `theme: "github-light"` (single, commit adeee7c), shiki có thể vẫn output dual-theme CSS variables (`--shiki-light` / `--shiki-dark`) hoặc multiple theme classes. Causes possible: stale @mdx-js compile cache, multiple shiki configs, OS dark mode triggering fallback.

## Evidence Chain (against H3)

### 1. Source state — chính xác
- `src/lib/mdx-compile.ts:55` → `theme: "github-light"` (single key, NOT `themes: {...}`)
- `src/app/globals.css` → NO `@media (prefers-color-scheme: dark)` block (đã removed)
- `src/app/layout.tsx:23` → `colorScheme: "light"`, `themeColor: "#ffffff"`

### 2. Served HTML — ZERO leak markers
Probe: `curl -s http://localhost:3001/vi/docs/claudekit-overview > /tmp/served.html` (81,545 bytes)

```bash
grep -oE '\-\-shiki-(dark|light)[a-z\-]*' → ZERO matches
grep -oE 'shiki-themes' → ZERO matches
grep -oE 'github-dark' → ZERO matches
```

### 3. Single shiki class + light inline only
```html
<pre translate="no"
     class="overflow-x-auto rounded-lg p-4 text-sm shiki github-light"
     style="background-color:#fff;color:#24292e"
     tabindex="0">
```

- Class: `shiki github-light` (SINGLE), NO `shiki-themes` qualifier
- Inline: `#fff` bg + `#24292e` text (GitHub Light defaults)

### 4. Color distribution audit (claudekit-overview)
```
  1 background-color:#fff   ← shiki bg
  1 color:#000              ← misc
  2 color:#005              ← github-light blue (keywords)
  1 color:#032              ← github-light dark blue (strings)
 21 color:#24292            ← github-light text (dominant)
   1 color:#fff             ← white-on-dark badge
```

Tất cả colors are GitHub Light palette. Zero `#0d1117` (github-dark bg), `#c9d1d9` (github-dark fg), or any dark theme color hex.

### 5. Cross-page verification
`docs/cli/cli-commands-reference` (5 code blocks): cùng pattern — all `shiki github-light` + `background-color:#fff;color:#24292e`. Không có exception.

### 6. Meta tags signal LIGHT
```html
<meta name="theme-color" content="#ffffff"/>
<meta name="color-scheme" content="light"/>
```

### 7. `prefers-color-scheme:dark` xuất hiện ở đâu?
Tìm thấy 1 match — nhưng trong **Next.js error boundary scoped style** (RSC payload `dangerouslySetInnerHTML` for `next-error` view):

```css
body{color:#000;background:#fff;margin:0}
.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}
@media (prefers-color-scheme:dark){
  body{color:#fff;background:#000}
  .next-error-h1{border-right:1px solid rgba(255,255,255,.3)}
}
```

→ Chỉ active khi Next.js render error page. **Không apply trong normal docs route**.

## Conclusion

**H3 BÁC BỎ.** Shiki single-theme config đã apply chính xác. HTML served sạch không có dual-theme leak. Server output 100% match spec light-only.

## ADVERSARIAL: Challenge H1/H2 — New hypothesis surfaces

H1 (browser cache) và H2 (stale server) đã verified server output đúng nhưng KHÔNG explain ngọn ngành tại sao user **vẫn thấy** dark code blocks sau hard reload (giả định họ đã reload).

**Hypothesis H4 (NEW)**: **Chrome Auto Dark Theme / Force Dark Mode** đang override page colors trên user's browser.

### Evidence supporting H4

1. **Meta `color-scheme="light"` is NOT strict opt-out.** Per Chromium docs, để hoàn toàn opt out của browser auto-dark, cần:
   ```html
   <meta name="color-scheme" content="only light">
   ```
   Trang hiện chỉ set `content="light"` — Chrome's `Force Dark` flag (chrome://flags/#enable-force-dark) và `Auto Dark Theme` trên Android có thể BYPASS.

2. **Visual symptom match**: User report "text near-invisible" trong code blocks. Đây là **classic auto-dark behavior**:
   - Body bg auto-inverted: `#fff` → dark gray
   - Inline `color:#24292e` text NOT inverted (vì là inline style, không phải CSS background)
   - Kết quả: dark gray text on dark gray bg → near-invisible
   - Nếu là H1 (stale cache với dual-theme), symptom sẽ là: dark BLACK bg (`#0d1117`) + readable WHITE text. **KHÔNG phải near-invisible**.

3. **`viewport.colorScheme` Next.js currently `"light"`** (`src/app/layout.tsx:23`), chưa phải `"only light"`.

### Why H1 cache đơn thuần không đủ
- Nếu cache stale, browser sẽ load CSS chunk cũ → fully dark theme rendered (legible).
- Symptom "near-invisible" require body bg đổi mà text không đổi → bias toward browser auto-dark, NOT static cache.

### Verification cần làm trên user side
1. Check Chrome flags: `chrome://flags/#enable-force-dark` — nếu enabled, đây là root cause.
2. Check macOS Settings: System Settings → Appearance — nếu Dark, Safari có thể auto-invert canvas colors khi page declared `color-scheme: light` (not `only light`).
3. DevTools → Rendering panel → Emulate CSS media feature `prefers-color-scheme: light` — nếu code blocks chuyển sáng → confirm H4.
4. DevTools → Elements → Computed → `background-color` của `<body>` — nếu computed value ≠ `#ffffff` despite source `#ffffff`, browser is force-darkening.

## Recommendations

### Priority 1 — Strict opt-out (proactive fix)
Update `src/app/layout.tsx:23`:
```typescript
colorScheme: "light",  // ← change to "only light"
```
→
```typescript
colorScheme: "only light",
```
(Next.js Viewport type accepts string; `"only light"` is valid CSS value per spec.)

### Priority 2 — User verification
Hỏi user:
- Đang dùng browser nào? (Chrome / Safari / Firefox)
- macOS đang Dark mode hay Light mode?
- Đã thử DevTools Rendering panel emulate `prefers-color-scheme: light` chưa?

### Priority 3 — Nếu H4 confirmed
Áp dụng `colorScheme: "only light"` + thêm CSS:
```css
:root {
  color-scheme: only light;
}
```
trong `globals.css` để gấp đôi opt-out.

## Confidence

- **H3 disproved**: 99% (HTML evidence ironclad — server output clean light-only).
- **H4 (browser auto-dark)**: 70% confidence. Cần user test DevTools Rendering panel để promote → 95%.

## Unresolved Questions

1. User đang ở browser/OS combo nào? (Chrome on macOS Dark mode là kịch bản likely nhất.)
2. Đã hard reload chưa? (Per H1 recommendation, user chưa confirm.)
3. Sau khi áp dụng `colorScheme: "only light"`, symptom có biến mất không?
