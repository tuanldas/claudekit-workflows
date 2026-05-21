# Engineer — Documentation, Diagrams & Office Files

Skills cho docs management, diagrams, file generation (Excel/PDF/Word/PowerPoint).

---

## ck:docs

**Purpose:** Initialize, update, summarize project documentation — LLMs.txt generation, codebase analysis.

**USE when:**
- Creating initial docs
- Generating llms.txt
- Updating existing documentation
- Analyzing codebase

**DON'T use when:**
- Mintlify site building → `mintlify`

**Subcommands:**
| Sub | Action |
|-----|--------|
| `init` | Create initial documentation |
| `llms` | Generate llms.txt |
| `summarize` | Quick codebase analysis |
| `update` | Comprehensive docs update |

**Inputs/Outputs:** Analyzes codebase → README, API docs, architecture docs, llms.txt

**Hard gates:** Git repo với code; understanding documentation structure

**Pitfalls:** Skipping llms.txt generation (needed for AI context); outdated docs without regular updates

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/docs

---

## ck:docs-seeker

**Purpose:** Search technical documentation via llms.txt standard (context7.com) — library docs, features, components, concepts; auto-agent distribution strategy.

**USE when:**
- Looking up library/framework docs
- Finding specific features
- Discovering documentation
- Multi-agent research

**DON'T use when:**
- General knowledge questions → `research`

**Scripts (Zero-Token Execution):**
- `detect-topic.js` - Classify query type (topic-specific vs general)
- `fetch-docs.js` - Retrieve documentation (auto URL construction, fallback chains)
- `analyze-llms-txt.js` - Recommend agent distribution (1/3/7 agents, phased)

**Modes:**
- Topic-specific search (10-15s)
- General library search (30-60s)
- Repository analysis (fallback)

**Hard gates:** Scripts must be executable; internet access cho context7.com

**Pitfalls:** Manual URL construction (use scripts); expecting local-only sources; ignoring agent distribution recommendations

**Difference from:**
- `docs-seeker` = documentation-specific qua llms.txt
- Khác `research` (general knowledge)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/docs-seeker

---

## ck:llms

**Purpose:** Generate llms.txt files (LLM-friendly markdown indexes) theo llmstxt.org spec cho project documentation và AI discoverability.

**USE when:**
- Publishing docs site
- Want LLM-friendly index
- Creating AI context files

**DON'T use when:**
- No docs directory
- Hosting/SEO concerns
- Robotics/sitemaps needed

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--full` | Also generate `llms-full.txt` với inline doc content |
| `--output path` | Custom output location (default: project root) |
| `--url base` | Base URL prefix cho links (e.g., `https://example.com/docs`) |
| (default) | Scan `./docs` directory |

**Modes:** Compact (llms.txt) / Full (llms-full.txt với inline content)

**Outputs:**
- `llms.txt` — curated index với links + descriptions
- `llms-full.txt` (nếu `--full`) — expanded với doc inline content

**Hard gates:**
- H1 heading required
- Blockquote summary recommended
- All links in `[title](url)` format
- Optional skippable section at end
- Concise descriptions, no jargon

**Pitfalls:** Missing H1 hoặc blockquote (incomplete per spec); inconsistent descriptions; broken links; over-jargon

---

## ck:preview

**Purpose:** View files hoặc generate visual explanations, diagrams, slides, HTML visualizations với theme toggle, responsive design.

**USE when:**
- Code walkthroughs
- Architecture visualization
- Presentation slides
- Visual diffs
- Project recaps

**DON'T use when:**
- Text-only explanations suffice
- No visualization needed

**Generation modes (Markdown):**
| Flag | Output |
|------|--------|
| `--explain` | Visual explanation (ASCII + Mermaid + prose) |
| `--slides` | Presentation slides (1 concept/slide) |
| `--diagram` | Focused diagram (ASCII + Mermaid) |
| `--ascii` | Terminal-friendly ASCII only |

**Generation modes (HTML):**
| Flag | Output |
|------|--------|
| `--html --explain` | Self-contained HTML explanation |
| `--html --slides` | Magazine-quality slide deck |
| `--html --diagram` | HTML diagram với zoom |
| `--html --diff [ref]` | Visual diff review (git diff) |
| `--html --plan-review [plan-file]` | Plan vs codebase comparison |
| `--html --recap [timeframe]` | Project context snapshot |

**View modes:**
| Input | Action |
|-------|--------|
| `<file.md>` | View markdown novel-reader UI |
| `<directory/>` | Browse directory |
| `--stop` | Stop running server |

**Hard gates:**
- HTML mode MUST include light/dark theme toggle (CSS + JS, exact pattern từ `html-css-patterns.md`)
- `--html` generation requires reference loads
- Multi-section pages require `html-responsive-nav.md`
- `--diff` requires git repo + valid ref
- `--plan-review` requires plan file hoặc active plan context
- `--recap` requires git history

**Pitfalls:**
- Missing theme toggle in HTML (incomplete per spec)
- `--html --ascii` unsupported
- Unresolvable path hoặc no generation flag
- Topic sanitization empty (asks for alphanumeric topic)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/preview

---

## ck:mermaidjs-v11

**Purpose:** Create text-based diagrams (flowcharts, sequences, ER, Gantt, state, journey) exportable to SVG/PNG/PDF.

**USE when:**
- Documenting architecture
- Visualizing flows
- Designing schemas
- Creating timelines
- Version-controlling diagrams

**DON'T use when:**
- Need pixel-perfect design → use Figma

**CLI:**
- `mmdc -i diagram.mmd -o diagram.svg`
- `-t dark` (theme), `-b transparent` (background)
- `--cssFile style.css`

**Modes:** Inline markdown / Standalone .mmd files / JavaScript integration

**Hard gates:** Proper diagram-type declaration required (flowchart, not flow)

**Pitfalls:** Typos in diagram type; unbalanced quotes/brackets; complex filtergraphs without testing

**Difference from:**
- `mermaidjs-v11` = text-based
- Khác `excalidraw` (visual canvas)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/mermaidjs-v11

---

## ck:markdown-novel-viewer

**Purpose:** View markdown trong calm, book-like reader over HTTP với auto-rendered Mermaid diagrams.

**USE when:**
- Reviewing long-form docs
- Exploring plan hierarchies
- Reading RFCs/runbooks in distraction-free mode

**DON'T use when:**
- Quick text review (raw markdown fine)

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--file <path>` | Single file viewer |
| `--dir <path>` | Directory browser |
| `--port <number>` | Default 3456 |
| `--host <addr>` | Localhost |
| `--open` | Auto-open browser |
| `--background` | Run in background |
| `--stop` | Stop server |

**Modes:** Single file viewer hoặc directory browser

**Hard gates:** npm dependencies required (marked, highlight.js, gray-matter)

**Pitfalls:** Missing npm install (Error 500); stale PID files; image path issues (relative to markdown file)

**Difference from:**
- `markdown-novel-viewer` = reading
- Khác `plans-kanban` (dashboard)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/markdown-novel-viewer

---

## ck:xlsx, pdf, docx, pptx (Office Files)

**Purpose:** Create/edit Office files programmatically — Excel formulas, PDF forms, Word docs, PowerPoint presentations.

**Use cases:**
| Skill | When |
|-------|------|
| `ck:xlsx` | Excel formulas, charts, data analysis, financial models |
| `ck:pdf` | PDF text extraction, form filling, multi-page PDFs |
| `ck:docx` | Word documents với paragraphs, tables, styles |
| `ck:pptx` | PowerPoint slides với text, images, animations |

**Common pattern:** Each tool follows similar structure — install dependency (openpyxl/pypdf/python-docx/python-pptx), use scripts to manipulate.

**Hard gates:** Python venv với dependencies installed; backup originals before modify

---

## ck:document-skills

**Purpose:** Generic skill cho document manipulation across formats.

**USE when:**
- Cross-format document workflows
- Bulk document operations

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/document-skills
