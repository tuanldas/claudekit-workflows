# Engineer — Frontend Development Skills

Skills cho React, Next.js, frameworks, styling, 3D, video, docs sites.

---

## ck:frontend-development

**Purpose:** Modern React/TypeScript development với Suspense, lazy loading, MUI v7, TanStack patterns.

**USE when:**
- Building React components, features, routes
- Suspense-based data fetching
- Performance optimization

**DON'T use when:**
- Non-React frontends
- Backend-heavy work

**Subcommands/Flags:**
- Component checklist (lazy load, Suspense, useSuspenseQuery, proper imports)
- Feature checklist (directory structure, api/, components/, hooks/, helpers/, types/)

**Modes:** Component patterns, Data fetching (useSuspenseQuery), File organization, Styling (inline <100 lines, separate >100), Routing (TanStack Router), Loading/Error states (no early returns), Performance

**Inputs/Outputs:** User describes component/feature → TypeScript code following patterns, import aliases (@/, ~types, ~components, ~features)

**Hard gates:** React 18+, TypeScript strict mode, MUI v7, vite.config.ts với alias setup

**Pitfalls:**
- Using isLoading early returns (breaks CLS)
- Ignoring Suspense boundaries
- Mixing async/await vs useAsync patterns

**Difference from:**
- Khác `web-frameworks` (broader Next.js/Turborepo)
- `frontend-development` = React-only focus

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/frontend-development

---

## ck:web-frameworks

**Purpose:** Build full-stack apps với Next.js (App Router, RSC, SSR, ISR), Turborepo monorepos, RemixIcon.

**USE when:**
- Creating full-stack web apps
- Monorepos
- Server-side rendering, optimization strategies

**DON'T use when:**
- Frontend-only → `frontend-development`
- Backend-only → `backend-development`

**Modes:** Single App (Next.js + RemixIcon) / Monorepo (Next.js + Turborepo + RemixIcon)

**Hard gates:** Node.js 18+, npm/pnpm; understanding SSR vs SSG vs ISR

**Pitfalls:** Over-engineering small projects với Turborepo; mixing server/client component patterns; ignoring caching

**Difference from:**
- Khác `frontend-development` (React-only)
- `web-frameworks` = broader scope including backend, monorepo, framework selection

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/web-frameworks

---

## ck:ui-styling

**Purpose:** Style UIs với shadcn/ui (Radix + Tailwind), themes, dark mode, responsive layouts, design systems.

**USE when:**
- Building accessible components
- Designing responsive layouts
- Theming, design systems

**DON'T use when:**
- Non-React (shadcn is React-only)
- Pure data visualization

**Modes:** Component + Tailwind setup / Tailwind-only setup (Vite)

**Hard gates:** React framework; Tailwind CSS configured; shadcn/ui initialized via CLI

**Pitfalls:** Mixing arbitrary values excessively; forgetting dark mode variants; over-customizing theme

**Difference from:**
- Khác `frontend-development` (full component dev)
- `ui-styling` = styling-specific

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/ui-styling

---

## ck:react-best-practices

**Purpose:** Apply 45 React/Next.js performance rules từ Vercel Engineering across 8 categories by impact.

**USE when:**
- Reviewing code for performance
- Optimizing bundles
- Eliminating waterfalls
- Improving rendering

**DON'T use when:**
- Non-React code

**Rule Categories (by impact):**
- **CRITICAL**: Eliminating waterfalls, bundle size
- **HIGH**: Server-side performance
- **MEDIUM**: Client data fetching, re-renders, rendering
- **LOW-MEDIUM**: JavaScript performance
- **LOW**: Advanced patterns

**Hard gates:** React/Next.js codebase; understanding waterfalls và bundle analysis

**Pitfalls:** Applying low-impact rules first; ignoring waterfalls (most impactful); over-memoizing

**Difference from:**
- Khác `frontend-development` (general dev)
- `react-best-practices` = performance rules-focused

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/react-best-practices

---

## ck:tanstack

**Purpose:** Build full-stack React với TanStack Start (file routing + server functions), Form (headless + Zod), AI (streaming/chat).

**USE when:**
- Creating TanStack projects, routes, server functions
- Forms, AI chat features

**DON'T use when:**
- Using TanStack Query/Table/Virtual (different skills)
- Non-React projects

**Frameworks:**
- **TanStack Start**: Full-stack React (file-based routing, server functions)
- **TanStack Form**: Headless form với sync/async validators
- **TanStack AI**: Streaming + chat (OpenAI, Anthropic, Google, Ollama)

**Modes:** Project setup, Server functions, Routes + loaders, Middleware, Forms, AI chat

**Hard gates:** TypeScript; Vite/Build system; Zod/Valibot for validation

**Pitfalls:** Mixing TanStack Start với Next.js patterns; server functions not type-safe; form state management

**Difference from:**
- Khác `web-frameworks` (broader Next.js/Turborepo)
- `tanstack` = TanStack-specific

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/tanstack

---

## ck:threejs

**Purpose:** Build 3D web experiences với Three.js — WebGL/WebGPU scenes, GLTF models, animations, physics, VR/XR với 556 searchable examples.

**USE when:**
- Creating 3D scenes
- Loading models, animations, physics
- VR/XR, particle effects, shaders

**DON'T use when:**
- 2D graphics only

**Search subcommands:**
- `python3 search.py "<query>"` - Find examples/API
- `--domain [examples|api|use-cases|categories]` - Search scope
- `--category [webgl|webgpu|physics|webxr|etc]` - Filter category
- `--complexity [low|medium|high]` - Filter complexity

**Modes:** Examples (code snippets) / API (class reference) / Use-cases (project recommendations)

**Hard gates:** WebGL/WebGPU browser support; 3D modeling knowledge helpful

**Pitfalls:** Ignoring LOD for complex scenes; not batching geometry; over-rendering for mobile

**Difference from:**
- `threejs` = full 3D pipeline
- Khác `shader` (GLSL-focused only)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/threejs

---

## ck:shader

**Purpose:** Write GLSL fragment shaders cho procedural graphics — shapes (SDF), patterns, noise, colors, animations.

**USE when:**
- Procedural textures, visual effects
- Generative art
- WebGL shaders, Three.js custom shaders

**DON'T use when:**
- Raster graphics
- Non-GPU work

**Modes:** Shapes (SDF circles, rectangles, polygons), Patterns (tiling, symmetry, domain warping), Noise (Perlin, Simplex, cellular), Colors (RGB, HSB, gradients), Animations, Procedural textures

**Hard gates:** GLSL knowledge; WebGL/WebGPU capable browser; uniforms (u_time, u_resolution, u_mouse)

**Pitfalls:** Inefficient noise implementations; unnecessary branching (GPU dislikes conditionals); underestimating precision

**Difference from:**
- Khác `threejs` (full 3D pipeline)
- `shader` = GLSL-focused

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/shader

---

## ck:remotion

**Purpose:** Build programmatic video content trong React — animations, compositions, data-driven rendering, captions, audio.

**USE when:**
- Generating videos programmatically
- Data-driven video content
- Animated sequences

**DON'T use when:**
- Manual video editing
- Non-React approaches

**Rule Topics:** 3D, animations, assets (images/video/audio/fonts), audio, captions, charts, compositions, Lottie, sequencing, text animations, timing, transitions, trimming, videos

**Hard gates:** React knowledge; Remotion CLI installed; FFmpeg for rendering

**Pitfalls:** Ignoring performance (Remotion renders every frame); oversized assets; inefficient animations

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/remotion

---

## ck:mintlify

**Purpose:** Build và maintain Mintlify documentation sites — docs.json config, MDX components, API docs, deployment, AI features.

**USE when:**
- Creating/managing Mintlify docs
- API documentation
- Site customization, deployment

**DON'T use when:**
- General markdown docs without Mintlify

**CLI Commands:**
- `mint new` - Initialize docs
- `mint dev` - Local preview (port 3000)
- `mint validate` - Config validation
- `mint broken-links` - Link checking
- `mint openapi-check` - OpenAPI validation

**Modes:** MDX content (frontmatter + components), API docs (OpenAPI/AsyncAPI), Navigation (products/versions/languages), Theming (7 themes), Deployment (GitHub/GitLab/Vercel)

**Hard gates:** Node.js 18+, Mintlify CLI, valid docs.json

**Pitfalls:** Invalid OpenAPI specs; broken MDX component usage; missing navigation groups

**Difference from:**
- `mintlify` = site builder
- Khác `docs` (documentation content generation)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/mintlify

---

## ck:web-design-guidelines

**Purpose:** Review UI code against Web Interface Guidelines for compliance (accessibility, UX, best practices).

**USE when:**
- "Review my UI", "check accessibility"
- "Audit design", "review UX"

**DON'T use when:**
- UI generation → `ui-styling`

**Inputs/Outputs:** Fetches latest guidelines từ GitHub; user provides files; outputs findings in terse `file:line` format

**Hard gates:** File paths must exist; guidelines source reachable

**Pitfalls:** Assume guidelines static (fetched fresh each run); không understand output format

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/web-design-guidelines

---

## ck:web-testing

**Purpose:** Comprehensive web testing — unit (Vitest), integration, E2E (Playwright), load (k6), security, visual, accessibility.

**USE when:**
- Test automation
- Flakiness debugging
- Core Web Vitals, mobile gestures
- Cross-browser testing

**DON'T use when:**
- Production runtime (testing only)

**Subcommands/Flags:**
- `npx vitest run` - Unit tests
- `npx playwright test [--ui]` - E2E tests
- `k6 run load-test.js` - Load tests
- `npx @axe-core/cli <url>` - Accessibility
- `npx lighthouse <url>` - Performance

**Modes:** Unit (Vitest), Integration (browser mode), E2E (Playwright), Load (k6), Contract (Pact), A11y (axe-core)

**Hard gates:** Test framework installed; browsers downloadable (for Playwright); CI secrets for remote testing

**Pitfalls:** Unit-only focus (insufficient coverage); flaky timeouts; ignoring real device testing

**Difference from:**
- Khác `backend-development` (API testing)
- `web-testing` = frontend testing

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/web-testing

---

## ck:mobile-development

**Purpose:** Build mobile apps với React Native, Flutter, Swift/SwiftUI, Kotlin/Compose — iOS/Android, UX, performance, offline, deployment.

**USE when:**
- Building iOS/Android apps
- Mobile UX design
- Performance optimization
- App store deployment

**DON'T use when:**
- Web-only projects → `frontend-development`

**Frameworks:**
| Framework | Khi nào |
|-----------|---------|
| **React Native** | JavaScript expertise, web code sharing (121K stars, 35% adoption) |
| **Flutter** | Performance-critical, complex animations (170K stars, 46% adoption) |
| **Swift/SwiftUI** | iOS-only, 100% native |
| **Kotlin/Jetpack Compose** | Android-only, 100% native, Material Design 3 |

**Modes:** Cross-platform (React Native/Flutter) / Native (Swift/Kotlin) / Testing (Detox/Espresso/XCUITest)

**Hard gates:** Platform SDK (Xcode/Android Studio); real device testing required before release

**Pitfalls:** Testing only simulators (performance lies); ignoring offline-first; over-engineering simple apps; hardcoded credentials

**Difference from:**
- Khác `frontend-development` (web frontend)
- `mobile-development` = mobile-specific constraints

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/mobile-development
