# Engineer — Backend, Infrastructure & Security Skills

Skills cho API, database, auth, payment, deployment, DevOps, security.

---

## ck:backend-development

**Purpose:** Build backends với Node.js, Python, Go — REST/GraphQL/gRPC APIs, auth (OAuth/JWT), databases, microservices, OWASP security.

**USE when:**
- Backend/API implementation
- Authentication systems
- Database optimization
- Microservices, security

**DON'T use when:**
- Frontend work → `frontend-development`

**Stacks:**
| Stack | Khi nào |
|-------|---------|
| **Node.js + NestJS** | Fast development, full-stack |
| **Python + FastAPI** | Data/ML integration |
| **Go + Gin** | High concurrency |
| **Rust + Axum** | Maximum performance |

**Modes:** API design (REST/GraphQL/gRPC), Authentication (OAuth 2.1, JWT, MFA), Performance (caching, query optimization), Security (OWASP Top 10)

**Hard gates:** Language/framework knowledge; database (PostgreSQL/MongoDB); testing infrastructure

**Pitfalls:**
- SQL injection (use parameterized queries)
- Weak passwords (use Argon2id)
- No caching (90% DB load reduction với Redis)
- No testing

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/backend-development

---

## ck:databases

**Purpose:** Design schemas, write queries, optimize indexes, manage migrations cho MongoDB & PostgreSQL.

**USE when:**
- Designing/refactoring schemas
- Writing complex queries
- Performance tuning
- Migrations, backups

**DON'T use when:**
- Trivial CRUD
- No schema design work
- ORM handles everything

**Modes:** MongoDB (document) / PostgreSQL (relational) — auto-select based on context

**Hard gates:** Database access; understanding ACID vs eventual consistency; knowledge of indexing strategies

**Pitfalls:**
- N+1 queries MongoDB
- Missing indexes on filtered columns
- Over-normalizing PostgreSQL (kills performance)
- Circular references MongoDB

**Difference from:**
- `databases` = schema + query focused
- Khác `devops` (database infrastructure: cloud setup, backups, replication)
- Khác `better-auth` (integrates auth schemas)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/databases

---

## ck:better-auth

**Purpose:** Add comprehensive auth (email/password, OAuth, 2FA, passkeys, organizations) với Better Auth TypeScript framework.

**USE when:**
- Building auth from scratch
- Need OAuth, multi-tenancy, 2FA, passkeys

**DON'T use when:**
- Using managed auth service (Auth0, Supabase)
- Simple API key auth only

**Plugins:** `twoFactor`, `passkey`, `magicLink`, `username`, `organization`, rate limiting (built-in)

**Modes:**
- **Auth methods**: Email/Password (built-in), OAuth (GitHub, Google, etc.), Passkeys, Magic Link, Usernames
- **Database adapters**: Kysely, Drizzle, Prisma, Sequelize
- **Session management**: HTTP-only cookies hoặc JWT

**Inputs:**
- Environment: BETTER_AUTH_SECRET, BETTER_AUTH_URL
- Database credentials/connection
- OAuth provider credentials (GitHub client ID/secret, etc.)

**Outputs:**
- Auth API routes (e.g., `/api/auth/[...all]/route.ts`)
- Database schema + migrations
- Client hook configuration

**Hard gates:**
- Database integration (must pick adapter)
- Secret management for OAuth keys
- Framework-specific handler mount (Next.js, Nuxt, Remix, etc.)

**Pitfalls:**
- Forgetting `BETTER_AUTH_SECRET` hoặc weak secret
- Không running migrations
- Mixing session và JWT strategies
- Exposing OAuth secrets in client code

**Difference from:**
- `better-auth` = TypeScript + framework-agnostic
- `payment-integration` handles payments post-auth
- `security` audits auth implementation

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/better-auth

---

## ck:payment-integration

**Purpose:** Integrate payments qua SePay (VietQR), Polar, Stripe, Paddle, Creem.io với checkout, subscriptions, webhooks, QR codes.

**USE when:**
- Accepting payments, subscriptions
- Licensing
- QR-based transfers

**DON'T use when:**
- Internal billing only (no customer-facing)
- Using embedded Shopify

**Platforms:**
| Platform | Use case |
|----------|---------|
| **SePay** | VND payments, 44+ Vietnamese banks, VietQR, webhooks |
| **Polar** | MoR (Merchant of Record), subscriptions, automated benefits (GitHub/Discord) |
| **Stripe** | CheckoutSessions, Billing, Connect platforms, Payment Element |
| **Paddle** | MoR, Retain (churn prevention), global tax, overlay/inline checkout |
| **Creem.io** | MoR, licensing, revenue splits, no-code storefronts |

**Inputs:**
- API keys / OAuth credentials per platform
- Product metadata (name, price, billing interval)
- Webhook event handlers
- Customer/order data

**Outputs:**
- Checkout sessions / links
- Subscription management API
- Webhook event logs
- Orders/transaction records

**Hard gates:**
- PCI compliance (never handle raw card data directly)
- Webhook signature verification
- Idempotency for retries
- Tax compliance (Paddle/Creem.io handle, Stripe/Polar may require config)

**Pitfalls:**
- Forgetting webhook verification (security hole)
- Không handling subscription cancellation/churn
- Missing refund flow
- Storing unencrypted payment credentials
- Currency conversion not handled (multi-provider)

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/payment-integration

---

## ck:deploy

**Purpose:** Auto-detect deployment target và deploy current project lên cost-optimized platforms (Vercel, Netlify, Cloudflare, Railway, Fly.io, Render).

**USE when:**
- Deploying finished projects
- Cần platform-agnostic
- Muốn cost recommendations

**DON'T use when:**
- Advanced infrastructure (databases, DNS, SSL)
- CI/CD setup → `devops`
- Scaling infrastructure

**Platform priority (cost):**
1. Free tier first: GitHub Pages → Cloudflare Pages → Vercel → Netlify
2. Free backends: Railway → Render → Fly.io
3. Pay-as-you-go: AWS, GCP, Azure

**Outputs:** `docs/deployment.md` (platform, URL, env vars, rollback)

**Hard gates:**
- Must detect or ask for platform before deploying
- Must create/update `docs/deployment.md` after first successful deploy
- CLI must be installed and auth resolved per-platform

**Pitfalls:** Không checking `.env` hoặc `.gitignore` before deploy; exposing secrets

**Difference from:**
- `deploy` = simple, one-platform, cost-optimized
- `devops` = advanced (Docker/K8s/CI/multi-region)

---

## ck:devops

**Purpose:** Deploy và manage cloud infrastructure: Cloudflare (Workers/R2/D1), Docker, GCP (Cloud Run/GKE), Kubernetes, GitOps, CI/CD.

**USE when:**
- Serverless functions
- Containers, Kubernetes
- Multi-region, GitOps
- Cloud security audits

**DON'T use when:**
- Simple static/SPA hosting → `deploy`
- No infrastructure code needed

**Modes:**
- **Cloudflare**: Workers, Pages, R2, D1, Browser Rendering
- **Docker**: local images, Docker Compose, registry push
- **GCP**: Cloud Run, GKE, Cloud SQL
- **Kubernetes**: kubectl, Helm charts

**Hard gates:**
- Authentication to cloud provider (gcloud login, kubectl context)
- Appropriate tool CLI installed (wrangler, docker, gcloud, kubectl)
- Valid IaC (Infrastructure as Code) hoặc manifest files

**Pitfalls:**
- Forgetting configure secrets in environment hoặc K8s secrets
- Không setting resource limits on containers (CPU/memory)
- Missing RBAC hoặc network policies in Kubernetes

**Difference from:**
- `deploy` = single-platform cost-optimized hosting
- `devops` = containerized, multi-region, enterprise-grade

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/devops

---

## ck:security

**Purpose:** STRIDE + OWASP threat-modeled security audit với optional red-team personas và iterative auto-fix.

**USE when:**
- Before release
- After adding auth/payment
- Compliance prep
- Periodic audit

**DON'T use when:**
- Cosmetic changes
- No user data/auth involved

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--red-team` | 4-persona iterative discovery (Security Adversary → Supply Chain → Insider → Infrastructure) |
| `--fix` | Apply fixes iteratively (Critical → High → Medium) |
| `--iterations N` | Bound fix/red-team loops |

**Modes:** Audit-only / Red-team / Fix mode / Red-team + Fix

**Outputs:**
- `security-audit-results.tsv` (findings với severity, file:line, persona)
- Report với STRIDE/OWASP categorization
- Fixed code (if `--fix` enabled)
- Commits: `security(fix-N): <description>`

**Hard gates:**
- Must scan files before categorizing (do not invent findings)
- Red-team: must iterate through 4 personas in order
- Fix: must run guard (tests/lint) after each fix, stop on failure
- Credential hygiene: mask all secret values in logs

**Pitfalls:**
- Reporting findings without code evidence (file:line)
- Forgetting to mask secrets in findings
- Stopping fix loop early
- Red-team personas influencing each other

**Difference from:**
- `security` = threat-modeled audit (STRIDE, attacker personas)
- `security-scan` = lightweight pattern-based scan (secrets, dependencies, OWASP top 10 patterns)

---

## ck:security-scan

**Purpose:** Lightweight scan cho hardcoded secrets, dependency vulnerabilities, OWASP code patterns (no external dependencies).

**USE when:**
- Quick security check
- Before commits
- Secret detection
- Dependency audit

**DON'T use when:**
- Full threat model needed → `security`
- Penetration testing
- Infrastructure audit

**Flags:**
| Flag | Tác dụng |
|------|---------|
| `--secrets-only` | Run only secret/credential detection |
| `--deps-only` | Run only dependency audit |
| `--full` | (default) Full scan: secrets + deps + code patterns |

**Modes:** Secrets → Dependencies → Code patterns (runs in order)

**Outputs:**
- Markdown report (printed to chat)
- Optional save `plans/reports/security-scan-{date}.md`
- Redacted findings (never raw keys: first 4 + last 2 chars only)

**Hard gates:**
- `.env` files must be checked for tracking (git ls-files check)
- Only patterns từ `references/secret-patterns.md` (not invented regexes)
- Dependency audit uses native tools (`npm audit`, `pip-audit`, `govulncheck`)

**Pitfalls:**
- Outputting raw secret values (must redact)
- False positives (e.g., `YOUR_API_KEY` placeholder)
- Missing `.env` exposure check
- Not filtering test fixtures và docs

**Difference from:**
- `security-scan` = fast, pattern-based, no external tools
- `security` = comprehensive threat model với STRIDE personas

---

## ck:shopify

**Purpose:** Build production Shopify apps, extensions, themes dùng GraphQL API, Polaris UI, Liquid templating.

**USE when:**
- Custom Shopify development
- Checkout customization
- Admin tools, theme creation

**DON'T use when:**
- Store setup only (use Shopify UI)

**Subcommands:**
- `shopify app init|dev|deploy`
- `shopify app generate extension --type <type>`
- `shopify theme init|dev|push|publish`

**Modes:** App development (React + Node.js), theme development (Liquid), extensions (checkout/admin/POS/function)

**Hard gates:** Access scopes declared trong shopify.app.toml; development stores for testing

**Pitfalls:** Forgetting scope declarations; không using GraphQL cost budgeting; GDPR compliance gaps

**Difference from:**
- `shopify` = Shopify-specific APIs/patterns
- Khác general web frameworks

**Docs:** https://docs.claudekit.cc/docs/engineer/skills/shopify
