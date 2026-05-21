# Marketing — SEO, Analytics & Competitive Intelligence

Skills cho SEO audit, keyword research, analytics, competitor analysis.

---

## ckm:seo

**Purpose:** Technical SEO audits, keyword research với real volume data, on-page optimization, programmatic SEO templates, Google Search Console integration.

**USE when:**
- Researching keywords với data (volume, difficulty, CPC)
- Analyzing competitor SEO
- Auditing technical SEO
- Generating JSON+LD schema
- Creating programmatic SEO templates
- Measuring Core Web Vitals
- Querying Google Search Console

**DON'T use when:**
- Just need content ideas → `marketing-research`
- Only want strategic positioning → `launch-strategy`

**Subcommands:**
| Sub | Action |
|-----|--------|
| `:audit` | Technical SEO audit |
| `:keywords` | Keyword research & planning |
| `:pseo` | Programmatic SEO template generation |

**Scripts available:**
- `gsc-auth.cjs` - OAuth2 cho Google Search Console
- `gsc-query.cjs` - Query analytics, sitemaps, URL inspection
- `analyze-keywords.cjs` - Keyword research qua ReviewWeb.site API
- `audit-core-web-vitals.cjs` - Core Web Vitals measurement
- `generate-schema.cjs` - JSON+LD schema generator

**Outputs:**
- Audit reports → `assets/reports/seo/{date}-{domain}-audit.md`
- Keyword reports → `assets/reports/seo/{date}-{topic}-keywords.md`
- Core Web Vitals → `assets/reports/seo/{date}-{domain}-cwv.md`
- Schema files → `assets/seo/schemas/{page}-schema.json`

**Hard gates:** GSC credentials stored in `~/.claude/secrets/google_client_secret.json` cho GSC features

**Pitfalls:**
- ReviewWeb.site API rate limits
- GSC data lags 3-4 days
- pSEO templates require careful planning cho scale

**Difference from:**
- Khác `marketing-research` (broader topics)
- Khác `analytics` (post-launch)
- `ckm:seo` = technical SEO, keyword data, schema

**Docs:** https://docs.claudekit.cc/docs/marketing/skills/seo

---

## ckm:analytics

**Purpose:** Marketing KPI tracking, attribution modeling, campaign performance analysis, ROI calculation, reporting dashboard creation.

**USE when:**
- Creating performance reports
- Analyzing campaign data
- Calculating ROI
- Setting up KPI dashboards
- Interpreting A/B tests

**DON'T use when:**
- Just want raw data export → `dashboard`
- Need campaign creation → `campaign`
- Only want strategic advice → `ask`

**Capabilities:**
- KPI framework + definitions
- Attribution modeling (multi-touch, first-touch, last-touch)
- Campaign analysis workflows
- A/B test significance testing
- Report generation với visualizations

**Outputs:**
- Reports → `assets/reports/analytics/{date}-{report-type}.md`
- Dashboards → `assets/dashboards/{date}-{type}.json`

**Hard gates:**
- GA4 service account credentials (nếu dùng Google Analytics)
- Clear conversion definition
- Proper UTM parameters set up

**Pitfalls:**
- Attribution ≠ causation
- Confusing correlation với causation
- Không accounting cho seasonal trends
- Insufficient sample size cho A/B conclusions
- Mixing metrics without normalizing

**Difference from:**
- Khác `campaign` (analytics measures, campaign plans)
- Khác `dashboard` (analytics insights, dashboard visualization)
- Khác `seo` (analytics campaign ROI, seo organic/technical)

---

## ckm:analyze

**Purpose:** Campaign performance analysis, KPI tracking, attribution modeling, ROI calculation.

**USE when:**
- Reviewing campaign data
- Creating performance reports
- Optimizing marketing spend
- Measuring marketing impact

**Outputs:** KPI dashboards; trend analysis; segment performance; attribution breakdown; optimization recommendations

**Hard gates:** Validate data sources before analysis; check statistical significance

**Pitfalls:**
- Correlation ≠ causation
- Comparing different time periods without seasonal adjustment
- Ignoring customer acquisition cost alongside revenue

**Difference from:**
- `analyze` = post-campaign results
- Khác `ab-test-setup` (pre-test design)

---

## ckm:competitor

**Purpose:** Competitive analysis, content gap identification, SEO comparison, alternative/vs. page generation cho positioning.

**USE when:**
- Analyzing competitor positioning
- Creating "vs." comparison pages
- Understanding competitive landscape
- Generating battle cards

**DON'T use when:**
- Just want general market research → `marketing-research`
- Analyzing own SEO → `seo`
- Creating pricing strategy → `pricing-strategy`

**Actions:**
| Action | Tác dụng |
|--------|---------|
| `:alternatives` | Create competitor comparison & alternative pages |
| `analyze [url]` | Analyze competitor website |
| `content [url]` | Content gap analysis |
| `seo [url]` | SEO comparison |
| `list` | List tracked competitors |

**Outputs:**
- Battlecards → `assets/sales/battlecards/{competitor}.md`
- Analysis reports → `reports/competitors/{date}-{name}.md`
- Alternative/vs pages → organized by format

**Hard gates:** Competitor must have public web presence cho analysis

**Pitfalls:**
- Copying competitor messaging directly
- Không differentiating unique value
- Confusing feature comparison với positioning
- Outdated competitor data

**Difference from:**
- Khác `marketing-research` (competitor = specific rivals; research = broader market)
- Khác `seo` (competitor includes positioning; seo = technical)
- Khác `brand` (competitor = external; brand = internal identity)
