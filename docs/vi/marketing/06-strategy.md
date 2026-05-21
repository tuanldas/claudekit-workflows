# Marketing — Strategy, Research & Branding

Skills cho marketing strategy, market research, psychology, pricing, personas, branding.

---

## ckm:marketing-planning

**Purpose:** Create detailed marketing strategies và campaign plans dùng RACE, SOSTAC, STP frameworks với market research integration.

**USE when:**
- Planning marketing strategies
- Creating content calendars
- Developing positioning
- Designing customer acquisition funnels
- Evaluating marketing trade-offs

**DON'T use when:**
- Just need research → `marketing-research`
- Only want copy → `write`
- Creating single campaign → `campaign`

**Workflow phases:**
1. Market research (skip if provided)
2. Brand & context understanding
3. Strategy design
4. Plan creation & organization
5. Task breakdown & output standards

**Outputs:**
- Plans → `docs/docs/plans/{date}-campaign-name/plan.md`
- Research → `docs/docs/plans/{date}-campaign-name/research/`
- Briefs → `docs/docs/plans/{date}-campaign-name/reports/`

**Hard gates:** Clear business objective; brand guidelines document; market understanding

**Pitfalls:**
- Plans without execution strategy
- Missing competitive differentiation
- Plans không respect brand guidelines
- Misaligned channel selection với audience
- Insufficient budget allocation detail

**Difference from:**
- Khác `marketing-research` (planning = execution; research = discovery)
- Khác `campaign` (planning = broader strategy; campaign = executes)
- Khác `launch-strategy` (planning = full year+; launch = event-focused)

---

## ckm:marketing-research

**Purpose:** Multi-source market research covering trends, competitors, audience insights, campaign benchmarks với systematic analysis và reporting.

**USE when:**
- Researching market trends
- Analyzing competitors
- Gathering audience insights
- Finding campaign benchmarks
- Validating assumptions

**DON'T use when:**
- Just need quick answers → `ask`
- Creating campaign → `campaign`
- Strategic advice only → `brainstorm`

**Research phases:**
1. Scope definition (target segments, competitive boundaries, KPIs)
2. Systematic information gathering (search, content analysis, validation)
3. Analysis and synthesis
4. Report generation

**Outputs:** Reports → `assets/reports/research/{date}-{topic}.md`

**Hard gates:**
- Clear scope definition
- **Max 5 research tool calls per task**

**Pitfalls:**
- Over-researching without time limits
- Conflating correlation with causation
- Using outdated sources
- Không validating across independent sources
- Scope creep

**Difference from:**
- Khác `competitor` (specific rival vs broader research)
- Khác `marketing-planning` (research = gathering; planning = strategy)
- Khác `ask` (research = broad discovery; ask = focused Q&A)

---

## ckm:marketing-psychology

**Purpose:** Apply 70+ psychological principles và mental models cho marketing decisions cho better customer behavior understanding và ethical persuasion.

**USE when:**
- Understanding why customers buy
- Designing persuasive campaigns
- Reducing friction
- Optimizing decision-making
- Applying behavioral science

**DON'T use when:**
- Just need copy → `write`
- Want general strategy → `marketing-planning`
- Need data analysis → `analytics`

**Model categories:**
- **Foundational thinking**: First Principles, JTBD, Inversion, Pareto
- **Buyer psychology**: Confirmation Bias, Mimetic Desire, Endowment Effect
- **Persuasion**: Reciprocity, Scarcity, Authority, Social Proof
- **Pricing psychology**: Charm Pricing, Mental Accounting, Rule of 100
- **Design & delivery**: AIDA, BJ Fogg Model, Nudge Theory
- **Growth models**: Feedback Loops, Network Effects, Flywheel

**Outputs:** Recommendations, model applications, implementation guidance

**Pitfalls:**
- Misapplying models without context
- Using dark patterns unethically
- Assuming all buyers behave identically
- Ignoring cultural differences

**Difference from:**
- Khác `write` (psychology informs; write creates content)
- Khác `marketing-planning` (psychology informs; planning executes)
- Khác `marketing-research` (psychology = timeless principles; research = current trends)

---

## ckm:marketing-ideas

**Purpose:** 140 proven marketing tactics organized by category (content, paid, social, email, partnerships, events, PR, launches, PLG, etc.).

**USE when:**
- Brainstorming marketing strategies
- Finding tactics cho specific goals
- Evaluating channel options

**Modes:** Content & SEO, competitor analysis, free tools, paid ads, social media, email, partnerships, events, PR, launches, product-led growth, content formats, unconventional tactics

**Outputs:** Recommended tactics với implementation steps, resource requirements, expected outcomes

**Hard gates:** Match tactics to stage và budget constraints

**Pitfalls:** Overloading với too many concurrent tactics; không matching budget to channel

---

## ckm:persona

**Purpose:** Customer persona creation, audience analysis, ICP (Ideal Customer Profile) management.

**USE when:**
- Creating customer personas
- Analyzing audience segments
- Defining ICPs
- Updating persona data

**DON'T use when:**
- Just want general market research → `marketing-research`
- Need psychographic data only → `marketing-psychology`
- Creating product positioning → `brand`

**Actions:**
- `:create` - Create new persona
- `:analyze` - Analyze audience data
- `:update [name]` - Update existing
- `:list` - List all personas

**Outputs:** ICP Profiles → `assets/leads/icp-profiles/{persona}.md`

**Hard gates:** Must have customer data hoặc market research to validate

**Pitfalls:**
- Creating personas without customer research
- Too generic (affects everyone)
- Personas không align với actual sales data
- Too many personas

**Difference from:**
- Khác `marketing-psychology` (persona = profile; psychology = principles)
- Khác `marketing-research` (persona = customer; research = broader trend)
- Khác `brand` (persona = customer focus; brand = company identity)

---

## ckm:pricing-strategy

**Purpose:** Design và optimize pricing structures, packaging, value metrics, price points based on research.

**USE when:**
- Setting initial pricing
- Changing prices
- Optimizing tiers
- Conducting pricing research
- Designing value metrics

**Modes:**
- Van Westendorp survey
- MaxDiff analysis
- Willingness-to-pay research
- Tier structure design
- Freemium vs free trial
- Per-user vs usage-based
- Flat fee, value-based, annual discounts

**Outputs:** Pricing research analysis; tier recommendations; price point strategy; packaging guide

**Hard gates:** Validate pricing với target customers before launch; track price sensitivity metrics

**Pitfalls:** Pricing based on cost instead of value; identical price points across tiers (no differentiation); wrong value metric

---

## ckm:brand

**Purpose:** Brand identity, voice, visual standards, messaging frameworks, asset management với design token synchronization.

**USE when:**
- Defining brand voice and tone
- Creating style guides
- Managing brand consistency
- Syncing design tokens
- Validating brand assets

**DON'T use when:**
- Just want logo design → `logo-design`
- Need general copywriting → `write`
- Only need brand strategy → `marketing-planning`

**Subcommands:** `:update` - Update brand identity và sync to all design systems

**Key Scripts:**
- `inject-brand-context.cjs` - Extract brand context cho prompt injection
- `sync-brand-to-tokens.cjs` - Sync brand-guidelines.md → design-tokens.json/css
- `validate-asset.cjs` - Validate asset naming, size, format
- `extract-colors.cjs` - Extract và compare colors against palette

**Outputs:**
- Brand guidelines → `docs/brand-guidelines.md` (source of truth)
- Design tokens → `assets/design-tokens.json` + `.css`

**Hard gates:** Source document (brand-guidelines.md) required cho sync; consistent color/font naming conventions

**Pitfalls:**
- Inconsistent color naming across assets
- Forgetting sync tokens after updates
- Brand guidelines too vague
- Không testing tokens trong actual designs

**Difference from:**
- Khác `design-consultation` (brand = voice/identity; design-consultation = full design system)
- Khác `write` (brand provides context; write creates copy)
- Khác `design` (brand = foundation; design = applies to UI)
