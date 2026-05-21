# Marketing — Conversion Rate Optimization (CRO)

Skills cho form, onboarding, A/B testing optimization.

---

## ckm:form-cro

**Purpose:** Form optimization cho lead capture, demo requests, contact forms, checkout, surveys to maximize completion rates while minimizing friction.

**USE when:**
- Optimizing existing forms
- Designing new forms
- Reducing abandonment
- Testing form variations
- Improving field-level conversion

**DON'T use when:**
- Designing signup/login → `signup-flow-cro`
- Optimizing popups containing forms → `popup-cro`
- Only need page optimization → `page-cro`

**Key principles:**
- Every field has cost (each reduces completion rate)
- Value must exceed effort
- Reduce cognitive load

**Core optimizations:**
- Field count + ordering (start easy, end sensitive)
- Single vs multi-step (multi-step cho 5+ fields)
- Label + placeholder clarity
- Error handling + messages
- Submit button copy showing benefit
- Trust elements (privacy, security, testimonials)
- Mobile optimization (44px+ touch targets)

**Form types với guidance:**
| Type | Guidance |
|------|---------|
| Lead capture | Minimal fields, clear offer |
| Contact form | Essential: email + message |
| Demo request | Name, email, company, use case |
| Quote/estimate | Multi-step recommended |
| Survey | Progress bar essential, skip logic |

**Outputs:** Form audit reports → `assets/audits/forms/{date}-{form-name}.md` với issue/impact/fix/priority

**Hard gates:** Access to form hoặc detailed form description; completion rate data preferred

**Pitfalls:**
- Asking too many fields upfront
- Confusing labels
- No progress indicator multi-step
- Error messages không help fix
- Ignoring mobile
- Missing privacy statement

**Difference from:**
- Khác `page-cro` (form-cro = form-specific; page-cro = overall conversion)
- Khác `signup-flow-cro` (form-cro = lead capture/contact; signup = account creation)
- Khác `popup-cro` (form-cro = standalone; popup-cro = modal forms)

---

## ckm:onboarding-cro

**Purpose:** Optimize post-signup onboarding, user activation, first-run experience, time-to-value.

**USE when:**
- Improving activation rates
- Designing onboarding flows
- Reducing new user churn
- Speeding time-to-value

**DON'T use when:**
- Signup/registration optimization → `signup-flow-cro`
- Form optimization → `form-cro`
- Email sequences ongoing → `email`

**Subcommands:**
- Activation definition
- Flow design
- Empty state optimization
- Multi-channel coordination

**Modes:** Product-first / Guided setup / Value-first approaches; checklist patterns; progress indicators

**Outputs:** Onboarding audit; flow designs; copy deliverables; email sequence; KPI targets

**Hard gates:**
- Define "aha moment" first (action correlated với retention)
- Test với actual users

**Pitfalls:**
- Too many onboarding steps cause abandonment
- Unclear next action
- Blocking features behind completion

---

## ckm:ab-test-setup

**Purpose:** Design và execute statistically rigorous A/B tests that drive informed product và marketing decisions.

**USE when:**
- Planning experiments
- Testing marketing changes
- Validating design/copy hypotheses
- Optimizing conversion rates

**DON'T use when:**
- Need quick decisions without data
- Testing multiple variables simultaneously → Multivariate Test instead

**Components:** Hypothesis framework, sample size calculator, test design, variant documentation, results analysis

**Modes:**
- A/B test
- A/B/n test
- Multivariate test
- Split URL test

**Inputs:** Baseline conversion rate, MDE (minimum detectable effect), test duration, variant descriptions
**Outputs:** Test plan document, statistical significance analysis, segment-based insights

**Hard gates:**
- Pre-commit sample size before launching
- Don't peek at results
- Document primary/secondary/guardrail metrics

**Pitfalls:**
- Peeking and stopping early inflates false positives
- Changing variants mid-test invalidates results
- Testing too many changes simultaneously prevents isolating causation

**Difference from:**
- `ab-test-setup` = designs tests before execution
- Khác `analytics` (handles measurement)
