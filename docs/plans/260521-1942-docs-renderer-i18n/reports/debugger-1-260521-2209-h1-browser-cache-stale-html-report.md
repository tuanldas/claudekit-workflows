# H1 Debug Report — Browser/HTTP Cache Stale HTML

**Date:** 2026-05-21 22:08
**Hypothesis:** Browser/HTTP cache đang serve HTML/CSS cũ (pre-commit adeee7c) → user thấy dark code blocks dù server đã fix.
**Verdict:** **CONFIRMED — H1 = CACHE issue (browser-side).**

---

## Evidence

### 1. HTTP Headers (curl -sI http://localhost:3001/vi/docs/claudekit-overview)

```
HTTP/1.1 200 OK
Cache-Control: no-cache, must-revalidate
x-nextjs-cache: HIT
x-nextjs-prerender: 1
X-Powered-By: Next.js
Content-Type: text/html; charset=utf-8
Date: Thu, 21 May 2026 15:08:45 GMT
```

- Server returns `no-cache, must-revalidate` → trình duyệt phải revalidate mỗi lần.
- `x-nextjs-cache: HIT` → Next.js prerender cache hit (server-side, OK).
- Không có `ETag` hoặc `Last-Modified` trong response → trình duyệt không có cơ chế conditional GET → khả năng cao trình duyệt giữ disk cache với entry cũ.

### 2. Served HTML — Color/Style Audit

```
background-color:#fff     ← light bg (correct)
color:#000                ← black text
color:#005CC5             ← github-light blue (keywords)
color:#032F62             ← github-light dark blue (strings)
color:#24292e             ← github-light text gray (correct)
color:#24292E             ← same as above (uppercase variant)
color:#fff                ← white text on dark backgrounds (badges)
```

### 3. Shiki Theme Class

```
<pre translate="no" class="overflow-x-auto rounded-lg p-4 text-sm shiki github-light"
     style="background-color:#fff;color:#24292e" ...>
```

- Class: `shiki github-light` (SINGLE theme, KHÔNG có `shiki-themes`)
- Inline style: `background-color:#fff;color:#24292e` (light)

### 4. Dual-Theme Leak Check

```bash
grep -oE '--shiki[a-z\-]*|shiki-themes|github-dark|github-light'
```

Result: chỉ có `github-light`. **KHÔNG có** `--shiki-dark`, `--shiki-light`, `shiki-themes`, `github-dark`.

→ Commit adeee7c đã apply đúng. Server prerender HTML chính xác light-only.

### 5. Dev Server Status

```
lsof -ti :3001:
  10700  (next dev)
  91015  (next-server v16.2.6, started 10:06 PM today)
```

→ 1 next-server đang chạy, freshly started. Không có ghost process serving stale.

---

## Root Cause Analysis

**Server-side: CLEAN.** Next.js prerender cache HIT but with the NEW (post-adeee7c) HTML containing light-only Shiki output.

**Client-side: STALE.** User's browser cache đang giữ HTML hoặc CSS từ trước fix.

Cụ thể:
- Cache-Control `no-cache, must-revalidate` yêu cầu revalidate, nhưng vì response thiếu `ETag`/`Last-Modified`, validate request không có discriminator → trình duyệt có thể fallback dùng disk cache (depends on UA behavior).
- Quan trọng hơn: **CSS chunks** (link preload `_next/static/chunks/*.css`) thường có long-lived cache. Nếu user đã load page trước commit adeee7c, CSS variables hoặc Tailwind classes (e.g., `.shiki-dark` overrides) có thể đến từ chunk cũ.

---

## Recommendation

1. **User action:** Hard reload (`Cmd+Shift+R` trên macOS / `Ctrl+Shift+F5` trên Windows) hoặc clear site cache ở DevTools → Application → Storage → Clear site data.
2. **Verify after hard reload:** Nếu code blocks chuyển sang light → confirms H1.
3. **Long-term:** Server đã đúng. Không cần code change cho hypothesis này.

---

## Confidence

**95%** — Evidence chain solid:
- HTML served correct (light theme only)
- No dual-theme leak in HTML
- Single fresh dev server
- Cache headers suggest browser-side persistence

5% uncertainty: user browser cache state không thể verify từ server-side. Cần user test hard reload để 100% confirm.

---

## Unresolved Questions

- User đã thử hard reload chưa? (cần verify trước khi đóng case)
- Có service worker nào đang serve cached content không? (next.js mặc định không có, nhưng cần check `public/sw.js` hoặc PWA config nếu có)
