# Marketing — Brand Design & Visual Assets

Skills cho design system, logo, banner, CIP, kit builder, storage.

---

## ckm:design

**Purpose:** Unified design system covering brand identity, design tokens, UI styling, logos, CIP, slides, banners, social photos, icons.

**USE when:**
- Creating brand identity
- Designing visual assets
- Developing design systems
- Generating logos hoặc corporate identity materials

**Subcommands:**
- Logo design
- CIP generation
- Slide creation
- Banner design
- Social photo design
- Icon generation

**Modes:**
- Logo (55+ styles)
- CIP (50+ deliverables)
- Slides (HTML presentations)
- Banners (22+ styles)
- Social photos (multi-platform)

**Hard gates:**
- Always specify design style và target audience
- Use white background cho logo generation

**Pitfalls:** Conflating UI design với brand design; không injecting brand context; insufficient logo quality

---

## ckm:design-system

**Purpose:** Create comprehensive design systems với color palettes, typography, spacing, components, Tailwind configs.

**USE when:**
- Starting new projects
- Establishing design consistency
- Creating component libraries

**Modes:** Semantic tokens / CSS variables / Tailwind configuration / Component specs

**Outputs:** Design tokens document; Tailwind config; component inventory

---

## ckm:logo-design

**Purpose:** AI-powered logo generation với 55+ styles, 30 color palettes, 25 industry guides dùng Gemini Nano Banana.

**USE when:**
- Creating logos
- Generating logo variations
- Exploring logo styles cho brands

**Subcommands:**
- `--design-brief`
- `--domain style|color|industry`
- `--generate`, `--style`, `--industry`

**Modes:** 55+ styles (minimalist, vintage, luxury, geometric, mascot, emblem, etc.)

**Outputs:** Logo design brief; AI-generated logo variations (PNG); HTML preview gallery

**Hard gates:** Always generate với white background; professional clone cho high-quality output

**Pitfalls:** Low-resolution output; style-industry mismatch; không requesting HTML preview cho comparison

---

## ckm:banner-design

**Purpose:** Multi-format banner design across social, ads, web, print với AI-generated visuals và responsive layouts.

**USE when:**
- Designing social media headers
- Ad banners
- Website hero sections
- Campaign creative assets

**Modes:** Minimalist, gradient, bold typography, photo-based, geometric, retro, glassmorphism, neon, editorial, 3D

**Outputs:** HTML/CSS banners; exported PNG files at exact platform specs; design options với variations

**Hard gates:**
- Match exact platform dimensions
- Text <20% cho ads
- Critical content trong safe zone (central 70-80%)

**Pitfalls:** Ignoring platform-specific safe zones; oversized text at small sizes; too many design elements cause cognitive overload

---

## ckm:cip-design

**Purpose:** Corporate Identity Program design với 50+ deliverables (business cards, signage, vehicles, apparel, packaging).

**USE when:**
- Creating complete brand identity packages
- Designing branded materials
- Generating CIP mockups với logo integration

**Subcommands:**
- `--cip-brief`
- `--domain deliverable|style|industry|mockup`
- `--set` (full CIP)
- `--model flash|pro`

**Outputs:** CIP brief; individual deliverable mockups; HTML presentation với specifications

**Hard gates:**
- Logo must be PNG/SVG nếu provided
- Use Pro model cho 4K text rendering on cards/signage

**Pitfalls:** Without logo, AI generates brand interpretation only; low-resolution logos look poor trong mockups

---

## ckm:kit-builder

**Purpose:** Build ClaudeKit components (skills, agents, commands, workflows) cho extending marketing capabilities.

**USE when:**
- Creating new marketing automation
- Extending kit functionality
- Building custom agents hoặc workflows

**Subcommands:** `skill`, `agent`, `command`, `workflow` creation templates

**Outputs:** Component files; templates; integration guides

**Hard gates:** Follow component decision tree; validate against schema; test before deployment

---

## ckm:assets-organizing

**Purpose:** Organize all marketing asset outputs into consistent directory structure by topic, date, naming conventions.

**USE when:**
- Generating assets, reports, content
- Anything needing consistent file organization

**Subcommands:** `--scan`, `--organize`, `--report`

**Outputs:** Organized directory structure at `assets/{category}/{date}-{slug}.*`

**Hard gates:**
- Maintain date format YYYYMMDD
- Use kebab-case slugs
- Never overwrite existing assets

**Pitfalls:** Inconsistent naming prevents bulk operations; deeply nested dirs are hard to navigate

---

## ckm:storage

**Purpose:** S3-compatible object storage cho marketing assets (Cloudflare R2, AWS S3, MinIO, Backblaze B2, DigitalOcean Spaces).

**USE when:**
- Uploading assets to cloud storage
- Syncing asset folders remotely
- Getting public URLs cho sharing

**Subcommands:** `upload`, `download`, `list`, `getUrl`, `delete`

**Configuration:** S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET trong `.env`

**Hard gates:** Credentials must be bucket-scoped tokens (least privilege); never logged hoặc exposed

**Pitfalls:** Exposing credentials trong version control; không using bucket prefixes cho organization

---

## ckm:debugging

**Purpose:** Systematic debugging framework cho marketing/campaign issues — finding root causes before fixes.

**USE when:**
- Encountering campaign issues
- Performance problems
- Unexpected marketing behavior

**Modes:** Four-phase framework (root cause investigation → pattern analysis → hypothesis testing → implementation); root cause tracing; defense-in-depth validation

**Hard gates:**
- Complete Phase 1 (root cause) before implementing fixes
- Run verification commands before claiming success

**Pitfalls:** "Quick fix" approach; fixing symptoms instead of root cause; skipping verification

**Difference from:**
- `ckm:debugging` = marketing/campaign focused
- Khác `ck:debug` (code/infrastructure issues)
