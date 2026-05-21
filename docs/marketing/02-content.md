# Marketing — Content Creation Skills

Content writing, copywriting, slides, creativity tools.

---

## ckm:write

**Purpose:** Multi-purpose content creation skill covering blog posts, CRO optimization, email copy, publishing workflows.

**USE when:**
- Creating long-form content (blogs)
- Optimizing existing copy
- Writing formula-based copy
- Enhancing weak copy
- Generating publish-ready content
- Auditing content quality
- Creating blog posts từ YouTube videos

**DON'T use when:**
- Need just single sentence/tagline → `copywriting`
- Only strategic advice → `ask`

**Subcommands (ALL 9):**
| Sub | Action |
|-----|--------|
| `:audit` | Audit content quality vs copywriting + SEO + platform standards |
| `:blog` | SEO-optimized blog content |
| `:blog-youtube` | SEO blog article từ YouTube video |
| `:cro` | Analyze content + optimize cho conversion |
| `:enhance` | Analyze copy issues + enhance |
| `:fast` | FAST mode (sacrifice polish cho speed) |
| `:good` | GOOD mode (longer, higher quality) |
| `:formula` | Generate dùng proven formulas (AIDA, PAS, BAB, etc.) |
| `:publish` | Audit + auto-fix + output publish-ready |

**Outputs:**
- Blogs → `assets/content/{date}-{slug}.md`
- CRO → `assets/content/{date}-{slug}-cro.md`
- Audit reports → `assets/reports/content/{date}-{audit}.md`
- Publish-ready → `assets/content/{date}-{slug}-publish.md`

**Pitfalls:**
- Fast mode sacrifices polish
- Không dùng formula mode cho brand-specific tone without context
- YouTube video phải accessible cho blog-youtube

**Difference from:**
- `ckm:write` = long-form (blogs, content)
- Khác `ck:copywriting` (short: taglines, ad copy)
- `:publish` includes auto-fix
- `:audit` chỉ analysis

**Docs:** https://docs.claudekit.cc/docs/marketing/skills/write

---

## ckm:copywriting

→ See engineer/11-coordination.md (shared skill)

**Quick recap:** Short-form copy formulas (AIDA, PAS, BAB, 4Ps, 4Us, FAB); 50+ writing styles; headline templates; email/landing page patterns

---

## ckm:content-marketing

**Purpose:** Content strategy, editorial calendars, pillar mapping, blog planning, content audits, repurposing workflows.

**USE when:**
- Planning content programs
- Creating editorial calendars
- Auditing existing content
- Designing topic clusters

**Modes:** Content strategy / Blog planning / Audit workflow / Repurposing cascade

**Outputs:** Content strategy doc; editorial calendar; audit report với keep/update/consolidate/redirect decisions

**Hard gates:**
- Define 3-5 content pillars aligned to business
- Ensure content matches buyer journey stage

**Pitfalls:** Publishing without clear intent; no measurement against business goals; neglecting evergreen content updates

---

## ckm:content-hub

**Purpose:** Visual asset gallery cho browsing, searching, filtering, generating marketing assets với brand context.

**USE when:**
- Exploring existing assets
- Searching cho content
- Generating new assets
- Organizing asset library

**Subcommands:** `open`, `browse`, `search`, `--scan` (rescan assets)

**Outputs:** Visual grid, filterable gallery, brand sidebar với colors/voice

**Hard gates:** Requires `brand-guidelines.md` cho context injection

---

## ckm:slides

**Purpose:** Create strategic HTML presentations với Chart.js data visualization, design tokens, responsive layouts, copywriting formulas.

**USE when:**
- Building marketing presentations
- Creating pitch decks
- Designing data-driven slides
- Developing strategic narratives

**Subcommands:** `create`, layout patterns, copywriting formulas, slide strategies

**Modes:** Marketing presentations / Pitch decks / Data-heavy slides / Strategic narratives

**Outputs:** HTML presentation file với Chart.js charts, responsive design, brand-consistent styling

**Hard gates:**
- One idea per slide
- Data-driven charts only
- Copywriting aligned to slide purpose

**Pitfalls:** Text-heavy slides; too many data points per chart; không matching presentation to audience

---

## ckm:creativity

**Purpose:** Creative direction intelligence với 55 styles, 18 platforms, 12 voiceover types, 17 music genres cho campaign planning.

**USE when:**
- Planning ads, videos, social content
- Developing creative briefs
- Selecting visual styles
- Choosing audio direction

**Subcommands:**
- `--creative-brief` (recommended start)
- `--domain style|platform|voiceover|music|reasoning`

**Modes:** 55+ visual styles (minimalist, cinematic, UGC, luxury, futuristic, etc.); platform-specific specs

**Outputs:** Creative brief với recommended styles, platform specs, voiceover/music direction, anti-patterns

**Hard gates:**
- Always start với `--creative-brief`
- Validate 3-second hook cho video content

**Pitfalls:**
- Confusing polished với engaging (92% prefer authentic)
- Ignoring platform specs
- Too many visual elements
