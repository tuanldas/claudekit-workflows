# Marketing — Campaigns, Funnels & Advertising

Skills cho campaign orchestration, funnel design, launches, paid ads, viral growth programs.

---

## ckm:campaign

**Purpose:** End-to-end campaign planning, multi-channel coordination, budget allocation, performance tracking, email campaign management.

**USE when:**
- Planning full marketing campaigns
- Coordinating across channels
- Setting budget/timeline
- Tracking campaign performance
- Managing email campaigns

**DON'T use when:**
- Just need funnel design → `funnel`
- Only want email creation → `email`
- Need ongoing analytics only → `analytics`

**Subcommands:**
| Sub | Action |
|-----|--------|
| `:create` | Create comprehensive digital marketing campaign |
| `:status` | Get campaign status |
| `:analyze` | Analyze campaign performance |
| `:email` | Email campaign management |

**Outputs:**
- Briefs → `assets/campaigns/{date}-{slug}/briefs/`
- Creatives → `assets/campaigns/{date}-{slug}/creatives/`
- Reports → `assets/campaigns/{date}-{slug}/reports/`
- Analysis → `assets/diagnostics/campaign-audits/{date}-{name}.md`

**Hard gates:** Clear objective; budget amount; target audience defined

**Pitfalls:**
- Campaign creation without defined metrics
- Multi-channel không nghĩa all channels (focus 2-3 highest ROI)

**Difference from:**
- Khác `funnel` (campaign = multi-channel coordinated push; funnel = sequential stages)
- Khác `launch-strategy` (campaign = sustained; launch = event-based)
- Khác `email` (campaign = orchestrate multiple; email = channel-specific)

**Docs:** https://docs.claudekit.cc/docs/marketing/skills/campaign

---

## ckm:funnel

**Purpose:** Design và optimize marketing funnels across all stages từ traffic to checkout với conversion metrics per stage.

**USE when:**
- Designing new funnel architecture
- Analyzing drop-off points
- Optimizing cho higher conversion rates
- Structuring customer journey

**DON'T use when:**
- Just creating email sequences → `email`
- Planning multi-channel campaigns → `campaign`
- Only need lead-gen landing page → `form-cro`

**Subcommands (Actions):**
| Action | Tác dụng |
|--------|---------|
| `:design [type]` | Design new funnel (types: lead-magnet, webinar, product-launch, evergreen, tripwire) |
| `:analyze` | Analyze existing funnel |
| `:optimize` | Get optimization recommendations |

**Outputs:**
- Funnel designs → `assets/funnels/designs/{date}-{slug}-funnel.md`
- Funnel audits → `assets/funnels/audits/{date}-{funnel}-audit.md`
- A/B tests → `assets/funnels/tests/{date}-{test-name}.md`

**Hard gates:** Clear understanding of traffic source và conversion goal

**Pitfalls:**
- Too many stages → friction
- Forgetting metrics per stage → optimization impossible
- Confusing funnel với single-page flow

**Difference from:**
- Khác `campaign` (funnel = sequential journey; campaign = coordinated push)
- Khác `form-cro` (funnel = entire path; form-cro = single form)

---

## ckm:launch-strategy

**Purpose:** Plan phased product/feature launches dùng ORB framework (Owned, Rented, Borrowed channels) với momentum tactics và Product Hunt guidance.

**USE when:**
- Planning product launches
- Feature announcements
- Building waitlists
- Creating Product Hunt strategy
- Managing pre-launch to post-launch momentum

**DON'T use when:**
- Just need email sequences → `email`
- Planning overall marketing → `marketing-planning`
- Creating landing pages → `form-cro`

**5-phase approach:**
1. Internal launch (early testers)
2. Alpha launch (landing page + controlled access)
3. Beta launch (external buzz + limited signups)
4. Early access launch (controlled expansion)
5. Full launch (self-serve signups)

**ORB channels framework:**
- **Owned**: Email, blog, community, website (compound, no algo risk)
- **Rented**: Social media, marketplaces, YouTube (fast, algo dependent)
- **Borrowed**: Podcasts, influencers, guest posts (credibility, audience)

**Outputs:** Launch plans → `assets/launches/{date}-{product}-plan.md`

**Hard gates:** Clear product/feature definition; launch date target; owned channel (email list preferred)

**Pitfalls:**
- One-day launch với no momentum building
- Ignoring owned channels
- Product Hunt without pre-work relationships
- Rushing through phases
- Same message across all channels

**Difference from:**
- Khác `campaign` (launch = event-focused phased; campaign = sustained)
- Khác `marketing-planning` (launch = specific GTM moment; planning = strategy)

---

## ckm:play

**Purpose:** Marketing playbook orchestrator với dependency-graph routing, quality gates, goal tracking, smart suggestions.

**USE when:**
- Executing multi-step marketing campaigns
- Tracking playbook progress
- Managing complex workflows
- Orchestrating team tasks

**Subcommands:** `create`, `next`, `status`, `list`, `blocked`, `learn`, `reset`, `gate` (approval), `templates`, `goals`

**Modes:** Playbook templates (Product Hunt launch, content engine, campaign sprint, SaaS launch)

**Outputs:** Playbook manifest; step-by-step execution plan; goal progress tracking; smart recommendations

**Hard gates:**
- Goals must be measurable
- Steps must have defined success criteria
- Quality gates before advancing

**Pitfalls:** Skipping dependency validation; không tracking metrics; ignoring learnings từ completed steps

---

## ckm:paid-ads

**Purpose:** Paid advertising campaign strategy, creative development, audience targeting, performance optimization across Google Ads, Meta, LinkedIn, Twitter/X, TikTok.

**USE when:**
- Creating paid campaigns
- Writing ad copy
- Building audience segments
- Optimizing ROAS/CPA
- Setting up retargeting

**DON'T use when:**
- Just want organic social content → `social`
- Only need strategy → `marketing-planning`
- Creating landing pages → `form-cro`

**Platform selection:**
| Platform | Use case |
|----------|---------|
| **Google Ads** | High-intent search, bottom-of-funnel conversions |
| **Meta** | Demand generation, visual products, retargeting |
| **LinkedIn** | B2B targeting, decision-maker reach, higher CPCs |
| **Twitter/X** | Tech audiences, real-time relevance, thought leadership |
| **TikTok** | Younger demographics, viral creative, brand awareness |

**Key elements:**
- Campaign structure + naming conventions
- Ad copy frameworks (PAS, BAB, Social Proof Lead)
- Audience targeting by platform
- Creative best practices (image, video, carousel)
- Bid strategies (manual vs automated)
- Retargeting funnel-based approach

**Outputs:** Campaign structure docs, ad copy variations, audience segment definitions → `assets/campaigns/paid-ads/{date}-{campaign}.md`

**Hard gates:**
- Conversion tracking must be set up
- Landing page final + tested
- Budget amount defined
- Audience definition clear
- Compliance với platform policies

**Pitfalls:**
- Launching without conversion tracking
- Spreading budget too thin
- Changing bids too frequently
- Ignoring landing page experience
- Ad fatigue (same creative too long)
- Wrong platform cho audience

**Difference from:**
- Khác `social` (paid-ads = paid media; social = organic)
- Khác `campaign` (paid-ads = single channel; campaign = multi-channel)

---

## ckm:ads-management

**Purpose:** Manage và optimize paid advertising campaigns across Meta, Google, LinkedIn, TikTok với creative testing và bid strategy.

**USE when:**
- Running paid campaigns
- Optimizing ad spend ROI
- A/B testing ad creative
- Managing multi-platform ad accounts

**Modes:** Awareness, consideration, conversion campaigns; CPA, ROAS, brand lift optimization

**Outputs:** Campaign setup guides; creative recommendations; bid optimization rules; performance reports

**Hard gates:** Define success metric before launch; track ROAS/CPA minimum thresholds; validate audience targeting

**Pitfalls:** Low CPM ≠ good campaign; targeting too narrow kills volume; ignoring brand safety; không testing multiple creatives

---

## ckm:affiliate-marketing

**Purpose:** Design và operate SaaS affiliate programs với 20-40% commissions, KOL/KOC recruitment, fraud prevention.

**USE when:**
- Building referral revenue channels
- Recruiting partner affiliates
- Designing commission structures
- Preventing fraud abuse

**DON'T use when:**
- Product doesn't have strong affiliate potential
- Margins too low cho meaningful commissions

**Modes:** Recurring commission, one-time, tiered, hybrid compensation

**Outputs:** Affiliate program design; commission structure; platform recommendation; fraud prevention rules; KPI dashboard

**Hard gates:** 60-90 day commission holds; vetting before onboarding; KOL/KOC audience alignment validation

**Pitfalls:** Commission too low → no participation; no vetting → brand risk; cookie window too short → missed conversions

**Difference from:**
- `affiliate-marketing` = partner/influencer programs
- Khác `referral-program-building` (two-sided referrals)

---

## ckm:referral-program-building

**Purpose:** Build two-sided referral programs cho viral growth với reward structures, fraud prevention, KPI tracking.

**USE when:**
- Creating refer-a-friend features
- Designing viral incentive loops
- Building customer acquisition through referrals

**Modes:** Two-sided rewards, tiered rewards, product-aligned rewards, multi-step incentives

**Outputs:** Referral program design; reward structure; platform recommendation; fraud rules; email templates; KPI dashboard

**Hard gates:**
- Two-sided rewards outperform single-sided 68%
- Target 5-9% participation rate

**Pitfalls:** Incentives too low → no participation; no fraud prevention → abuse; overcomplicated → user confusion

**Difference from:**
- `referral-program-building` = user referrals
- Khác `affiliate-marketing` (influencer/partner programs)

---

## ckm:gamification-marketing

**Purpose:** Design gamified campaigns dùng mechanics (points, badges, leaderboards, streaks, challenges) cho loyalty, referrals, engagement.

**USE when:**
- Building loyalty programs
- Designing referral campaigns
- Optimizing engagement metrics
- Creating onboarding flows

**Modes:** Acquisition, retention, engagement, conversion, onboarding optimization

**Core mechanics:** Points, badges, leaderboards, levels, streaks, challenges, quests, unlockables, rewards, progress bars

**Hard gates:**
- 2-3 core mechanics max
- Clear reward value ("100 pts = $5")
- Progressive difficulty

**Pitfalls:** Too many mechanics; unclear reward value; leaderboard toxicity; impossible challenges

---

## ckm:free-tool-strategy

**Purpose:** Plan, evaluate, build free tools cho marketing (calculators, generators, analyzers, auditors) generating leads và organic traffic.

**USE when:**
- Building lead gen tools
- Creating SEO assets
- Planning engineering-as-marketing initiatives

**Modes:** Calculators, generators, analyzers/auditors, testers/validators, libraries/resources, interactive educational

**Outputs:** Tool strategy document; implementation spec; promotion plan; ROI projection

**Hard gates:** Tool must solve real problem adjacent to product; validate search demand before building

**Pitfalls:** Tool too complex to build; unclear lead capture path; no traffic/promotion strategy; poor product-tool alignment
