---
name: debugger-2-h2-stale-dev-server
date: 2026-05-21 22:08
agent: debugger-2
task: #2 — Debug H2: Stale Next dev server serving old build
verdict: REJECTED (H2 không phải nguyên nhân)
---

# H2: Stale Next dev server — REJECTED

## Hypothesis

Nếu dev server PID trên port 3001 khởi động **trước** commit `adeee7c` (shiki light-only fix lúc 2026-05-21 22:01:09), server đang serve compiled output cũ → fix mới không có hiệu lực.

## Evidence

### Timeline
| Sự kiện | Thời gian |
|---|---|
| Commit `adeee7c` (shiki light-only) | 2026-05-21 **22:01:09** +0700 |
| Commit `11ad945` (DocsToc hydration, HEAD) | 2026-05-21 **22:04:18** +0700 |
| Dev server PID 91015 **started** | 2026-05-21 **22:06:13** +0700 |
| Probe time | 2026-05-21 **22:08:58** +0700 |

### Process check
```
lsof -ti :3001 → 10700, 91015

PID 10700: Chrome Helper (network process) — không phải dev server, chỉ là browser network kết nối tới port
PID 91015: next-server (v16.2.6) — Next.js dev server thật
  ELAPSED: 02:44 (2 phút 44 giây tại thời điểm probe)
  STARTED: Thu 21 May 22:06:13 2026
  User: admin
```

PID 91015 khởi động **sau** cả 2 commit fix code block (22:06:13 > 22:04:18 > 22:01:09).

### Live HTML probe
URL: `http://localhost:3001/vi/docs/claudekit-overview` (81,545 bytes, 6 `<pre>` tags rendered)

```bash
grep -oE 'data-theme="[^"]*"' /tmp/h2-doc.html
# → empty (KHÔNG có data-theme markers)

grep -oE 'style="[^"]*background-color[^"]*"' /tmp/h2-doc.html | head -1
# → style="background-color:#fff;color:#24292e"
```

- Single `background-color:#fff` (github-light) — không có dark `#0d1117`
- Không có `data-theme="light"` / `data-theme="dark"` attributes (đặc trưng của dual-theme mode)
- 12 `<span class="line">` từ shiki output

### Source confirmation
`src/lib/mdx-compile.ts`:
```ts
[
  "@shikijs/rehype",
  {
    // Single theme — dark mode out of scope per plan.
    theme: "github-light",
    langs: SHIKI_LANGS,
  },
],
```

Source code khớp với rendered output → dev server đã pickup commit `adeee7c`.

## Conclusion

**H2 BÁC BỎ.** Dev server PID 91015 fresh, khởi động sau cả 2 commit fix, đang serve correct compiled output từ source mới nhất.

Live HTML xác nhận:
- Shiki **single-theme** mode active (light only)
- KHÔNG có `data-theme` dual-theme leak
- `background-color:#fff` rendered đúng từ `github-light`

Nguyên nhân vấn đề code block contrast user gặp **không phải** stale dev server. Cần follow-up H1 (browser/HTTP cache) hoặc H3 (shiki config sai chỗ khác — nhưng probe HTML đã loại trừ dual-theme leak).

## Recommendations

1. **Không cần restart dev server** — process fresh, code đã apply.
2. Nếu user vẫn thấy issue → **HARD refresh browser** (Cmd+Shift+R / Ctrl+Shift+R) hoặc DevTools → Network → Disable cache.
3. Verify trên user side: probe `view-source:http://localhost:3001/vi/docs/claudekit-overview` xem `background-color:#fff` có hiện không. Nếu có → vấn đề ở CSS override hoặc browser cache, không phải shiki.

## Unresolved questions

1. User probe URL nào khi thấy contrast issue? `/vi/docs/<slug>` hay route khác?
2. Browser cache đã được kiểm tra (H1 — debugger-1)? Nếu H1 cũng REJECTED, cần đào sâu vào CSS layer (e.g., `prose` styles override shiki inline `style=""`).
