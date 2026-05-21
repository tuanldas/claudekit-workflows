# Marketing — Email, Social, Video & Audio Skills

Communication channels: email, social media, video production, audio.

---

## ckm:email

**Purpose:** Email content creation, automation flows, drip sequences, subject line optimization, deliverability management.

**USE when:**
- Creating email campaigns
- Designing automation flows
- Writing drip sequences
- Optimizing subject lines
- Setting up nurture campaigns

**DON'T use when:**
- Need full campaign coordination → `campaign`
- Just want landing page → `form-cro`
- Building social media content → `social`

**Subcommands:**
| Sub | Action |
|-----|--------|
| `:flow` | Generate complete email automation sequence |
| `:sequence` | Generate complete email drip sequence với copy |

**Email types:** newsletter, cold, followup, launch, nurture, welcome, winback

**Outputs:** Email copy → `assets/copy/emails/{date}-{type}-{slug}.md`

**Hard gates:**
- Clear audience definition
- Clear CTA/goal
- Compliance với email regulations (CAN-SPAM, GDPR)

**Pitfalls:**
- Too many emails in sequence → unsubscribes
- Subject lines triggering spam filters
- Missing value prop in body
- CTA not aligned với audience expectation

**Difference from:**
- Khác `campaign` (email = channel-specific; campaign = multi-channel)
- Khác `copywriting` (email = longer-form sequences; copywriting = short microcopy)
- Khác `write` (email = structure + copy; `write:cro` = optimization-focused)

**Docs:** https://docs.claudekit.cc/docs/marketing/skills/email

---

## ckm:social

**Purpose:** Social media content creation, scheduling, platform-specific optimization cho X/Twitter, LinkedIn, Instagram, TikTok, YouTube, Threads, Facebook.

**USE when:**
- Creating posts cho social platforms
- Scheduling content
- Optimizing cho platform-specific best practices
- Writing hooks và threads

**DON'T use when:**
- Need email content → `email`
- Building landing pages → `form-cro`
- Creating full campaign → `campaign`

**Subcommands:**
- `:schedule` - Schedule social media posts

**Platforms:** twitter/x, linkedin, instagram, tiktok, youtube, facebook, threads
**Content types:** post, thread, carousel, story, reel

**Outputs:** Posts → `assets/posts/{platform}/{date}-{slug}.md`

**Hard gates:** Platform-specific authentication cho scheduling; character limits respected per platform

**Pitfalls:**
- Same content across all platforms without adaptation
- Ignoring character limits
- Overusing hashtags
- Posting at wrong times
- Không testing different hooks

**Difference from:**
- Khác `write` (social = platform-optimized; write = general content)
- Khác `paid-ads` (social = organic; paid-ads = paid media)

---

## ckm:video

**Purpose:** Video production: script writing, storyboard creation, AI video generation với Veo 3.1, platform optimization, SEO.

**USE when:**
- Writing video scripts
- Creating storyboards
- Generating AI videos
- Optimizing cho platforms (YouTube/TikTok)
- Designing thumbnails
- Optimizing video SEO

**DON'T use when:**
- Just want video strategy → `launch-strategy`
- Editing existing video
- Creating brand identity → `brand`

**Subcommands:**
| Sub | Action |
|-----|--------|
| `:create` | Create video dùng Veo 3.1 |
| `:script-create` | Production-ready video script |
| `:storyboard-create` | Storyboard cho video content |

**Video types & specs:** Explainer, product demo, short-form, testimonial (với platform-specific cho YouTube, TikTok, Instagram, LinkedIn)

**Outputs:**
- Scripts → `assets/video/{date}-{title}-script.md`
- Storyboards → `assets/video/{date}-{title}-storyboard.md`
- Generated videos → `assets/video/generated/{date}-{title}.mp4`

**Hard gates:** Clear video concept; platform target; Veo 3.1 API access (cho create)

**Pitfalls:**
- Scripts without visual direction
- Storyboards không match script
- Ignoring platform aspect ratios
- Không optimizing cho mobile viewing
- Weak hooks trong first 3 seconds

**Difference from:**
- Khác `social` (video = long-form; social = short-form)
- Khác `write` (video = visual + text; write = text only)
- Khác `content-marketing` (video = format; content-marketing = channel)

---

## ckm:youtube

**Purpose:** Repurpose YouTube videos thành blog posts, infographics, social content via VidCap.xyz API.

**USE when:**
- Converting video content to multiple formats
- Extracting transcripts/captions
- Generating summaries
- Analyzing comments

**Subcommands:**
| Sub | Action |
|-----|--------|
| `blog` | SEO post từ video |
| `infographic` | Visual summary |
| `social` | Multi-platform posts |

**Outputs:** Blog post, infographic design, social media variants với captions

**Hard gates:** Video must be public; respect copyright

**Pitfalls:** Poor transcription accuracy; không optimizing blog posts cho SEO; ignoring platform-specific formats

---

## ckm:youtube-thumbnail-design

**Purpose:** Design eye-catching YouTube thumbnails với AI-generated visuals và proven design patterns.

**USE when:**
- Creating YouTube thumbnails
- A/B testing thumbnail designs
- Optimizing click-through rates

**Inputs/Outputs:** Video title, topic, brand context → Thumbnail design options (1280x720px), exported PNG files

**Hard gates:**
- 1280x720px export
- High contrast
- Minimal text (2-3 words max)
- Central focal point

**Pitfalls:** Too much text; poor contrast trong small preview; inconsistent branding

---

## ckm:elevenlabs

**Purpose:** AI audio generation (text-to-speech, voice cloning, sound effects, music, conversational agents).

**USE when:**
- Creating voiceovers
- Cloning voices
- Generating sound effects
- Building voice agents

**Models:**
| Model | Use case |
|-------|----------|
| **Multilingual v2** | High-quality multilingual TTS |
| **Flash v2.5** | Real-time agents |
| **Turbo v2.5** | Fast generation |
| **Eleven v3** | Latest with voice design |

**Modes:** Text-to-speech / Instant voice clone / Professional clone / Voice design / Sound effects / Music generation

**Outputs:** Generated audio files trong multiple formats, voice IDs, streaming endpoints

**Hard gates:**
- Professional clones require 30+ min audio
- Flash models best cho real-time agents

**Pitfalls:** Poor recording quality → poor clones; too many voice changes confuse listeners
