# Engineer — Design Skills

Design pipeline: từ system → exploration → finalization → maintenance.

## Quick Selection Matrix

| Goal | Use |
|------|-----|
| Tạo brand system từ đầu | `design-consultation` |
| Explore multiple design options | `design-shotgun` |
| Generate UI qua AI prompt | `ck:stitch` |
| Finalize design → vanilla HTML/CSS | `design-html` |
| Replicate screenshot/video → polished code | `ck:frontend-design` |
| Audit live visual code | `design-review` |
| Critique design trong plan | `plan-design-review` |
| Design guidance/rules reference | `ck:ui-ux-pro-max` |

---

## design-consultation

**Purpose:** Design complete design system từ scratch (aesthetic, typography, color, layout, spacing, motion); tạo DESIGN.md.

**USE when:**
- New project no design system
- Cần brand/design guidelines
- Reusable component library

**DON'T use when:**
- Audit existing site → `design-review`
- Building variants of approved → `design-shotgun`
- Finalizing code → `design-html`

**Workflow:**
1. Product research (WebSearch + user confirmation)
2. Aesthetic direction selection (12+ options: minimalist, maximalist, retro, organic, luxury, playful, editorial, brutalist, art deco, industrial, soft)
3. Generate system (typography pairs, 10-20 palettes, spacing, shadow, motion)
4. Preview pages (rendered components)
5. Write DESIGN.md (tokens, usage, Do/Don't)

**Outputs:** DESIGN.md (project root); font+color preview pages; design tokens

**Hard gates:**
- DESIGN.md phải include: color tokens, typography scales (display/body/code), spacing scale, shadow, motion timing, component recipes
- Concrete rendered examples (buttons, forms, cards, alerts)

**Pitfalls:**
- Generic aesthetics (Inter, purple gradients)
- Không show rendered preview
- DESIGN.md quá vague

**Difference from:**
- Khác `design-shotgun` (variants), `design-html` (code), `plan-design-review` (critique plan)
- design-consultation tạo *system* feed all downstream

---

## design-shotgun

**Purpose:** Generate multiple AI design variants, open comparison board, collect feedback, iterate.

**USE when:**
- Explore design options
- Xem feature có thể look thế nào
- Chưa quyết direction

**DON'T use when:**
- Design đã quyết & cần code → `design-html`
- Review completed live site → `design-review`

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `variants --count N` | Generate N alternatives (default 3, max 8) |
| `compare --images a,b,c --serve` | Open comparison board browser |
| `iterate --feedback "..."` | Refine theo feedback |
| `approve <variant>` | Save as approved |

**Anti-convergence directive (HARD):** Mỗi variant phải *different* font family, color palette, layout approach. 2 variants similar → 1 failed, regenerate

**Outputs:** 3-8 design variant PNGs; comparison board HTML; `taste-profile.json` tracking approved/rejected

**Difference from:**
- Khác `design-consultation` (create system), `design-html` (finalize code), `design-review` (audit)
- design-shotgun = pure exploration

---

## design-html

**Purpose:** Finalize design thành production-quality vanilla HTML/CSS, từ approved mockups, CEO plans, design reviews, hoặc fresh description.

**USE when:**
- Design approved & locked
- Cần polished HTML/CSS code
- Zero dependencies
- Có mockup replicate

**DON'T use when:**
- Still exploring → `design-shotgun`
- Cần framework (React/Vue/Svelte) → `ck:frontend-design`
- Cần brand system → `design-consultation`

**Smart API routing:** Pretext patterns based on design type (landing page vs dashboard vs form-heavy)

**Outputs:** HTML file; CSS (inline/external); responsive, production-ready; 30KB overhead, zero deps

**Hard gates:**
- Production-ready day one
- No placeholder
- Responsive
- Accessibility (alt text, semantic HTML)
- Fast load (<100KB)

**Difference from:**
- Khác `design-shotgun` (exploration), `ck:frontend-design` (React/Vue), `design-consultation` (system)
- design-html = final HTML output, zero deps

---

## design-review

**Purpose:** Live site visual QA — find inconsistency, spacing, hierarchy, AI slop, slow interactions; fix trong source code.

**USE when:**
- Site live & có visual problems
- Polish appearance deployed code

**DON'T use when:**
- Audit plan → `plan-design-review`
- Explore variants → `design-shotgun`
- Create system → `design-consultation`

**Workflow:** Screenshot live → identify issues → root cause to file:line → fix Edit tool → re-verify screenshot → commit atomically → repeat

**Pitfalls:** Fix without screenshot verification; batch unrelated fixes; miss responsive viewport (check mobile/tablet/desktop)

**Difference from:**
- design-review = *maintenance* — improve existing deployed code

---

## ck:frontend-design

**Purpose:** Create polished frontend interfaces từ designs/screenshots/videos với exceptional aesthetic detail, no AI slop.

**USE when:**
- Replicating screenshot/video
- Building 3D/WebGL
- Cần production-grade UI avoiding generic AI aesthetics

**DON'T use when:**
- Starting from scratch no reference → `design-consultation`
- Quick prototyping → `design-shotgun`

**Workflow selection (by input):**
| Input | Workflow |
|-------|----------|
| Screenshot | Replicate exactly |
| Video | Replicate with animations |
| 3D/WebGL request | Three.js immersive |
| Quick task | Rapid implementation |
| Complex/award-quality | Full immersive |

**Design dials (configurable):**
| Dial | Range | Low | High |
|------|-------|-----|------|
| DESIGN_VARIANCE | 1-10 (default 8) | Centered/symmetric | Asymmetric/masonry/fractional grid |
| MOTION_INTENSITY | 1-10 (default 6) | CSS hover only | Framer Motion/spring physics |
| VISUAL_DENSITY | 1-10 (default 4) | Whitespace/expensive | Cockpit/1px dividers/monospace |

**Anti-slop rules (HARD):**
- Pick extreme aesthetic
- Execute với precision
- AVOID generic fonts (Inter, Roboto), purple gradients, cliched layouts

**Hard gates:**
- MANDATORY activate `ck:ui-ux-pro-max` FIRST cho design intelligence
- Use `ck:ai-multimodal` extract colors/fonts từ images
- Match source pixel-perfectly

**Difference from:**
- Khác `design-html` (vanilla only), `design-shotgun` (exploration), `design-consultation` (system)
- ck:frontend-design = framework-agnostic polish-focused from reference

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/frontend-design

---

## ck:stitch

**Purpose:** AI design generation qua Google Stitch — generate UI từ text prompts, export Tailwind/HTML/DESIGN.md.

**Flags:** `generate` / `variants` / `export` / `quota check`

**Hard gates:** STITCH_API_KEY trong `~/.claude/.env`; free tier 400 credits/day + 15 redesign credits/day (reset UTC midnight)

**Difference from:**
- Khác `design-shotgun` (Claude-driven), `design-consultation` (system), `design-html` (code)
- ck:stitch = Google Stitch API wrapper rapid AI generation

---

## ck:ui-ux-pro-max

**Purpose:** Design intelligence reference database — 50+ styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types.

**Rule categories (by priority):**
1. **Accessibility** (CRITICAL): Contrast 4.5:1, Alt text, Keyboard nav, ARIA
2. **Touch & Interaction** (CRITICAL): 44×44px min size, 8px+ spacing, Loading feedback
3. **Performance** (HIGH): WebP/AVIF, Lazy loading, CLS <0.1
4. **Style Selection** (HIGH): Match product type, Consistency, SVG icons
5. **Layout & Responsive** (HIGH): Mobile-first, Viewport meta
6. **Typography & Color** (MEDIUM): 16px base, 1.5 line-height
7. **Animation** (MEDIUM): 150-300ms duration
8. **Forms & Feedback** (MEDIUM): Visible labels, Error near field
9. **Navigation** (HIGH): Bottom nav ≤5, Deep linking
10. **Charts & Data** (LOW): Legends, Tooltips, Accessible colors

**Pitfalls:** Use only dominant palette; ignore accessibility (CRITICAL); generic Inter/Roboto

**Difference from:**
- Khác `design-html` (code output), `design-shotgun` (variants), `ck:frontend-design` (React-specific)
- ck:ui-ux-pro-max = *reference* database, not workflow

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/ui-ux-pro-max
