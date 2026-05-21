# Marketing Workflows — Official Reference

7 marketing workflows chính thức từ docs.claudekit.cc.

---

## 1. Marketing Workflow (Overall)

**Goal:** Orchestrate complete marketing operations từ research → strategy → content → distribution → measurement với coordinated AI agents.

**Phases:**
1. **Research** — Analyze competitive landscape, audience, market trends, keywords
2. **Strategy** — Define objectives, channels, KPIs, timeline
3. **Content Creation** — Blogs, ads, landing pages, emails, social assets
4. **Review & Approval** — Brand compliance, accuracy, SEO, conversion readiness
5. **Distribution** — Publish across channels per timeline
6. **Measurement** — Track metrics, attribution, ROI, optimizations

**Decision points:**
- Stakeholder approval sau research, trước proceed
- Content reviewer sign-off (brand + SEO standards)
- Weekly optimization decisions based on data
- Pivot strategy only với data-backed justification

**Critical pitfalls:**
- Skipping research (ineffective months-long execution)
- Content bottlenecks (use 80/20 prioritization)
- Poor ROI measurement (track business outcomes — leads, revenue — not vanity metrics)
- Mid-execution strategy changes (formal change management với documented justification)

**URL:** https://docs.claudekit.cc/docs/workflows/marketing-workflow

---

## 2. Campaign Workflow

**Goal:** Launch + manage complete marketing campaign từ brief → post-mortem trong 4-8 weeks.

**Command chain:**
```
1. Create Brief:
   "Create campaign brief for [Campaign]. Objective: [Goal]. Budget: [Amount].
    Timeline: [Dates]. Include: audience, channels, KPIs, success criteria"

2. Develop Creative:
   "Create creative assets for campaign [name]. Channels: [List].
    Messaging: [Description]. Include: headlines, descriptions, CTAs, visual direction"

3. Setup Funnel:
   "Design conversion funnel for [campaign]. Entry points: [Channels].
    Goal: [Conversion]. Include: funnel stages, tracking, test variants"

4. Launch:
   "Launch campaign [name]. Verify: tracking, creatives, targeting, budget.
    Channels: [List]. Start date: [Date]"

5. Optimize Daily:
   "Optimize campaign [name]. Current metrics: [Data]. Issues: [Problems].
    Recommend: targeting, budget, creative changes"

6. Post-Mortem:
   "Generate post-mortem for campaign [name]. Include: performance vs KPIs, ROI,
    key learnings. Recommend: improvements for next campaign"
```

**Decision points:**
- Brief approval (clear objectives, audience, realistic KPIs, achievable timeline)
- Launch gate (HUMAN approval required; tracking + creative + targeting + budget verified)
- Optimization review (daily vs KPIs; pause underperformers; shift budget to winners)
- Mid-campaign analysis (KPIs unachievable → adjust goals, extend timeline, increase budget)

**Pitfalls:**
- Unclear objectives (repeated brief revisions)
- Overreacting to weak first-week (platforms need 3-5 days to optimize)
- Unrealistic KPIs within budget constraints
- Relying on instinct rather than A/B test data

**Typical duration:** 4-8 weeks

**URL:** https://docs.claudekit.cc/docs/workflows/campaign-workflow

---

## 3. Content Workflow

**Goal:** Produce consistently high-quality marketing content scoring 8.0+ qua systematic 6-stage process.

**Command chain (6 stages):**
```
1. Draft     ← Create initial focusing on ideas, not perfection
2. Review    ← Comprehensive quality checks (brand voice, accuracy, grammar, SEO, CTAs)
3. Edit      ← Revise addressing feedback while maintaining brand voice
4. Audit     ← /write/audit scores 4 dimensions; triggers /write/publish if <8.0
5. Approval  ← Final quality verification + human approval
6. Publish   ← Distribute to channels với tracking enabled
```

**Decision points:**
- Audit: score ≥8.0 advances to approval; <8.0 triggers auto-fix + re-audit loop
- Before publishing: human approval required; date/channels confirmed

**Pitfalls:**
- Skipping audit phase (publishing substandard content)
- Ignoring review feedback (conflicts với quality standards)
- Platform formatting issues (emerge post-publication without preview testing)
- Structural messaging problems (may require manual intervention beyond auto-fix)
- Outdated brand guidelines (creates reviewer feedback misalignment)

**URL:** https://docs.claudekit.cc/docs/workflows/content-workflow

---

## 4. Email Workflow

**Goal:** Create high-performing email campaigns từ strategy → deployment với personalization, segmentation, optimization.

**Command chain:**
```
1. Strategy     → /ckm:email create   ← Define objective, audience, sequence
2. Copywriting  → /ckm:copywriter      ← Subject lines (5 variations), body, CTAs
3. Design       ← Mobile-responsive template với brand styling
4. Testing      → /ckm:email test      ← Validate links, personalization, rendering, spam score
5. Deployment   → /ckm:email sequence  ← Schedule với timezone optimization
6. Optimization → /ckm:email analyze   ← Review metrics + A/B test results
```

**Decision points:**
- Subject line testing (question vs statement)
- Send time selection (timezone-optimized vs fixed)
- Segment targeting
- CTA variation (button placement, wording, competing links)
- Frequency strategy (engagement vs unsubscribe risk)

**Pitfalls:**
- Low opens (poor subject lines, spam filtering, send timing)
- Low clicks despite opens (weak copy, unclear CTAs, mobile rendering)
- High unsubscribes (excessive frequency, irrelevant content)
- Design issues (multi-column layouts không render on mobile)
- Tracking failures (unvalidated links, missing personalization testing)

**URL:** https://docs.claudekit.cc/docs/workflows/email-workflow

---

## 5. Social Workflow

**Goal:** Create + distribute engaging social media content across platforms với systematic planning, batched creation, optimized scheduling.

**Command chain:**
```
1. Planning              ← Design content calendar aligned với objectives
2. Batch Creation        ← Draft 1-2 weeks posts trong single session
3. Platform Optimization ← Adapt content cho each network's format và algorithms
4. Scheduling            ← Queue posts at optimal engagement times
5. Daily Engagement      ← Respond to comments, monitor mentions (15 min/day)
6. Performance Analysis  ← Evaluate metrics, refine future content
```

**Decision points:**
- Content mix (educational 40% / promotional 30% / engagement 20% / company 10%)
- Platform selection (LinkedIn, Twitter, Facebook, Instagram, TikTok)
- Posting frequency per platform (LinkedIn 5x/week vs Twitter 3x/day)
- Format choices (carousels, videos, threads, native posts)
- Timing optimization based on audience activity

**Pitfalls:**
- Low engagement (content fails to resonate)
- Poor reach (algorithm deprioritization due to external links hoặc suboptimal hashtags)
- Click-to-conversion gap (landing page misalignment với social promises)
- Inconsistent execution (sporadic posting; batch creation solves this)

**URL:** https://docs.claudekit.cc/docs/workflows/social-workflow

---

## 6. SEO Workflow

**Goal:** Build sustainable organic traffic growth qua systematic SEO audits, keyword research, on-page optimization, content creation, monitoring.

**Command chain:**
```
1. Audit              → Comprehensive technical + competitive analysis
2. Keyword Research   → Identify 50-100 priority keywords (clusters)
3. On-Page Optimization → Enhance titles, meta, headers, schema markup
4. Content Creation   → SEO-optimized pieces cho priority keywords
5. Monitoring         → Track rankings, traffic, iterate monthly
```

**Decision points:**
- Sau audit: prioritize fixes by severity
- Sau keyword research: primary (high intent) vs long-tail (easier wins)
- Match search intent (comparison vs how-to) before writing
- Ranking drops → algorithm updates vs technical vs competitive

**Pitfalls:**
- Mismatched search intent (analyze top 3 results first)
- Shallow content (comprehensive guides > multiple shallow posts)
- Poor internal linking (build topic clusters)
- Low CTR despite rankings (optimize titles/meta với compelling language)
- Premature optimization (focus quality + user value before keyword density)

**Timeline:** 2-4 weeks initial setup; 6 months to substantial traffic goals

**URL:** https://docs.claudekit.cc/docs/workflows/seo-workflow

---

## 7. Sales Workflow

**Goal:** Transform prospects → customers + expand accounts qua automated 5-stage lead-to-customer journey với AI agents.

**Command chain:**
```
1. Lead Generation:
   "Create lead generation assets for [product]. Target: [ideal customer].
    Include: lead magnet concept, landing page copy, SEO keywords."

2. Qualification:
   "Qualify leads from [source]. Scoring criteria: [demographic points],
    [behavioral points]. Segment into: cold/warm/hot. Flag high-value prospects."

3. Nurture Sequences:
   "Create nurture sequence for [segment]. Journey: awareness → consideration → decision.
    Length: [X emails over Y days]."

4. Sales Enablement:
   "Create sales materials for [prospect type]. Include: pitch deck, objection responses,
    case studies. Customize for: [specific concerns]."

5. Expansion Strategy:
   "Create upsell strategy for [customer segment]. Current product: [tier].
    Expansion targets: [upgrades]. Analyze: usage patterns, growth signals."
```

**Decision points:**
- Lead quality gate (leads above threshold cho hot segment?)
- Engagement check (nurture sequences hitting expected open/click rates?)
- Readiness assessment (customers showing upgrade signals — usage >80%, team growth, feature attempts?)

**Pitfalls:**
- Attracting poor-fit leads (prioritize quality over volume)
- Irrelevant nurture content (low engagement)
- Salesforce resistance (impractical enablement materials)
- Scoring on demographics alone (without behavioral intent signals)

**URL:** https://docs.claudekit.cc/docs/workflows/sales-workflow

---

## Summary Stats

| Category | Count | Key Outcomes |
|----------|-------|--------------|
| Engineering Workflows | 8 | 81% cost reduction, accelerated timelines |
| Marketing Workflows | 7 | Multi-channel orchestration, measurable ROI |
| Common Principles | — | Systematic AI orchestration, quality gates với human approval, measurable outcomes |
