# Engineering Workflows — Official Reference

8 workflows chính thức từ docs.claudekit.cc. Mỗi workflow = chuỗi commands được proven trong production.

---

## 1. Adding a Feature

**Goal:** Add complete feature với planning, implementation, tests, docs trong 15-30 min (thay vì 2-4 hours manually).

**Command chain:**
```
1. /ck:plan [clear feature description]
2. cat plans/[generated-plan].md     ← review plan
3. /ck:scout "query" 3                ← optional, deep dive
4. /clear                              ← clear context
5. /ck:cook "Implement [feature] as planned"
6. /ck:test
7. /ck:fix                             ← nếu test fail
8. /review                             ← auto sau cook
9. /ck:docs update
10. /ck:git cm
11. /ck:git pr main [branch-name]     ← optional
```

**Decision points:**
- Complex features → planning first; simple endpoints can skip
- Large features → divide thành smaller pieces
- Solo work → skip PR creation
- Tests fail → invoke `/ck:fix` trước proceed

**Pitfalls:**
- Vague requirements (use specific descriptions)
- Skipping planning cho complex features (enables scope creep)
- Ignoring test failures
- Reviewing code too late (review trước commit)
- Outdated documentation
- Feature creep (keep features small và focused)

**URL:** https://docs.claudekit.cc/docs/workflows/adding-feature

---

## 2. Fixing Bugs

**Goal:** Debug và fix issues systematically với root cause analysis trong 5-20 min (vs 1-4 hours manually).

**Command chain:**
```
1. Reproduce the bug
   - Document actual vs expected behavior
   - Reproduction steps
   - Error messages
2. Choose debugging approach:
   - /ck:fix --quick  ← simple isolated bug
   - /ck:fix          ← complex/multi-file
   - /ck:fix --review ← critical/production
3. Run fix command (auto-detect issue type)
4. Verify: /ck:test + manual testing
5. Document changes (fix details + prevention)
6. /ck:git cm
```

**Decision points:**
- `--quick` flag → isolated bugs
- Full `/ck:fix` → multi-file issues
- Production logs → log analysis
- Development bugs → standard reproduction
- Auto-detect: UI issues, CI/CD failures, type errors, performance, security
- Fix might break others → comprehensive test suite

**Pitfalls:**
- Fixing without reproduction (confirm locally first)
- Skipping regression tests
- Missing root cause (address underlying, not symptoms)
- Inadequate documentation (add tests/guides)
- Intermittent bugs (require adequate logging first)

**URL:** https://docs.claudekit.cc/docs/workflows/fixing-bugs

---

## 3. Building an API

**Goal:** Build complete REST API với CRUD, auth, docs trong 30-60 min (vs 6-12 hours manually).

**Command chain:**
```
1. /ck:plan [design REST API for task management...]
2. /ck:bootstrap [create REST API for task management...]
3. Set environment variables + initialize database
4. /ck:cook [add task filtering by status, priority...]
5. /ck:test
6. /ck:docs update
7. /ck:cook [create production Docker setup...]
```

**Decision points:**
- Framework selection (Express.js vs alternatives)
- Database (PostgreSQL/MySQL/MongoDB)
- Authentication (JWT vs others)
- Deployment (Docker/Heroku/AWS/DigitalOcean)
- Advanced features (rate limiting, caching, webhooks, WebSocket)

**Pitfalls:**
- Database connection issues (verify `DATABASE_URL`, test với `npx prisma db pull`)
- Auth failures (`/ck:fix --quick [JWT auth returning 401...]`)
- Performance degradation (add indexes cho frequently queried fields)
- Overly restrictive rate limiting
- Inconsistent response formats (implement standardized structures early)

**URL:** https://docs.claudekit.cc/docs/workflows/building-api

---

## 4. Implementing Authentication

**Goal:** Implement secure, production-ready auth (JWT to OAuth2, 2FA, passwordless) trong 20-40 min.

**Command chain:**
```
1. /ck:plan [implement JWT auth với email/password và password reset]
2. /ck:cook [implement JWT auth với registration và login]
3. /ck:cook [add email verification to registration]
4. /ck:cook [implement password reset với email verification]
5. /ck:cook [add OAuth2 login với Google và GitHub]
6. /ck:cook [implement TOTP-based 2FA với QR code setup]
7. /ck:cook [implement passwordless login với magic links]
8. /ck:cook [add account lockout sau 5 failed login attempts]
9. /ck:test
10. /review
11. /ck:docs update
```

**Decision points:**
- Auth method (JWT vs session vs OAuth vs passwordless)
- Additional security (2FA, account lockout, IP whitelisting)
- Third-party integrations (OAuth providers, email services)
- Data compliance (GDPR account deletion)

**Pitfalls:**
- Weak password hashing (MD5/SHA1 instead of bcrypt)
- Tokens trong localStorage (use httpOnly cookies)
- Long-lived access tokens without refresh rotation
- Missing rate limiting on auth endpoints
- Inadequate input validation (injection attacks)
- Error messages revealing system info
- Skipping email verification và password reset testing

**URL:** https://docs.claudekit.cc/docs/workflows/implementing-auth

---

## 5. Integrating Payment

**Goal:** Implement secure payment processing với provider integration spanning one-time, subscriptions, webhooks, revenue optimization trong 25-50 min (vs 5-10 hours).

**Command chain:**
```
1. /ck:plan [integrate Stripe for subscription billing]
2. /ck:cook [integrate Stripe payment processing với one-time và subscription payments]
3. /ck:cook [add invoice generation for one-time payments]
4. /ck:cook [implement subscription tiers với monthly và annual billing]
5. /ck:cook [implement comprehensive Stripe webhook handling]
6. /ck:cook [add support for multiple payment methods]
7. /integrate:polar or /integrate:sepay  ← as needed
8. /ck:cook [implement coupon và discount code system]
9. /ck:cook [implement payment analytics dashboard]
10. /ck:test
11. Deploy với security review
```

**Decision points:**
- Provider (Stripe global/feature-rich, Polar creator economy, SePay Vietnam, PayPal, Square)
- Billing model (freemium/tiered/usage-based/marketplace)
- Trial period (with/without payment method)
- Tax handling (automatic via TaxJar hoặc manual)
- Payment methods (cards only vs digital wallets, regional options)

**Pitfalls:**
- Storing raw card data (PCI violation)
- Missing webhook signature verification
- Lacking idempotency keys (double-charging)
- Insufficient failed-payment retry logic (dunning)
- Deploying without production API keys
- Skipping 3D Secure for EU (SCA requirements)
- Inadequate error message sanitization
- No monitoring for fraud hoặc dispute handling

**URL:** https://docs.claudekit.cc/docs/workflows/integrating-payment

---

## 6. Optimizing Performance

**Goal:** Identify và resolve performance bottlenecks systematically trong 30-60 min (vs 4-12 hours).

**Command chain:**
```
1. /ck:debug          ← profile + identify bottlenecks
2. /ck:cook           ← implement fixes (DB, caching, frontend, algorithms)
3. /ck:test           ← load testing verify improvements
4. /ck:fix            ← complex issues like memory leaks
```

**Decision points:**
- Prioritize fixing 3 critical issues trước 5 warnings
- Cache strategy (Redis/in-memory LRU/CDN) based on data type
- Code splitting / image optimization / bundle compression
- Background job queues cho blocking operations

**Pitfalls:**
- Guess-based optimization (profile FIRST)
- Unvalidated caching (cache aggressively but invalidate correctly)
- Wrong data structures (arrays với loops O(n²) instead of hash maps O(1))
- Incomplete monitoring (continuous tracking sau optimization)
- Memory leaks (clean up event listeners + references)
- Sequential over parallel processing when parallel possible

**Typical outcome:** 97% faster response times với 84% bundle size reduction trong 1 hour.

**URL:** https://docs.claudekit.cc/docs/workflows/optimizing-performance

---

## 7. Refactoring Code

**Goal:** Improve code quality và maintainability without breaking functionality trong 15-45 min.

**Command chain:**
```
1. /review                          ← automated code analysis
2. /ck:plan [refactoring objective]  ← structured roadmap
3. npm run test:coverage            ← validate existing tests
4. /ck:cook [refactoring task]      ← execute refactoring
5. /ck:test                         ← full test suite
6. /ck:docs update [topic]          ← update architecture docs
7. /ck:git cm                       ← commit message
```

**Decision points:**
- Prioritize high-priority/low-risk (duplicate code, large functions) trước high-risk (tight coupling)
- Add tests nếu coverage thấp before proceed
- Keep incremental (single functions/modules, not entire systems)
- Maintain backward compatibility hoặc intentionally version APIs

**Pitfalls:**
- Mega-refactoring (avoid multiple large changes simultaneously)
- Testing gaps (ensure coverage before refactoring)
- Scope creep (stick to structural improvements; don't optimize performance)
- Unclear priorities (use `/review` first)

**URL:** https://docs.claudekit.cc/docs/workflows/refactoring-code

---

## 8. Starting a New Project

**Goal:** Build production-ready REST API trong 45-60 min — bootstrap, test, deploy complete Node.js app.

**Command chain:**
```
1. mkdir task-api && cd task-api && claude
2. /ck:bootstrap [build REST API for task management với user auth]
3. Answer interactive prompts (tech stack, database, auth, features)
4. cp .env.example .env && nano .env
5. docker-compose up -d postgres
6. npx prisma migrate dev --name init
7. npm test
8. npm run dev
9. /ck:plan [feature] && /ck:cook [feature]
10. /ck:git cm
11. git push heroku main  ← hoặc docker-compose up
```

**Decision points:**
- Tech stack (Node.js+Express vs Fastify/Python/Go)
- Database (PostgreSQL vs MySQL/MongoDB/SQLite)
- ORM (Prisma recommended vs TypeORM/Sequelize)
- Auth method (JWT vs OAuth2 vs session-based)
- Optional features (rate limiting, validation, Swagger, Docker, Redis, WebSockets)
- Testing framework (Jest vs Vitest vs Mocha+Chai)
- Deployment (Heroku vs Docker vs cloud platforms)

**Pitfalls / Troubleshooting:**
- Database connection fails (verify `DATABASE_URL` + PostgreSQL service)
- Port already in use (change `PORT` trong `.env`)
- Migration errors (reset với `npx prisma migrate reset`)
- Tests fail (use `/ck:fix`)
- Forgotten JWT token (save token từ login response)

**URL:** https://docs.claudekit.cc/docs/workflows/new-project
