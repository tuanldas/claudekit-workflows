# ClaudeKit Workflows

Interactive visualization of ClaudeKit skills, workflows, and docs. Built with Next.js 16 and Tailwind v4.

## Getting Started

```bash
npm install
npm run dev
```

Open <http://localhost:3001> (dev server defaults to 3001 in this repo, but Next.js will pick the first free port if it's busy).

## Admin Shell

The app is laid out as an admin shell that wraps every locale-aware route:

```
src/app/[locale]/layout.tsx          ← LanguageProvider + ThemeProvider + AdminShell
src/components/shell/                ← Sidebar, Topbar, Breadcrumb, CommandPalette, MobileDrawer, ThemeToggle
src/app/[locale]/workflows/          ← Workflows catalog (was /vi/[…])
src/app/[locale]/docs/               ← MDX docs viewer
src/app/[locale]/skills/             ← Skills catalog + detail
```

Shell features:

- **Sidebar** swaps its content based on the current section (workflows categories, docs tree, skills groups). Hidden below `lg` and surfaced via the mobile drawer.
- **Topbar** with breadcrumb, locale switcher (`VI`/`EN`), command palette trigger, and theme toggle (`light → dark → system`). Selection persists across reloads via `localStorage`.
- **Command palette** (`Cmd+K` / `Ctrl+K`) — fuzzy search across workflows, docs, and skills with grouped results and recent-search history.
- **Mobile drawer** — slides in the same sidebar nav from the left; closes on backdrop click, Escape, or category nav.

### Locale routing — breaking change

`/` no longer renders the workflows page directly. The proxy redirects:

| Incoming URL                | Redirected to                       |
| --------------------------- | ----------------------------------- |
| `/`                         | `/vi` → `/vi/workflows` (default)   |
| `/vi`                       | `/vi/workflows`                     |
| `/en`                       | `/en/workflows`                     |
| `/docs/...` (no locale)     | `/vi/docs/...`                      |

External links pointing at the old bare `/vi` URL still resolve to the workflows catalog; bookmarks pointing inside a section are unaffected.

## Development Commands

```bash
npm run dev               # Next.js dev server (port 3001)
npm run build             # Full build: skills index → search index → next build
npm run start             # Production server
npm run lint              # ESLint
npm run test              # Vitest watch
npm run test:run          # Vitest single run
npm run test:e2e          # Playwright E2E suite (desktop + mobile projects)
npm run test:e2e:install  # One-time Playwright Chromium download
npm run test:e2e:a11y     # Just the axe-core accessibility specs
npm run test:e2e:report   # Open the last HTML report
```

### E2E specifics

Specs live under `e2e/`. The Playwright `globalSetup` step rebuilds `src/data/skills-index.json` from `e2e/fixtures/skills/**/SKILL.md`, so the catalog is deterministic regardless of the developer's `~/.claude/skills` directory.

Critical/serious axe violations gate the build; `color-contrast` is currently surfaced as informational (brand colors on the CK logo and muted section headings — addressable in a future design pass).

## Deployment

The app is a standard Next.js 16 build. Deploy on Vercel with one click, or any host that runs `npm run build` + `npm start`.

## Reference Docs

See `docs/` for the full ClaudeKit reference (commands, skills, workflows). The decision trees in `docs/vi/claudekit-overview.md` are the fastest way to learn which workflow to start with.
