# Engineer — Mobile, Media & Browser Automation

Skills cho AI media generation, browser automation, media processing.

---

## ck:ai-artist

**Purpose:** Generate product mockups, marketing assets, brand visuals qua Nano Banana với 129 curated prompts.

**USE when:**
- Creating visual assets
- Searching prompt database
- Exploring styles

**DON'T use when:**
- Pixel-perfect brand work → `design-consultation`

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--mode search\|creative\|wild\|all` | Generation mode |
| `--provider auto\|google\|openrouter` | API provider selection |
| `--skip` | Bypass validation interview (use cẩn thận) |
| `-ar` | Aspect ratio |
| `--dry-run` | Preview only |

**Modes:** Search (best match) / Creative (remix top 3) / Wild (random transformation) / All (3 variations)

**Hard gates:** Validation interview mandatory (use `--skip` chỉ khi certain)

**Pitfalls:** Skipping validation without thought; không understanding wild mode randomness

**Difference from:**
- Khác `design-consultation` (design systems)
- `ai-artist` = asset generation

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/ai-artist

---

## ck:ai-multimodal

**Purpose:** Analyze và generate audio/video/images dùng Google Gemini (better vision than Claude).

**USE when:**
- Transcribing long audio (>15 min cần chunking)
- Analyzing images cho OCR/detection
- Processing 6h+ videos
- Generating Imagen images/Veo videos

**DON'T use when:**
- Claude's native vision suffices

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--task transcribe\|analyze\|extract\|generate\|generate-video\|generate-speech\|generate-music` | Task type |
| `--files <path>` | Input media |
| `--prompt <text>` | Instruction |
| `--provider google\|openrouter\|minimax` | Provider |
| `--model <name>` | Model selection |

**Modes:** Gemini analysis / Imagen + Nano Banana 2 generation / MiniMax video, TTS, music

**Inputs/Outputs:** Media files (20MB inline, 2GB File API) → markdown transcripts/JSON analysis/generated media

**Hard gates:**
- Audio >15min phải chunked (truncation risk)
- Transcripts output as markdown với timestamps

**Pitfalls:**
- Không chunking long audio
- Không verifying API key setup
- Output token limits on transcription

**Difference from:**
- Khác `chrome-devtools` (screenshots)
- `ai-multimodal` = image analysis

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/ai-multimodal

---

## ck:media-processing

**Purpose:** Process media dùng FFmpeg (video/audio), ImageMagick (images), RMBG (AI background removal).

**USE when:**
- Converting formats
- Resizing batches
- Extracting audio
- Removing backgrounds
- Generating thumbnails

**DON'T use when:**
- Single quick task (shell commands faster)

**Common flags:**
- **FFmpeg**: `-c:v libx264 -crf 22` (quality), `-vn` (video-only), `-c:a copy` (copy codec)
- **ImageMagick**: `-resize 800x` (maintain aspect), `-quality 85`
- **RMBG**: `-m briaai` (quality), `-m u2netp` (speed)

**Modes:** Single file hoặc batch processing (mogrify for in-place)

**Hard gates:**
- Always backup originals before batch processing
- Tool selection by task type

**Pitfalls:**
- Overwriting originals với mogrify
- Không checking disk space
- Format incompatibilities

**Difference from:**
- Khác `ai-multimodal` (cloud AI analysis)
- `media-processing` = local processing

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/media-processing

---

## ck:agent-browser

**Purpose:** Token-efficient browser automation (93% less context than Playwright) qua element references (@N syntax).

**USE when:**
- Autonomous sessions where token count matters
- Extended testing
- Cloud browsers (Browserbase)

**DON'T use when:**
- Quick screenshot/debug needed → `chrome-devtools`

**Subcommands:**
- `agent-browser open <url>`
- `agent-browser snapshot`
- `agent-browser click @2`
- `agent-browser type @5 "text"`
- `agent-browser -p browserbase` (cloud)

**Modes:** Local Chromium hoặc cloud (Browserbase); video recording for debugging; device emulation

**Hard gates:**
- `agent-browser install` required once
- `agent-browser skills get core` for workflow reference

**Pitfalls:** Confusing với Chrome DevTools (different purpose); không using @refs efficiently

**Difference from:**
- `agent-browser` = compact refs
- Khác `chrome-devtools` (verbose context vs compact tokens)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/agent-browser

---

## ck:chrome-devtools

**Purpose:** Automate browser interactions dùng Puppeteer CLI scripts cho screenshots, form fills, performance analysis.

**USE when:**
- Testing web apps
- Automating form workflows
- Debugging JS errors
- Analyzing Core Web Vitals
- Generating documentation screenshots

**DON'T use when:**
- Cần minimal token context → `agent-browser`

**Scripts:**
- `navigate.js`, `screenshot.js`, `aria-snapshot.js`
- `select-ref.js`, `fill.js`, `click.js`
- `evaluate.js`, `console.js`, `network.js`
- `performance.js`

**Modes:** Session persistence (browser stays running); headless on Linux/CI; headed on macOS/Windows (override với `--headless`)

**Hard gates:**
- Must run `npm install` in scripts dir
- Call `disconnectBrowser()` (keep running) hoặc `closeBrowser()` (end session)

**Pitfalls:**
- Không using ARIA snapshots for unknown page layouts
- Trying to run server directly (hangs)
- Missing session storage patterns

**Difference from:**
- `chrome-devtools` = detailed context
- Khác `agent-browser` (compact token usage)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/chrome-devtools
