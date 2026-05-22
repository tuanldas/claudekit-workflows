# i18n Markdown Documentation Patterns Report
**Research Date:** 2026-05-21  
**Context:** Next.js 16 SSG project (32 MD files, VI default + EN translation in progress)  
**Scope:** File organization, navigation config, fallback strategies, tooling  

---

## Executive Summary

For your use case (32 files, 2 locales, minimal config), **Astro Starlight's subdirectory pattern** (zero-config auto-discovery) is strongest choice, **fallback to Nextra's `_meta.js` pattern** if staying strictly Next.js, **avoid postfix** (adds complexity to routing). Industry leans subdirectory for maintainability & scaling.

---

## 1. File Organization Patterns

### Pattern A: Subdirectory by Locale
**File structure:**
```
docs/
├── vi/
│   ├── getting-started.md
│   ├── architecture.md
│   └── _meta.json (optional)
└── en/
    ├── getting-started.md
    ├── architecture.md
    └── _meta.json (optional)
```

**Adoption:** Docusaurus, Astro Starlight, VitePress, Mintlify  
**Pros:**
- Clear folder semantics; easy for non-technical contributors
- Translation tools (Crowdin, Lokalise) natively support folder structure
- Scaling to 5+ languages remains clean (no filename bloat)
- URL routing maps directly: `/en/getting-started` ← `/en/getting-started.md`

**Cons:**
- Requires folder structure maintenance
- File sync across locales manual (copy → translate)

**Config complexity:** Low–Medium (auto-discover OR light `_meta.json` per folder)

---

### Pattern B: Postfix in Filename
**File structure:**
```
docs/
├── getting-started.vi.md
├── getting-started.en.md
├── architecture.vi.md
└── architecture.en.md
```

**Adoption:** Fumadocs (supported), some custom Next.js setups  
**Pros:**
- Single folder; simpler git diff review (collocated versions)
- Less folder nesting

**Cons:**
- Filename becomes locale-aware; routing logic must parse `.locale.md`
- Harder to reference in code (`import` paths change per locale)
- Does NOT scale: 10 files × 5 locales = 50 files; folder view becomes confusing
- Translation tools expect folder structure (require custom plugins)

**Config complexity:** Medium–High (custom routing, parsing logic)

---

### Pattern C: Inline Frontmatter (Single File)
**File structure:**
```
docs/
├── getting-started.md
│   ---
│   title: { vi: "Bắt đầu", en: "Getting Started" }
│   ---
├── architecture.md
└── ...
```

**Adoption:** None major (theoretical pattern)  
**Pros:**
- Single file to maintain (collocated content)
- Works well for blog + metadata

**Cons:**
- Markdown becomes boilerplate-heavy for large content
- Git diffing mixed-language content is hard for translators
- No tool support; requires custom parsing

**Config complexity:** High (full custom implementation)

---

## 2. Navigation/Sidebar Config Approaches

### Approach A: Auto-Discovery from Folder (Zero Config)
**How it works:**
- Framework scans `docs/` recursively, extracts H1 title from each file
- Alphabetical ordering; index files float to top
- Zero `_meta.json` needed (configs optional for overrides)

**Adoption:** Astro Starlight (default), Fumadocs (file glob), Docusaurus (partial)  
**Example Starlight config:**
```javascript
// astro.config.mjs
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      defaultLocale: 'vi',
      locales: {
        vi: { label: 'Tiếng Việt' },
        en: { label: 'English' },
      },
      // That's it—Starlight auto-discovers docs/vi/ and docs/en/
    }),
  ],
});
```

**Sidebar config priority:**
1. Filename order (alphabetical)
2. H1 first heading in MD file
3. _meta.json override (if present)

**Pros:**
- **Zero upfront config** (your goal: "ít config")
- H1 extraction automatic → no duplication
- Easy scale to 5+ locales (copy folder pattern)
- Translator-friendly (folder structure, no hidden config)

**Cons:**
- Alphabetical order may not match desired hierarchy
- Large trees need `_meta.json` override anyway

**Config complexity:** **Lowest** (0–50 lines if you need overrides)

---

### Approach B: `_meta.json` Per Folder (Nextra/Nextra-Style)
**How it works:**
- Each folder has `_meta.json` that defines order, titles, groups
- Framework reads `_meta.json`, merges with auto-discovered files
- Structure independent of filename order

**Adoption:** Nextra (primary), Starlight (optional), Docusaurus (nav.js)  
**Example `docs/vi/_meta.json`:**
```json
{
  "getting-started": {
    "title": "Bắt đầu"
  },
  "architecture": {
    "title": "Kiến trúc",
    "order": 2
  },
  "guides": {
    "order": 3,
    "open": true
  }
}
```

**Pros:**
- Full control over order, grouping, hierarchy
- Title override (don't rely on H1 extraction)
- Works well for 20–50 files per locale

**Cons:**
- ~50–150 lines per folder × 2 locales = **150–300 lines total**
- Must sync title changes to H1 AND `_meta.json` (duplication risk)
- Adding new file requires `_meta.json` edit + file creation

**Config complexity:** **Medium** (150–300 lines for 32 files × 2 locales)

---

### Approach C: Single Navigation Config (Mintlify-style)
**How it works:**
- One `docs.json` (or `navigation.json`) defines all locales + hierarchy
- Structure mirrors filesystem OR declares custom titles

**Adoption:** Mintlify (primary)  
**Example `docs.json`:**
```json
{
  "navigation": {
    "languages": [
      {
        "language": "vi",
        "groups": [
          {
            "group": "Getting Started",
            "pages": ["vi/overview", "vi/quickstart"]
          }
        ]
      },
      {
        "language": "en",
        "groups": [
          {
            "group": "Getting Started",
            "pages": ["en/overview", "en/quickstart"]
          }
        ]
      }
    ]
  }
}
```

**Pros:**
- Single source of truth (one file to edit)
- Consistent across locales (easier to keep them in sync)

**Cons:**
- **All 32 files × 2 locales documented inline** = ~200–300 line config
- High coupling: move file → edit config
- Not translator-friendly (config language != translation language)

**Config complexity:** **High** (200–300 lines for your use case)

---

### Approach D: Frontmatter-Driven (VitePress-style)
**How it works:**
- Each MD file has frontmatter with `order: N`, `title: "..."`, `sidebar: true/false`
- Framework reads frontmatter; builds sidebar on the fly

**Adoption:** VitePress (optional), some Docusaurus configs  
**Example `docs/vi/getting-started.md`:**
```markdown
---
title: Bắt đầu
order: 1
sidebar: true
---

# Content here
```

**Pros:**
- Decentralized: order travels with file (no separate config)
- Easy to move files (order metadata moves too)

**Cons:**
- File-level metadata not ideal for grouping/hierarchy
- Harder to set consistent order across locales
- Tools don't auto-generate frontmatter

**Config complexity:** **Low** (per-file metadata) but **scattered** across 32 files

---

## 3. Comparison Matrix

| Approach | Config Complexity | Scalability | Translator UX | Maintenance | Real-world Use |
|----------|------------------|------------|--------------|------------|----------------|
| **A: Auto-Discovery** | **Lowest (0–50L)** | 20–100 files | Best | Easiest | Starlight, Fumadocs |
| **B: `_meta.json`** | Medium (150–300L) | 20–50 files/locale | Good | High (title duplication) | Nextra, Starlight (opt) |
| **C: Centralized Config** | **Highest (200–400L)** | Any | Poor | Fragile (single point of failure) | Mintlify |
| **D: Frontmatter** | Low–Medium | 10–30 files | Neutral | Scattered (per-file edits) | VitePress, custom |

---

## 4. Fallback Strategies for Partial Translations

### Scenario: User requests `/en/some-page.md` but only `vi/some-page.md` exists

### Strategy A: Silent Fallback to Default Locale
Framework auto-serves Vietnamese version when English missing. No UI indicator.

**Pros:** Consistent UX (no 404s)  
**Cons:** User may not realize they're reading a different language  
**Use case:** Brand-new content; translation in progress  
**Implementation:** Starlight (built-in), Fumadocs (can configure)

---

### Strategy B: Fallback + Banner
Serve default locale, show "Translation Missing" banner at top.

**Pros:** Clear to user that content not translated yet  
**Cons:** Slightly jarring UX  
**Use case:** Professional docs with translation workflows  
**Implementation:** next-intl `getMessageFallback` hook, custom Starlight component

Example (next-intl):
```typescript
// i18n/request.ts
getMessageFallback(params) {
  return `[⚠ Translation missing: ${params.namespace}.${params.key}]`;
}
```

---

### Strategy C: Translation Chains (Partial Locales)
Define fallback order: en-US → en → vi (Vietnamese only if en not available)

**Pros:** Flexible for partial translations  
**Cons:** Complex routing; requires explicit config  
**Use case:** Regional variants (pt-BR → pt → en)  
**Implementation:** next-intl-localechain, custom logic

---

### Strategy D: 404 Page
Show 404 if translation missing (strict approach).

**Pros:** Forces translation completion  
**Cons:** Bad UX; users see broken pages  
**Use case:** Rare (not recommended)

---

**RECOMMENDATION:** Strategy B (fallback + banner) for your use case. Signals translation is in progress; users can still read content. Starlight + simple component overlay.

---

## 5. Real-World Examples

### Astro Starlight (Astro Docs Site)
- **File structure:** `/src/content/docs/{locale}/...`
- **Config:** `astro.config.mjs` + auto-discovery
- **Fallback:** Built-in (auto-serves default locale)
- **Complexity:** ~20 lines config for i18n setup
- **Scale:** 100+ pages × 10+ languages
- **URL:** `/en/...`, `/es/...`, `/zh/...` (no postfix)

### Docusaurus (React Docs, etc.)
- **File structure:** `/docs/` (default) + `/i18n/{locale}/docusaurus-plugin-content-docs/`
- **Config:** `docusaurus.config.js` + folder structure
- **Fallback:** Configured per locale
- **Complexity:** ~50 lines for i18n setup
- **Scale:** 50+ pages × 5+ languages

### Nextra (The Guild Projects)
- **File structure:** `/pages/{locale}/...` OR `/pages/...` with `_meta.{locale}.js`
- **Config:** `next.config.mjs` + `_meta.js` files
- **Fallback:** Configured in i18n middleware
- **Complexity:** ~100–150 lines for i18n setup + `_meta` files
- **Scale:** 30–100 pages × 2–5 languages

### Mintlify (API Docs, SaaS)
- **File structure:** `/docs/{locale}/...`
- **Config:** Single `docs.json` (200+ lines for 32 files × 2 locales)
- **Fallback:** Simple (missing locale → default)
- **Complexity:** High upfront
- **Scale:** Works for 50–200 pages

---

## 6. Tooling Support

### next-intl + MDX
- **MDX integration:** Yes (documented)
- **File organization:** Any (user controls routing)
- **Fallback:** `getMessageFallback` hook
- **Auto-discovery:** No (manual file imports or contentlayer)
- **Recommendation for your case:** Works, but requires custom file routing. Not "low config."

### Contentlayer
- **i18n support:** No native support (GitHub issue #14 still open)
- **Workaround:** Computed fields to parse locale from path
- **File organization:** Postfix OR subdirectory (user's choice)
- **Recommendation:** Avoid for i18n; missing features.

### Fumadocs
- **MDX support:** Yes (native)
- **File organization:** Supports both postfix (`.{locale}.md`) AND subdirectory
- **Auto-discovery:** File glob + `defineI18n` config
- **Fallback:** Automatic (built-in)
- **Complexity:** Low (~30 lines)
- **Recommendation for Next.js:** Strong choice if not attached to Starlight.

### Astro Starlight
- **MDX support:** Yes (native)
- **File organization:** Subdirectory only
- **Auto-discovery:** Full (zero-config)
- **Fallback:** Built-in
- **Complexity:** Lowest (~20 lines)
- **Recommendation for Next.js:** N/A (Astro framework). But if you can switch, this is gold-standard.

---

## 7. Recommendations (Ranked)

### FOR NEXT.JS 16 (Your Current Setup)

**✅ TIER 1: Fumadocs + Subdirectory Pattern**

```
config/
├── i18n.ts (defineI18n config, ~30 lines)
└── routes.ts (optional)

docs/
├── vi/
│   ├── getting-started.md
│   ├── architecture.md
│   └── ...
└── en/
    ├── getting-started.md
    ├── architecture.md
    └── ...
```

**Setup:**
```typescript
// config/i18n.ts
import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLocale: 'vi',
  locales: ['vi', 'en'],
});
```

**Why:**
- Auto-discovery (zero sidebar config)
- Subdirectory keeps files organized
- Fallback built-in
- ~30 lines total config
- Scales to 5+ locales cleanly
- Translator-friendly

**Effort to implement:** 2–4 hours (folder setup + routing)

---

**✅ TIER 2: Nextra `_meta.js` + Subdirectory Pattern** (if committed to `_meta` style)

```
docs/
├── vi/
│   ├── _meta.js (order, titles for VI)
│   ├── getting-started.mdx
│   └── ...
└── en/
    ├── _meta.js (order, titles for EN)
    ├── getting-started.mdx
    └── ...
```

**Setup:**
```javascript
// docs/vi/_meta.js
export default {
  index: { title: 'Trang chủ', order: 0 },
  'getting-started': { title: 'Bắt đầu', order: 1 },
  'architecture': { title: 'Kiến trúc', order: 2 },
};
```

**Why:**
- Full control over order/hierarchy
- Works with Next.js i18n routing directly
- Fallback via middleware
- ~150–200 lines total config (acceptable given control)

**Trade-off:** Title duplication (H1 + `_meta.js`); higher maintenance.

**Effort to implement:** 4–6 hours (routing setup + `_meta.js` files)

---

**⚠️ TIER 3: Postfix (`file.vi.md`, `file.en.md`) — Not Recommended**

- Adds routing complexity (file parsing)
- Scales poorly (50 files × 2 locales = confusing folder)
- Translation tools expect folder structure
- Use only if you have a very specific reason

---

### IF YOU CAN SWITCH FRAMEWORKS

**✅✅ TIER 0: Astro Starlight + Subdirectory Pattern**

- Gold standard for documentation
- Absolute zero config for i18n (just locale folders)
- Auto-discovery + H1 extraction
- Built-in fallback
- `astro.config.mjs`: ~20 lines
- Framework maturity: production-ready

**Migration effort:** High (~1–2 weeks for full site) but long-term payoff.

---

## 8. Title/Metadata Sources (Priority)

For sidebar entry titles, frameworks check (in order):

1. **`_meta.json` / `_meta.js` override** (if present)
2. **H1 first heading in MD** (automatic extraction)
3. **Filename slug** (title-case transform)
4. **Frontmatter `title:` field** (if supported)

**Best practice:** Use H1 + optional `_meta.js` override for special cases.

---

## Unresolved Questions

1. **Will you use MDX (React components in docs)?** If no, pure Markdown frameworks (Starlight) sufficient. If yes, Nextra/Fumadocs preferred.

2. **Timeline for English translation?** If all 32 files will be translated soon (weeks), auto-discovery + fallback banner works. If slow (months), stricter validation needed (per-locale `_meta.json` ensures completeness).

3. **Will you integrate with translation service (Crowdin, Lokalise)?** If yes, subdirectory pattern native support (no custom plugins needed). Postfix requires configuration.

4. **Future languages beyond VI/EN?** Affects scalability. Subdirectory scales cleanly to 5+ locales; config-based approaches get unwieldy past 3.

---

## Summary Recommendation

**For your project (32 files, VI default, EN in progress, Next.js 16):**

→ **Use Fumadocs + Subdirectory Pattern** for minimal config + maximum flexibility.

**Setup:**
- `docs/vi/` and `docs/en/` folders (copy → translate pattern)
- `config/i18n.ts` (~30 lines)
- Route `/docs/[locale]/[...slug]` with Fumadocs integration
- Fallback strategy: serve default locale + optional banner component

**Config total:** ~50–100 lines (including routing)  
**Translator experience:** Excellent (folder structure native)  
**Scaling to 5+ languages:** Clean (repeat folder pattern)  
**Time to implement:** 2–4 hours

**Alternative if you prefer explicit control:** Nextra `_meta.js` (~200 lines config, fuller control).

---

## Sources

- [Astro Starlight i18n guide](https://starlight.astro.build/guides/i18n/)
- [Nextra i18n documentation](https://nextra.site/docs/guide/i18n)
- [next-intl MDX integration](https://next-intl.dev/docs/environments/mdx)
- [Fumadocs i18n setup](https://www.fumadocs.dev/docs/internationalization/next)
- [Docusaurus i18n tutorial](https://docusaurus.io/docs/i18n/tutorial)
- [VitePress i18n guide](https://vitepress.dev/guide/i18n)
- [Mintlify localization docs](https://mintlify.com/docs/navigation/localization)
- [Markdown Localization Specification](https://github.com/markdown-localization/mdlm-spec)
- [Medium: Common i18n organization methods](https://medium.com/@jogarcia/common-i18-organization-methods-c05d40eba124)
