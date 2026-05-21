import type { Workflow, WorkflowCategory } from "@/types/workflow";

export const categoryOrder: WorkflowCategory[] = [
  "all",
  "advanced-pipelines",
  "getting-started",
  "design-frontend",
  "planning-review",
  "debugging-fixes",
  "backend-infra",
  "shipping",
  "research-docs",
  "marketing",
  "media-creative",
];

export const workflows: Workflow[] = [
  // ========================
  // ADVANCED PIPELINES
  // ========================
  {
    id: "frontend-full-pipeline",
    title: {
      vi: "Frontend Feature — Pipeline Đầy đủ",
      en: "Frontend Feature — Full Pipeline",
    },
    description: {
      vi: "Workflow end-to-end cho tính năng UI phức tạp: brainstorm, plan, review gates, design, implement, ship.",
      en: "End-to-end workflow for complex UI features: brainstorm, plan, review gates, design, implement, ship.",
    },
    level: "advanced",
    duration: "2-4 hrs",
    category: "advanced-pipelines",
    steps: [
      { command: "/ck:brainstorm", label: { vi: "tư duy", en: "think" } },
      { command: "/ck:plan --hard", label: { vi: "plan", en: "plan" } },
      { command: "/plan-ceo-review", label: { vi: "review", en: "review" } },
      { command: "/design-consultation", label: { vi: "design", en: "design" } },
      { command: "/ck:cook", label: { vi: "build", en: "build" } },
      { command: "/ck:ship", label: { vi: "ship", en: "ship" } },
    ],
    phases: [
      {
        name: { vi: "Tư duy", en: "Thinking" },
        duration: "30 min",
        steps: [
          {
            command: "/ck:brainstorm",
            description: {
              vi: "Phân tích 2-3 approaches với SAFE/RISK, chọn approach tốt nhất",
              en: "Analyze 2-3 approaches with SAFE/RISK breakdown, choose best approach",
            },
          },
        ],
      },
      {
        name: { vi: "Lên kế hoạch", en: "Planning" },
        duration: "30 min",
        steps: [
          {
            command: "/ck:plan --hard",
            description: {
              vi: "Research sâu, plan chi tiết với phases và acceptance criteria",
              en: "Deep research, detailed plan with phases and acceptance criteria",
            },
          },
        ],
      },
      {
        name: { vi: "Review Pipeline", en: "Review Pipeline" },
        duration: "20-40 min",
        steps: [
          {
            command: "/plan-ceo-review",
            description: {
              vi: "Challenge scope & strategy (4 modes: expand/selective/hold/reduce)",
              en: "Challenge scope & strategy (4 modes: expand/selective/hold/reduce)",
            },
          },
          {
            command: "/plan-design-review",
            description: {
              vi: "Chấm điểm UI/UX dimensions 0-10, fix plan theo recommendations",
              en: "Score UI/UX dimensions 0-10, fix plan per recommendations",
            },
          },
          {
            command: "/plan-eng-review",
            description: {
              vi: "Lock architecture, data flow, edge cases, test coverage",
              en: "Lock architecture, data flow, edge cases, test coverage",
            },
          },
          {
            command: "/autoplan",
            description: {
              vi: "Hoặc chạy tất cả reviews tự động bằng 1 command",
              en: "Or run all reviews automatically in one command",
            },
            alternative: {
              vi: "Thay cho các review thủ công ở trên",
              en: "Replaces manual review steps above",
            },
          },
        ],
      },
      {
        name: { vi: "Design", en: "Design" },
        duration: "30-60 min",
        steps: [
          {
            command: "/design-consultation",
            description: {
              vi: "Tạo DESIGN.md: font, color, spacing, motion",
              en: "Create DESIGN.md: font, color, spacing, motion",
            },
            optional: true,
          },
          {
            command: "/design-shotgun",
            description: {
              vi: "Generate 3-5 visual variants, chọn approved design",
              en: "Generate 3-5 visual variants, pick approved design",
            },
            optional: true,
          },
          {
            command: "/ck:frontend-design",
            description: {
              vi: "Code UI từ approved design với anti-slop rules",
              en: "Code UI from approved design with anti-slop rules",
            },
          },
        ],
      },
      {
        name: { vi: "Triển khai", en: "Implementation" },
        duration: "30-60 min",
        steps: [
          {
            command: "/ck:cook @plan.md",
            description: {
              vi: "Implement logic, API integration. Auto: scout, code, test, review",
              en: "Implement logic, API integration. Auto: scout, code, test, review",
            },
          },
        ],
      },
      {
        name: { vi: "Ship", en: "Ship" },
        duration: "10-20 min",
        steps: [
          {
            command: "/ck:ship",
            description: {
              vi: "Merge, test suite, code review (2-pass + adversarial), PR",
              en: "Merge, test suite, code review (2-pass + adversarial), PR",
            },
          },
        ],
      },
    ],
    tips: [
      {
        vi: "Bỏ Phase 1 khi đã biết rõ approach",
        en: "Skip Phase 1 when approach is already clear",
      },
      {
        vi: "Bỏ Phase 3 cho tính năng nhỏ, không cần review",
        en: "Skip Phase 3 for small features that don't need review",
      },
      {
        vi: "Bỏ Phase 4 khi dùng UI có sẵn (shadcn, templates)",
        en: "Skip Phase 4 when using existing UI (shadcn, templates)",
      },
      {
        vi: "Dùng /autoplan thay cho review thủ công để tiết kiệm thời gian",
        en: "Use /autoplan instead of manual reviews to save time",
      },
    ],
  },
  {
    id: "backend-full-pipeline",
    title: {
      vi: "Backend/API — Pipeline Đầy đủ",
      en: "Backend/API — Full Pipeline",
    },
    description: {
      vi: "Phát triển backend end-to-end: brainstorm architecture, plan, eng review, implement, ship.",
      en: "End-to-end backend development: brainstorm architecture, plan, eng review, implement, ship.",
    },
    level: "advanced",
    duration: "1-3 hrs",
    category: "advanced-pipelines",
    steps: [
      { command: "/ck:brainstorm", label: { vi: "tư duy", en: "think" } },
      { command: "/ck:plan", label: { vi: "plan", en: "plan" } },
      { command: "/plan-eng-review", label: { vi: "review", en: "review" } },
      { command: "/ck:cook", label: { vi: "build", en: "build" } },
      { command: "/ck:ship", label: { vi: "ship", en: "ship" } },
    ],
    phases: [
      {
        name: { vi: "Tư duy", en: "Thinking" },
        duration: "15-30 min",
        steps: [
          {
            command: "/ck:brainstorm",
            description: {
              vi: "So sánh approaches: REST vs GraphQL, SQL vs NoSQL, etc.",
              en: "Compare approaches: REST vs GraphQL, SQL vs NoSQL, etc.",
            },
          },
          {
            command: "/ck:ask",
            description: {
              vi: "Deep dive với 4 chuyên gia về câu hỏi kỹ thuật cụ thể",
              en: "Deep dive with 4 expert advisors on specific technical questions",
            },
            optional: true,
          },
        ],
      },
      {
        name: { vi: "Lên kế hoạch", en: "Planning" },
        duration: "20-30 min",
        steps: [
          {
            command: "/ck:plan",
            description: {
              vi: "Plan với API contracts, DB schema, endpoints, phase files",
              en: "Plan with API contracts, DB schema, endpoints, phase files",
            },
          },
        ],
      },
      {
        name: { vi: "Eng Review", en: "Eng Review" },
        duration: "10-20 min",
        steps: [
          {
            command: "/plan-eng-review",
            description: {
              vi: "Architecture diagram, data flow, edge cases, performance, test coverage",
              en: "Architecture diagram, data flow, edge cases, performance, test coverage",
            },
          },
        ],
      },
      {
        name: { vi: "Triển khai", en: "Implementation" },
        duration: "30-60 min",
        steps: [
          {
            command: "/ck:cook @plan.md",
            description: {
              vi: "Auto: scout, code, test, review. DB migrations, API endpoints, business logic",
              en: "Auto: scout, code, test, review. DB migrations, API endpoints, business logic",
            },
          },
        ],
      },
      {
        name: { vi: "Ship", en: "Ship" },
        duration: "10 min",
        steps: [
          {
            command: "/ck:ship",
            description: {
              vi: "Test, review, version bump, PR",
              en: "Test, review, version bump, PR",
            },
          },
        ],
      },
    ],
    tips: [
      {
        vi: "Thêm /ck:better-auth trước implementation cho auth features",
        en: "Add /ck:better-auth before implementation for auth features",
      },
      {
        vi: "Thêm /ck:payment-integration cho tính năng thanh toán",
        en: "Add /ck:payment-integration for payment features",
      },
      {
        vi: "Dùng /ck:databases cho schema phức tạp trước khi plan",
        en: "Use /ck:databases for complex schema design before planning",
      },
    ],
  },
  {
    id: "design-first-pipeline",
    title: {
      vi: "Design-First — Ưu tiên UI",
      en: "Design-First — UI Priority",
    },
    description: {
      vi: "Bắt đầu với design system và visual exploration trước khi plan. Cho landing pages, marketing sites, redesigns.",
      en: "Start with design system and visual exploration before planning. For landing pages, marketing sites, redesigns.",
    },
    level: "intermediate",
    duration: "1-3 hrs",
    category: "advanced-pipelines",
    steps: [
      { command: "/design-consultation", label: { vi: "system", en: "system" } },
      { command: "/design-shotgun", label: { vi: "explore", en: "explore" } },
      { command: "/ck:plan --fast", label: { vi: "plan", en: "plan" } },
      { command: "/ck:frontend-design", label: { vi: "build", en: "build" } },
      { command: "/ck:ship", label: { vi: "ship", en: "ship" } },
    ],
    phases: [
      {
        name: { vi: "Design System", en: "Design System" },
        duration: "20-30 min",
        steps: [
          {
            command: "/design-consultation",
            description: {
              vi: "Chọn aesthetic, typography, color palette. Output: DESIGN.md",
              en: "Choose aesthetic, typography, color palette. Output: DESIGN.md",
            },
          },
        ],
      },
      {
        name: { vi: "Explore Designs", en: "Explore Designs" },
        duration: "15-30 min",
        steps: [
          {
            command: "/design-shotgun",
            description: {
              vi: "Generate 3-5 visual variants, so sánh, chọn approved design",
              en: "Generate 3-5 visual variants, compare on board, pick approved design",
            },
          },
          {
            command: "/ck:stitch generate",
            description: {
              vi: "AI generate high-fidelity design, export HTML + Tailwind",
              en: "AI generate high-fidelity design, export HTML + Tailwind",
            },
            alternative: {
              vi: "Thay cho design-shotgun",
              en: "Alternative to design-shotgun",
            },
          },
        ],
      },
      {
        name: { vi: "Plan", en: "Plan" },
        duration: "15-20 min",
        steps: [
          {
            command: "/ck:plan --fast",
            description: {
              vi: "Plan nhanh (không cần research — design đã xong). Focus: components, responsive, interactions",
              en: "Quick plan (no research needed — design is done). Focus: components, responsive, interactions",
            },
          },
        ],
      },
      {
        name: { vi: "Implement UI", en: "Implement UI" },
        duration: "30-60 min",
        steps: [
          {
            command: "/ck:frontend-design",
            description: {
              vi: "Code UI từ approved design. Font >= 16px, mobile-first, anti-slop rules",
              en: "Code UI from approved design. Font >= 16px, mobile-first, anti-slop rules",
            },
          },
        ],
      },
      {
        name: { vi: "Logic + Ship", en: "Logic + Ship" },
        duration: "20-30 min",
        steps: [
          {
            command: "/ck:cook @plan.md",
            description: {
              vi: "Tích hợp business logic",
              en: "Integrate business logic",
            },
          },
          {
            command: "/ck:ship",
            description: { vi: "Test, review, PR", en: "Test, review, PR" },
          },
        ],
      },
    ],
  },
  {
    id: "marketing-campaign-pipeline",
    title: {
      vi: "Marketing Campaign — Pipeline Đầy đủ",
      en: "Marketing Campaign — Full Pipeline",
    },
    description: {
      vi: "Marketing end-to-end: research, strategy, content creation, SEO, launch, measurement.",
      en: "End-to-end marketing: research, strategy, content creation, SEO, launch, measurement.",
    },
    level: "advanced",
    duration: "2-4 hrs",
    category: "advanced-pipelines",
    steps: [
      {
        command: "/ckm:marketing-research",
        label: { vi: "research", en: "research" },
      },
      {
        command: "/ckm:marketing-planning",
        label: { vi: "strategy", en: "strategy" },
      },
      { command: "/ckm:write:good", label: { vi: "content", en: "content" } },
      { command: "/ckm:seo", label: { vi: "SEO", en: "SEO" } },
      { command: "/ckm:campaign create", label: { vi: "launch", en: "launch" } },
      { command: "/ckm:analytics", label: { vi: "đo lường", en: "measure" } },
    ],
    phases: [
      {
        name: { vi: "Research", en: "Research" },
        duration: "30 min",
        steps: [
          {
            command: "/ckm:marketing-research",
            description: {
              vi: "Market intelligence, trends, opportunities",
              en: "Market intelligence, trends, opportunities",
            },
          },
          {
            command: "/ckm:competitor analyze",
            description: {
              vi: "Content gap, SEO comparison, positioning",
              en: "Content gap, SEO comparison, positioning",
            },
          },
          {
            command: "/ckm:persona",
            description: {
              vi: "Build customer personas với demographics, pain points",
              en: "Build customer personas with demographics, pain points",
            },
          },
          {
            command: "/ckm:marketing-psychology",
            description: {
              vi: "70+ mental models cho persuasion",
              en: "70+ mental models for persuasion",
            },
            optional: true,
          },
        ],
      },
      {
        name: { vi: "Chiến lược", en: "Strategy" },
        duration: "30 min",
        steps: [
          {
            command: "/ckm:marketing-planning",
            description: {
              vi: "Strategic plan: RACE/SOSTAC/STP, channel strategy, budget, timeline",
              en: "Strategic plan: RACE/SOSTAC/STP, channel strategy, budget, timeline",
            },
          },
          {
            command: "/ckm:funnel design",
            description: {
              vi: "Funnel: lead-magnet, webinar, product-launch",
              en: "Funnel structure: lead-magnet, webinar, product-launch",
            },
          },
        ],
      },
      {
        name: { vi: "Tạo nội dung", en: "Content Creation" },
        duration: "45-60 min",
        steps: [
          {
            command: "/ckm:write:good",
            description: {
              vi: "Blog posts với research và SEO",
              en: "Blog posts with research and SEO",
            },
          },
          {
            command: "/ck:copywriting",
            description: {
              vi: "Conversion copy cho landing page",
              en: "Landing page conversion copy",
            },
          },
          {
            command: "/ckm:email flow",
            description: {
              vi: "Email nurture sequences",
              en: "Email nurture sequences",
            },
          },
          {
            command: "/ckm:social",
            description: {
              vi: "Social posts cho Twitter, LinkedIn, Instagram, TikTok",
              en: "Social posts for Twitter, LinkedIn, Instagram, TikTok",
            },
          },
        ],
      },
      {
        name: { vi: "SEO", en: "SEO" },
        duration: "15-20 min",
        steps: [
          {
            command: "/ckm:seo audit",
            description: {
              vi: "Technical SEO analysis",
              en: "Technical SEO analysis",
            },
          },
          {
            command: "/ckm:seo keywords",
            description: {
              vi: "Keyword research cho niche",
              en: "Keyword research for niche",
            },
          },
          {
            command: "/ckm:write:enhance",
            description: {
              vi: "Tối ưu content cho SEO",
              en: "Optimize content for SEO",
            },
          },
        ],
      },
      {
        name: { vi: "Launch", en: "Launch" },
        duration: "20-30 min",
        steps: [
          {
            command: "/ckm:campaign create",
            description: {
              vi: "Orchestrate multi-channel campaign",
              en: "Orchestrate multi-channel campaign",
            },
          },
          {
            command: "/ckm:social schedule",
            description: {
              vi: "Schedule social media posts",
              en: "Schedule social media posts",
            },
          },
          {
            command: "/ckm:email sequence",
            description: {
              vi: "Activate email automation flows",
              en: "Activate email automation flows",
            },
          },
        ],
      },
      {
        name: { vi: "Đo lường", en: "Measure" },
        duration: "15 min",
        steps: [
          {
            command: "/ckm:analytics",
            description: {
              vi: "Setup GA4 tracking và attribution",
              en: "Setup GA4 tracking and attribution",
            },
          },
          {
            command: "/ckm:campaign analyze",
            description: {
              vi: "Phân tích performance",
              en: "Performance analysis",
            },
          },
          {
            command: "/ckm:funnel analyze",
            description: {
              vi: "Xác định bottleneck",
              en: "Conversion bottleneck identification",
            },
          },
        ],
      },
    ],
  },
  {
    id: "product-launch-pipeline",
    title: {
      vi: "Product Launch — Pipeline Đầy đủ",
      en: "Product Launch — Full Pipeline",
    },
    description: {
      vi: "Từ ý tưởng đến go-to-market: ideation, build MVP, branding, content, launch campaign.",
      en: "From idea to go-to-market: ideation, build MVP, branding, content, launch campaign.",
    },
    level: "advanced",
    duration: "1-2 days",
    category: "advanced-pipelines",
    steps: [
      { command: "/ck:brainstorm", label: { vi: "ý tưởng", en: "idea" } },
      { command: "/ck:bootstrap", label: { vi: "build", en: "build" } },
      { command: "/ckm:brand", label: { vi: "brand", en: "brand" } },
      {
        command: "/ckm:launch-strategy",
        label: { vi: "strategy", en: "strategy" },
      },
      { command: "/ckm:campaign create", label: { vi: "launch", en: "launch" } },
    ],
    phases: [
      {
        name: { vi: "Ý tưởng", en: "Ideation" },
        duration: "30 min",
        steps: [
          {
            command: "/ck:brainstorm",
            description: {
              vi: "Đánh giá feasibility, market fit",
              en: "Evaluate feasibility, market fit",
            },
          },
          {
            command: "/office-hours",
            description: {
              vi: "YC-style forcing questions: demand, status quo, wedge",
              en: "YC-style forcing questions: demand, status quo, wedge",
            },
            optional: true,
          },
        ],
      },
      {
        name: { vi: "Build", en: "Build" },
        duration: "4-8 hrs",
        steps: [
          {
            command: "/ck:bootstrap",
            description: {
              vi: "Full A-Z: research, tech stack, design, plan, code, test, docs",
              en: "Full A-Z: research, tech stack, design, plan, code, test, docs",
            },
          },
        ],
      },
      {
        name: { vi: "Marketing", en: "Marketing" },
        duration: "1-2 hrs",
        steps: [
          {
            command: "/ckm:brand",
            description: {
              vi: "Brand identity, voice, visual guidelines",
              en: "Brand identity, voice, visual guidelines",
            },
          },
          {
            command: "/ckm:launch-strategy",
            description: {
              vi: "Phased plan: pre-launch, launch day, post-launch momentum",
              en: "Phased plan: pre-launch, launch day, post-launch momentum",
            },
          },
        ],
      },
      {
        name: { vi: "Content", en: "Content" },
        duration: "1-2 hrs",
        steps: [
          {
            command: "/ckm:write:blog",
            description: {
              vi: "Announcement blog post",
              en: "Announcement blog post",
            },
          },
          {
            command: "/ckm:social",
            description: { vi: "Social media blitz", en: "Social media blitz" },
          },
          {
            command: '/ckm:email flow "launch"',
            description: {
              vi: "Launch email sequence",
              en: "Launch email sequence",
            },
          },
          {
            command: "/ckm:video script",
            description: {
              vi: "Script video demo sản phẩm",
              en: "Product demo video script",
            },
            optional: true,
          },
        ],
      },
      {
        name: { vi: "Go-to-Market", en: "Go-to-Market" },
        duration: "1-2 hrs",
        steps: [
          {
            command: "/ckm:campaign create",
            description: {
              vi: "Coordinate tất cả channels",
              en: "Coordinate all channels",
            },
          },
          {
            command: "/ckm:paid-ads",
            description: {
              vi: "Setup paid advertising",
              en: "Paid advertising setup",
            },
            optional: true,
          },
          {
            command: "/ckm:seo",
            description: {
              vi: "Tối ưu organic search",
              en: "Organic search optimization",
            },
          },
          {
            command: "/ckm:analytics",
            description: {
              vi: "Setup tracking + attribution",
              en: "Tracking + attribution setup",
            },
          },
        ],
      },
    ],
  },
  {
    id: "bug-hunt-pipeline",
    title: {
      vi: "Bug Hunt — Debug Có Hệ thống",
      en: "Bug Hunt — Systematic Debugging",
    },
    description: {
      vi: "Approach có hệ thống cho bug phức tạp: scout, diagnose root cause, predict impact, fix, verify.",
      en: "Systematic approach for complex bugs: scout, diagnose root cause, predict impact, fix, verify.",
    },
    level: "intermediate",
    duration: "30-60 min",
    category: "advanced-pipelines",
    steps: [
      { command: "/ck:scout", label: { vi: "tìm", en: "find" } },
      { command: "/ck:debug", label: { vi: "chuẩn đoán", en: "diagnose" } },
      { command: "/ck:fix", label: { vi: "fix", en: "fix" } },
      { command: "/ck:ship", label: { vi: "ship", en: "ship" } },
    ],
    phases: [
      {
        name: { vi: "Hiểu vấn đề", en: "Understand" },
        duration: "10-15 min",
        steps: [
          {
            command: "/ck:scout",
            description: {
              vi: "Tìm files liên quan, map dependencies",
              en: "Find related files, map dependencies",
            },
          },
          {
            command: "/ck:debug",
            description: {
              vi: "Root cause analysis với sequential thinking. Output: root cause + evidence",
              en: "Root cause analysis with sequential thinking. Output: root cause + evidence",
            },
          },
        ],
      },
      {
        name: { vi: "Plan Fix", en: "Plan Fix" },
        duration: "5-10 min",
        steps: [
          {
            command: "/ck:predict",
            description: {
              vi: "5 personas debate fix approach, catch side effects trước khi fix",
              en: "5 personas debate fix approach, catch side effects before fixing",
            },
            optional: true,
          },
        ],
      },
      {
        name: { vi: "Fix + Verify", en: "Fix + Verify" },
        duration: "10-20 min",
        steps: [
          {
            command: "/ck:fix",
            description: {
              vi: "Targeted fix với auto: test, verify, prevent regression",
              en: "Targeted fix with auto: test, verify, prevent regression",
            },
          },
        ],
      },
      {
        name: { vi: "Ship", en: "Ship" },
        duration: "5-10 min",
        steps: [
          {
            command: "/ck:ship",
            description: { vi: "Test, review, PR", en: "Test, review, PR" },
          },
        ],
      },
    ],
    shortcut: {
      vi: '/ck:fix "mô tả" — all-in-one cho bug đơn giản',
      en: '/ck:fix "description" — all-in-one for simple bugs',
    },
  },

  // ========================
  // GETTING STARTED
  // ========================
  {
    id: "build-new-feature",
    title: {
      vi: "Build Tính năng Mới",
      en: "Build a New Feature",
    },
    description: {
      vi: "Thêm tính năng mới vào ứng dụng một cách có hệ thống.",
      en: "Add new functionality to applications systematically.",
    },
    level: "beginner",
    duration: "15-30 min",
    category: "getting-started",
    steps: [
      { command: "/ck:brainstorm", label: { vi: "khám phá", en: "explore" } },
      { command: "/ck:plan", label: { vi: "cấu trúc", en: "structure" } },
      { command: "/ck:cook @plan.md", label: { vi: "build", en: "build" } },
    ],
    phases: [
      {
        name: { vi: "Ý tưởng", en: "Ideate" },
        duration: "5 min",
        steps: [
          {
            command: "/ck:brainstorm",
            description: {
              vi: "Khám phá các approach cho tính năng",
              en: "Explore feature approaches",
            },
          },
        ],
      },
      {
        name: { vi: "Plan", en: "Plan" },
        duration: "5-10 min",
        steps: [
          {
            command: "/ck:plan",
            description: {
              vi: "Tạo implementation plan với phases",
              en: "Create implementation plan with phases",
            },
          },
        ],
      },
      {
        name: { vi: "Triển khai", en: "Implement" },
        duration: "10-20 min",
        steps: [
          {
            command: "/ck:cook @plan.md",
            description: {
              vi: "Execute plan: scout, code, test, review",
              en: "Execute plan: scout, code, test, review",
            },
          },
        ],
      },
    ],
  },
  {
    id: "quick-implementation",
    title: {
      vi: "Triển khai Nhanh",
      en: "Quick Implementation",
    },
    description: {
      vi: "Fast track cho tính năng nhỏ, đã hiểu rõ.",
      en: "Fast track implementation for small, understood features.",
    },
    level: "beginner",
    duration: "5-10 min",
    category: "getting-started",
    steps: [
      { command: "/ck:scout", label: { vi: "tìm", en: "find" } },
      { command: "/ck:cook --fast", label: { vi: "build", en: "build" } },
    ],
    phases: [
      {
        name: { vi: "Scout & Build", en: "Scout & Build" },
        duration: "5-10 min",
        steps: [
          {
            command: '/ck:cook "task"',
            description: {
              vi: "Auto: research, plan, implement, test, review. Flags: --fast, --auto, --parallel",
              en: "Auto: research, plan, implement, test, review. Flags: --fast, --auto, --parallel",
            },
          },
        ],
      },
    ],
  },
  {
    id: "bootstrap-project",
    title: {
      vi: "Bắt đầu Dự án Mới",
      en: "Start New Project",
    },
    description: {
      vi: "Bootstrap dự án mới với nền tảng tốt.",
      en: "Bootstrap a brand new project with right foundations.",
    },
    level: "intermediate",
    duration: "30-45 min",
    category: "getting-started",
    steps: [
      { command: "/ck:research", label: { vi: "research", en: "research" } },
      { command: "/ck:bootstrap", label: { vi: "tạo", en: "create" } },
      {
        command: "/ck:project-organization",
        label: { vi: "tổ chức", en: "organize" },
      },
    ],
    phases: [
      {
        name: { vi: "Bootstrap", en: "Bootstrap" },
        duration: "30-45 min",
        steps: [
          {
            command: '/ck:bootstrap "description"',
            description: {
              vi: "Full setup: tech stack research, architecture, UI/UX design, implementation, docs",
              en: "Full setup: tech stack research, architecture, UI/UX design, implementation, docs",
            },
          },
        ],
      },
    ],
  },

  // ========================
  // DESIGN & FRONTEND
  // ========================
  {
    id: "frontend-design-aesthetics",
    title: { vi: "Frontend Design", en: "Frontend Design" },
    description: {
      vi: "Tạo UI đẹp với hướng dẫn từ design taste bots.",
      en: "Create beautiful user interfaces guided by design taste bots.",
    },
    level: "intermediate",
    duration: "20-40 min",
    category: "design-frontend",
    steps: [
      { command: "/ck:ui-ux-pro-max", label: { vi: "design", en: "design" } },
      { command: "/ck:frontend-design", label: { vi: "build", en: "build" } },
    ],
    phases: [
      {
        name: { vi: "Design Analysis", en: "Design Analysis" },
        duration: "10 min",
        steps: [
          {
            command: "/ck:ui-ux-pro-max",
            description: {
              vi: "Design intelligence: 50+ styles, 161 palettes, 57 font pairings",
              en: "Design intelligence: 50+ styles, 161 palettes, 57 font pairings",
            },
          },
        ],
      },
      {
        name: { vi: "Implementation", en: "Implementation" },
        duration: "15-30 min",
        steps: [
          {
            command: "/ck:frontend-design",
            description: {
              vi: "Code UI với font >= 16px, mobile-first, anti-slop rules",
              en: "Code UI with font >= 16px, mobile-first, anti-slop rules",
            },
          },
        ],
      },
    ],
  },
  {
    id: "stitch-ai-design",
    title: { vi: "AI Design với Stitch", en: "AI Design with Stitch" },
    description: {
      vi: "Generate UI designs từ text prompts dùng Google Stitch AI.",
      en: "Generate UI designs from text prompts using Google Stitch AI.",
    },
    level: "beginner",
    duration: "5-15 min",
    category: "design-frontend",
    steps: [
      {
        command: "/ck:stitch generate",
        label: { vi: "generate", en: "generate" },
      },
      { command: "/ck:stitch export", label: { vi: "export", en: "export" } },
      {
        command: "/ck:frontend-design",
        label: { vi: "implement", en: "implement" },
      },
    ],
    phases: [
      {
        name: { vi: "Generate & Export", en: "Generate & Export" },
        duration: "5-15 min",
        steps: [
          {
            command: '/ck:stitch generate "prompt"',
            description: {
              vi: "AI generate high-fidelity UI design",
              en: "AI generate high-fidelity UI design",
            },
          },
          {
            command: "/ck:stitch export --format all",
            description: {
              vi: "Export HTML + Tailwind + screenshot",
              en: "Export HTML + Tailwind + screenshot",
            },
          },
          {
            command: "/ck:frontend-design",
            description: {
              vi: "Implement components từ export",
              en: "Implement components from export",
            },
          },
        ],
      },
    ],
  },
  {
    id: "excalidraw-diagrams",
    title: { vi: "Excalidraw Diagrams", en: "Excalidraw Diagrams" },
    description: {
      vi: "Visualize architecture hoặc mockups bằng Excalidraw JSON.",
      en: "Visualize architectures or mockups using Excalidraw JSON.",
    },
    level: "beginner",
    duration: "10-15 min",
    category: "design-frontend",
    steps: [{ command: "/ck:excalidraw", label: { vi: "vẽ", en: "draw" } }],
    phases: [
      {
        name: { vi: "Tạo Diagram", en: "Create Diagram" },
        duration: "10-15 min",
        steps: [
          {
            command: "/ck:excalidraw",
            description: {
              vi: "Hand-drawn style với semantic color palette, auto-diagram capability",
              en: "Hand-drawn style diagrams with semantic color palette, auto-diagram capability",
            },
          },
        ],
      },
    ],
  },
  {
    id: "tech-graph-diagrams",
    title: { vi: "Publication Diagrams", en: "Publication Diagrams" },
    description: {
      vi: "Tạo SVG diagrams chất lượng cao cho docs và presentations.",
      en: "Build SVG diagrams ready for docs and presentations.",
    },
    level: "beginner",
    duration: "5-15 min",
    category: "design-frontend",
    steps: [
      { command: "/ck:tech-graph", label: { vi: "generate", en: "generate" } },
    ],
    phases: [
      {
        name: { vi: "Generate Diagram", en: "Generate Diagram" },
        duration: "5-15 min",
        steps: [
          {
            command: '/ck:tech-graph "topic"',
            description: {
              vi: "7 styles (flat-icon, blueprint, glassmorphism), 10 templates (architecture, sequence, ER, etc.)",
              en: "7 styles (flat-icon, blueprint, glassmorphism), 10 templates (architecture, sequence, ER, etc.)",
            },
          },
        ],
      },
    ],
  },

  // ========================
  // PLANNING & REVIEW
  // ========================
  {
    id: "plan-validate-implement",
    title: {
      vi: "Plan + Validate + Implement",
      en: "Plan + Validate + Implement",
    },
    description: {
      vi: "Tạo plan, validate qua interview gate, rồi implement.",
      en: "Create plan, validate through interview gate, then implement.",
    },
    level: "intermediate",
    duration: "20-40 min",
    category: "planning-review",
    steps: [
      { command: "/ck:plan", label: { vi: "plan", en: "plan" } },
      { command: "/ck:plan validate", label: { vi: "validate", en: "validate" } },
      { command: "/ck:cook @plan.md", label: { vi: "build", en: "build" } },
    ],
    phases: [
      {
        name: { vi: "Plan", en: "Plan" },
        duration: "10-15 min",
        steps: [
          {
            command: "/ck:plan",
            description: {
              vi: "Tạo implementation plan chi tiết",
              en: "Create detailed implementation plan",
            },
          },
        ],
      },
      {
        name: { vi: "Validate", en: "Validate" },
        duration: "5-10 min",
        steps: [
          {
            command: "/ck:plan validate",
            description: {
              vi: "Interview-style validation gate với auto-propagation",
              en: "Interview-style validation gate with auto-propagation",
            },
          },
        ],
      },
      {
        name: { vi: "Implement", en: "Implement" },
        duration: "10-20 min",
        steps: [
          {
            command: "/ck:cook @plan.md",
            description: {
              vi: "Execute validated plan",
              en: "Execute validated plan",
            },
          },
        ],
      },
    ],
  },
  {
    id: "red-team-plan-review",
    title: { vi: "Red-Team Plan Review", en: "Red-Team Plan Review" },
    description: {
      vi: "Adversarial review với security, failure, assumption, scope critics.",
      en: "Adversarial plan review with security, failure, assumption, and scope critics.",
    },
    level: "advanced",
    duration: "10-20 min",
    category: "planning-review",
    steps: [
      { command: "/ck:plan --hard", label: { vi: "red-team", en: "red-team" } },
    ],
    phases: [
      {
        name: { vi: "Adversarial Review", en: "Adversarial Review" },
        duration: "10-20 min",
        steps: [
          {
            command: '/ck:plan --hard "feature"',
            description: {
              vi: "4 adversarial reviewers: Security Adversary, Failure Analyst, Assumption Destroyer, Scope Critic",
              en: "4 adversarial reviewers: Security Adversary, Failure Analyst, Assumption Destroyer, Scope Critic",
            },
          },
        ],
      },
    ],
  },
  {
    id: "impact-prediction",
    title: { vi: "Impact Prediction", en: "Impact Prediction" },
    description: {
      vi: "5 expert personas debate thay đổi trước implementation.",
      en: "Five expert personas debate changes before implementation.",
    },
    level: "intermediate",
    duration: "5-10 min",
    category: "planning-review",
    steps: [
      { command: "/ck:predict", label: { vi: "dự đoán", en: "predict" } },
    ],
    phases: [
      {
        name: { vi: "Predict", en: "Predict" },
        duration: "5-10 min",
        steps: [
          {
            command: "/ck:predict",
            description: {
              vi: "5 personas: Architect, Security, Performance, UX, Operations",
              en: "5 personas: Architect, Security, Performance, UX, Operations",
            },
          },
        ],
      },
    ],
  },
  {
    id: "code-review-edge-cases",
    title: {
      vi: "Code Review với Edge Cases",
      en: "Code Review with Edge Cases",
    },
    description: {
      vi: "Implementation rồi edge case detection và code review.",
      en: "Implementation followed by edge case detection and code review.",
    },
    level: "intermediate",
    duration: "20-30 min",
    category: "planning-review",
    steps: [
      { command: "/ck:cook @plan.md", label: { vi: "build", en: "build" } },
      { command: "/ck:scout", label: { vi: "scout", en: "scout" } },
      { command: "/ck:code-review", label: { vi: "review", en: "review" } },
      { command: "/ck:git cm", label: { vi: "commit", en: "commit" } },
    ],
    phases: [
      {
        name: { vi: "Build & Review", en: "Build & Review" },
        duration: "20-30 min",
        steps: [
          {
            command: "/ck:cook @plan.md",
            description: { vi: "Implementation", en: "Implementation" },
          },
          {
            command: "/ck:scout",
            description: { vi: "Edge case detection", en: "Edge case detection" },
          },
          {
            command: "/ck:code-review",
            description: {
              vi: "2-pass + adversarial review",
              en: "2-pass + adversarial review",
            },
          },
          {
            command: "/ck:git cm",
            description: { vi: "Merge & commit", en: "Merge & commit" },
          },
        ],
      },
    ],
  },

  // ========================
  // DEBUGGING & FIXES
  // ========================
  {
    id: "fix-bug",
    title: { vi: "Fix Bug", en: "Fix Bug" },
    description: {
      vi: "Xác định root cause và tự động fix codebase issues.",
      en: "Identify root cause and automatically fix codebase issues.",
    },
    level: "beginner",
    duration: "10-20 min",
    category: "debugging-fixes",
    steps: [
      { command: "/ck:debug", label: { vi: "chuẩn đoán", en: "diagnose" } },
      { command: "/ck:fix", label: { vi: "fix", en: "fix" } },
      { command: "/ck:test", label: { vi: "verify", en: "verify" } },
    ],
    phases: [
      {
        name: { vi: "Fix Pipeline", en: "Fix Pipeline" },
        duration: "10-20 min",
        steps: [
          {
            command: "/ck:fix",
            description: {
              vi: "6-step: scout, diagnose, assess, fix, verify, prevent. Flags: --auto, --quick",
              en: "6-step: scout, diagnose, assess, fix, verify, prevent. Flags: --auto, --quick",
            },
          },
        ],
      },
    ],
  },
  {
    id: "security-audit",
    title: { vi: "Security Audit", en: "Security Audit" },
    description: {
      vi: "Scan vulnerabilities, review security, apply fixes.",
      en: "Scan for vulnerabilities, review security, apply fixes.",
    },
    level: "intermediate",
    duration: "15-25 min",
    category: "debugging-fixes",
    steps: [
      { command: "/ck:security-scan", label: { vi: "scan", en: "scan" } },
      {
        command: "/ck:code-review --security",
        label: { vi: "review", en: "review" },
      },
      { command: "/ck:fix --security", label: { vi: "fix", en: "fix" } },
    ],
    phases: [
      {
        name: { vi: "Security Pipeline", en: "Security Pipeline" },
        duration: "15-25 min",
        steps: [
          {
            command: "/ck:security-scan",
            description: {
              vi: "Vulnerability scan: OWASP Top 10, secrets, deps",
              en: "Vulnerability scan: OWASP Top 10, secrets, deps",
            },
          },
          {
            command: "/ck:code-review --security",
            description: {
              vi: "Deep security review",
              en: "Deep security review",
            },
          },
          {
            command: "/ck:fix --security",
            description: { vi: "Apply security fixes", en: "Apply security fixes" },
          },
        ],
      },
    ],
  },
  {
    id: "stride-security",
    title: { vi: "STRIDE Security Audit", en: "STRIDE Security Audit" },
    description: {
      vi: "STRIDE threat modeling với OWASP patterns và severity classification.",
      en: "STRIDE threat modeling with OWASP patterns and severity classification.",
    },
    level: "intermediate",
    duration: "10-20 min",
    category: "debugging-fixes",
    steps: [
      { command: "/ck:security", label: { vi: "audit", en: "audit" } },
    ],
    phases: [
      {
        name: { vi: "STRIDE Audit", en: "STRIDE Audit" },
        duration: "10-20 min",
        steps: [
          {
            command: "/ck:security",
            description: {
              vi: "STRIDE threat modeling + OWASP patterns với severity classification",
              en: "STRIDE threat modeling + OWASP patterns with severity classification",
            },
          },
        ],
      },
    ],
  },
  {
    id: "test-scenario-generation",
    title: {
      vi: "Tạo Test Scenarios",
      en: "Test Scenario Generation",
    },
    description: {
      vi: "Generate edge cases toàn diện theo 12 dimensions.",
      en: "Generate comprehensive edge cases across 12 dimensions.",
    },
    level: "beginner",
    duration: "5-10 min",
    category: "debugging-fixes",
    steps: [
      { command: "/ck:scenario", label: { vi: "generate", en: "generate" } },
    ],
    phases: [
      {
        name: { vi: "Generate Scenarios", en: "Generate Scenarios" },
        duration: "5-10 min",
        steps: [
          {
            command: "/ck:scenario",
            description: {
              vi: "12-dimensional feature decomposition cho edge cases toàn diện",
              en: "12-dimensional feature decomposition for comprehensive edge cases",
            },
          },
        ],
      },
    ],
  },

  // ========================
  // RESEARCH & DOCS
  // ========================
  {
    id: "visual-documentation",
    title: { vi: "Visual Documentation", en: "Visual Documentation" },
    description: {
      vi: "Generate visual explanations với ASCII, Mermaid, hoặc HTML.",
      en: "Generate visual explanations with ASCII, Mermaid, or HTML.",
    },
    level: "beginner",
    duration: "2-10 min",
    category: "research-docs",
    steps: [
      {
        command: "/ck:preview --explain",
        label: { vi: "visualize", en: "visualize" },
      },
    ],
    phases: [
      {
        name: { vi: "Generate Visuals", en: "Generate Visuals" },
        duration: "2-10 min",
        steps: [
          {
            command: '/ck:preview --explain "topic"',
            description: {
              vi: "Markdown với ASCII/Mermaid diagrams",
              en: "Markdown with ASCII/Mermaid diagrams",
            },
          },
          {
            command: "/ck:preview --html --explain",
            description: { vi: "HTML với theme toggle", en: "HTML with theme toggle" },
            alternative: { vi: "Cho output phong phú", en: "For rich output" },
          },
          {
            command: "/ck:preview --html --slides",
            description: { vi: "HTML slide deck", en: "HTML slide deck" },
            alternative: { vi: "Cho presentations", en: "For presentations" },
          },
        ],
      },
    ],
  },
  {
    id: "research-documentation",
    title: { vi: "Research & Documentation", en: "Research & Documentation" },
    description: {
      vi: "Research sâu topic, tìm official docs, generate project docs.",
      en: "Deep research a topic, find official docs, generate project docs.",
    },
    level: "intermediate",
    duration: "10-20 min",
    category: "research-docs",
    steps: [
      { command: "/ck:research", label: { vi: "research", en: "research" } },
      { command: "/ck:docs-seeker", label: { vi: "tìm docs", en: "find docs" } },
      { command: "/ck:docs", label: { vi: "generate", en: "generate" } },
    ],
    phases: [
      {
        name: { vi: "Research & Generate", en: "Research & Generate" },
        duration: "10-20 min",
        steps: [
          {
            command: '/ck:research "topic"',
            description: {
              vi: "Deep multi-source research",
              en: "Deep multi-source research",
            },
          },
          {
            command: '/ck:docs-seeker "library"',
            description: {
              vi: "Tìm official docs của library/framework",
              en: "Find official library/framework docs",
            },
          },
          {
            command: "/ck:docs",
            description: {
              vi: "Generate project documentation",
              en: "Generate project documentation",
            },
          },
        ],
      },
    ],
  },
  {
    id: "generate-llms-txt",
    title: { vi: "Generate llms.txt", en: "Generate llms.txt" },
    description: {
      vi: "Phân tích codebase và tạo file llms.txt toàn diện.",
      en: "Analyze the codebase and construct a comprehensive llms.txt file.",
    },
    level: "beginner",
    duration: "5-10 min",
    category: "research-docs",
    steps: [{ command: "/ck:llms", label: { vi: "generate", en: "generate" } }],
    phases: [
      {
        name: { vi: "Generate", en: "Generate" },
        duration: "5-10 min",
        steps: [
          {
            command: "/ck:llms",
            description: {
              vi: "Theo llmstxt.org specification",
              en: "Follows llmstxt.org specification",
            },
          },
        ],
      },
    ],
  },
  {
    id: "knowledge-graph",
    title: {
      vi: "Knowledge Graph Navigation",
      en: "Knowledge Graph Navigation",
    },
    description: {
      vi: "Build queryable knowledge graph từ codebase cho semantic navigation.",
      en: "Build queryable knowledge graph from codebase for semantic navigation.",
    },
    level: "intermediate",
    duration: "5-15 min",
    category: "research-docs",
    steps: [
      { command: "/ck:graphify", label: { vi: "graph", en: "graph" } },
      { command: "/ck:plan", label: { vi: "plan", en: "plan" } },
    ],
    phases: [
      {
        name: { vi: "Build & Navigate", en: "Build & Navigate" },
        duration: "5-15 min",
        steps: [
          {
            command: "/ck:graphify",
            description: {
              vi: "Tree-sitter AST (20+ languages), interactive visualization, 71.5x token savings",
              en: "Tree-sitter AST (20+ languages), interactive visualization, 71.5x token savings",
            },
          },
          {
            command: "/ck:plan",
            description: {
              vi: "Plan với full codebase context",
              en: "Plan with full codebase context",
            },
          },
        ],
      },
    ],
  },

  // ========================
  // SHIPPING
  // ========================
  {
    id: "ship-feature",
    title: { vi: "Ship Feature", en: "Ship Feature" },
    description: {
      vi: "Full shipping pipeline: merge, test, review, version, changelog, PR.",
      en: "Full shipping pipeline: merge, test, review, version, changelog, PR.",
    },
    level: "beginner",
    duration: "5-10 min",
    category: "shipping",
    steps: [{ command: "/ck:ship", label: { vi: "ship", en: "ship" } }],
    phases: [
      {
        name: { vi: "Ship", en: "Ship" },
        duration: "5-10 min",
        steps: [
          {
            command: "/ck:ship",
            description: {
              vi: "Auto: merge main, run tests, 2-pass code review + adversarial, bump version, changelog, PR",
              en: "Auto: merge main, run tests, 2-pass code review + adversarial, bump version, changelog, PR",
            },
          },
        ],
      },
    ],
  },
  {
    id: "deploy-application",
    title: { vi: "Deploy Application", en: "Deploy Application" },
    description: {
      vi: "Deploy lên 15+ platforms với auto-detection và cost optimization.",
      en: "Deploy to 15+ platforms with auto-detection and cost optimization.",
    },
    level: "intermediate",
    duration: "5-15 min",
    category: "shipping",
    steps: [{ command: "/ck:deploy", label: { vi: "deploy", en: "deploy" } }],
    phases: [
      {
        name: { vi: "Deploy", en: "Deploy" },
        duration: "5-15 min",
        steps: [
          {
            command: "/ck:deploy",
            description: {
              vi: "Auto-detect project type. Platforms: Vercel, Netlify, Railway, Fly.io, AWS, GCP, 15+ total",
              en: "Auto-detect project type. Platforms: Vercel, Netlify, Railway, Fly.io, AWS, GCP, 15+ total",
            },
          },
        ],
      },
    ],
  },
  {
    id: "devops-cicd",
    title: { vi: "DevOps & CI/CD", en: "DevOps & CI/CD" },
    description: {
      vi: "Setup CI/CD pipelines, Docker, Kubernetes, GitOps workflows.",
      en: "Setup CI/CD pipelines, Docker, Kubernetes, GitOps workflows.",
    },
    level: "advanced",
    duration: "20-40 min",
    category: "shipping",
    steps: [
      { command: "/ck:devops", label: { vi: "setup", en: "setup" } },
      { command: "/ck:deploy", label: { vi: "deploy", en: "deploy" } },
      { command: "/ck:test --e2e", label: { vi: "verify", en: "verify" } },
    ],
    phases: [
      {
        name: { vi: "Setup & Deploy", en: "Setup & Deploy" },
        duration: "20-40 min",
        steps: [
          {
            command: '/ck:devops "setup CI/CD"',
            description: {
              vi: "Configure pipelines, Docker, K8s",
              en: "Configure pipelines, Docker, K8s",
            },
          },
          {
            command: "/ck:deploy",
            description: { vi: "Deploy lên platform", en: "Deploy to platform" },
          },
          {
            command: "/ck:test --e2e",
            description: { vi: "Verify với E2E tests", en: "Verify with E2E tests" },
          },
        ],
      },
    ],
  },

  // ========================
  // BACKEND & INFRA
  // ========================
  {
    id: "database-operations",
    title: { vi: "Database Operations", en: "Database Operations" },
    description: {
      vi: "Design schemas, plan migrations, execute với safety gates.",
      en: "Design schemas, plan migrations, execute with safety gates.",
    },
    level: "intermediate",
    duration: "15-30 min",
    category: "backend-infra",
    steps: [
      { command: "/ck:databases", label: { vi: "design", en: "design" } },
      { command: "/ck:plan", label: { vi: "plan", en: "plan" } },
      {
        command: "/ck:cook @plan.md",
        label: { vi: "migrate", en: "migrate" },
      },
    ],
    phases: [
      {
        name: { vi: "Database Pipeline", en: "Database Pipeline" },
        duration: "15-30 min",
        steps: [
          {
            command: '/ck:databases "schema design"',
            description: {
              vi: "Design schema: MongoDB, PostgreSQL, MySQL, SQLite",
              en: "Design schema: MongoDB, PostgreSQL, MySQL, SQLite",
            },
          },
          {
            command: '/ck:plan "migration"',
            description: {
              vi: "Plan migration với safety",
              en: "Plan migration with safety",
            },
          },
          {
            command: "/ck:cook @plan.md",
            description: { vi: "Execute migration", en: "Execute migration" },
          },
        ],
      },
    ],
  },
  {
    id: "agentize-codebase",
    title: { vi: "Agentize Codebase", en: "Agentize Codebase" },
    description: {
      vi: "Convert code thành CLI tool + MCP server với shared core.",
      en: "Convert existing code into CLI tool + MCP server with shared core.",
    },
    level: "intermediate",
    duration: "15-30 min",
    category: "backend-infra",
    steps: [
      {
        command: "/ck:agentize --both",
        label: { vi: "agentize", en: "agentize" },
      },
    ],
    phases: [
      {
        name: { vi: "Agentize", en: "Agentize" },
        duration: "15-30 min",
        steps: [
          {
            command: "/ck:agentize --both",
            description: {
              vi: "Output: CLI tool + MCP server. Variants: --mcp, --cli, --both",
              en: "Output: CLI tool + MCP server. Variants: --mcp, --cli, --both",
            },
          },
        ],
      },
    ],
  },
  {
    id: "xia-port-features",
    title: {
      vi: "Research & Port Features",
      en: "Research & Port Features",
    },
    description: {
      vi: "Phân tích source repos và port features có cải tiến.",
      en: "Analyze source repos and port features with improvements.",
    },
    level: "advanced",
    duration: "10-30 min",
    category: "backend-infra",
    steps: [
      { command: "/ck:xia --compare", label: { vi: "phân tích", en: "analyze" } },
      { command: "/ck:xia --improve", label: { vi: "port", en: "port" } },
      { command: "/ck:test", label: { vi: "verify", en: "verify" } },
    ],
    phases: [
      {
        name: { vi: "Port Pipeline", en: "Port Pipeline" },
        duration: "10-30 min",
        steps: [
          {
            command: "/ck:xia <repo> --compare",
            description: {
              vi: "Source analysis và comparison",
              en: "Source analysis and comparison",
            },
          },
          {
            command: "/ck:xia <repo> [feature] --improve",
            description: {
              vi: "Port & refactor với improvements",
              en: "Port & refactor with improvements",
            },
          },
          {
            command: "/ck:test",
            description: {
              vi: "Validate ported features",
              en: "Validate ported features",
            },
          },
        ],
      },
    ],
  },

  // ========================
  // MARKETING
  // ========================
  {
    id: "write-publish-blog",
    title: { vi: "Viết & Publish Blog", en: "Write & Publish Blog" },
    description: {
      vi: "Research, draft, optimize, publish blog content.",
      en: "Research, draft, optimize, and publish blog content.",
    },
    level: "intermediate",
    duration: "20-30 min",
    category: "marketing",
    steps: [
      { command: "/ckm:write:good", label: { vi: "viết", en: "write" } },
      { command: "/ckm:seo audit", label: { vi: "SEO", en: "SEO" } },
      { command: "/ckm:write:publish", label: { vi: "publish", en: "publish" } },
    ],
    phases: [
      {
        name: { vi: "Viết & Publish", en: "Write & Publish" },
        duration: "20-30 min",
        steps: [
          {
            command: '/ckm:write:good "topic"',
            description: {
              vi: "Research & draft blog post",
              en: "Research & draft blog post",
            },
          },
          {
            command: "/ckm:seo audit",
            description: { vi: "SEO optimization", en: "SEO optimization" },
          },
          {
            command: "/ckm:write:enhance",
            description: {
              vi: "Enhance chất lượng nội dung",
              en: "Enhance content quality",
            },
          },
          {
            command: "/ckm:write:publish",
            description: { vi: "Format & publish", en: "Format & publish" },
          },
        ],
      },
    ],
  },
  {
    id: "email-sequences",
    title: {
      vi: "Tạo Email Sequences",
      en: "Create Email Sequences",
    },
    description: {
      vi: "Build email automation với personas, flows, copy, sequences.",
      en: "Build email automation with personas, flows, copy, and sequences.",
    },
    level: "intermediate",
    duration: "30-45 min",
    category: "marketing",
    steps: [
      { command: "/ckm:persona", label: { vi: "audience", en: "audience" } },
      { command: "/ckm:email flow", label: { vi: "design", en: "design" } },
      { command: "/ck:copywriting", label: { vi: "copy", en: "copy" } },
      {
        command: "/ckm:email sequence",
        label: { vi: "automate", en: "automate" },
      },
    ],
    phases: [
      {
        name: { vi: "Email Pipeline", en: "Email Pipeline" },
        duration: "30-45 min",
        steps: [
          {
            command: "/ckm:persona",
            description: {
              vi: "Define target audience",
              en: "Define target audience",
            },
          },
          {
            command: '/ckm:email flow "welcome"',
            description: {
              vi: "Design email flow",
              en: "Design email flow",
            },
          },
          {
            command: "/ck:copywriting",
            description: {
              vi: "Viết conversion copy",
              en: "Write conversion copy",
            },
          },
          {
            command: "/ckm:email sequence",
            description: {
              vi: "Generate automated sequences với A/B variants",
              en: "Generate automated sequences with A/B variants",
            },
          },
        ],
      },
    ],
  },
  {
    id: "seo-audit",
    title: { vi: "SEO Audit", en: "SEO Audit" },
    description: {
      vi: "Technical SEO analysis, keyword research, competitor comparison.",
      en: "Technical SEO analysis, keyword research, competitor comparison.",
    },
    level: "intermediate",
    duration: "15-25 min",
    category: "marketing",
    steps: [
      { command: "/ckm:seo audit", label: { vi: "audit", en: "audit" } },
      { command: "/ckm:seo keywords", label: { vi: "keywords", en: "keywords" } },
      {
        command: "/ckm:competitor seo",
        label: { vi: "so sánh", en: "compare" },
      },
    ],
    phases: [
      {
        name: { vi: "SEO Pipeline", en: "SEO Pipeline" },
        duration: "15-25 min",
        steps: [
          {
            command: '/ckm:seo audit "url"',
            description: {
              vi: "Technical SEO analysis",
              en: "Technical SEO analysis",
            },
          },
          {
            command: '/ckm:seo keywords "niche"',
            description: { vi: "Keyword research", en: "Keyword research" },
          },
          {
            command: '/ckm:competitor seo "url"',
            description: {
              vi: "So sánh SEO với đối thủ",
              en: "Competitor SEO comparison",
            },
          },
        ],
      },
    ],
  },
  {
    id: "competitor-analysis",
    title: { vi: "Phân tích Đối thủ", en: "Competitor Analysis" },
    description: {
      vi: "Deep dive vào đối thủ: content, SEO, positioning.",
      en: "Deep dive into competitors: content, SEO, positioning.",
    },
    level: "intermediate",
    duration: "25-35 min",
    category: "marketing",
    steps: [
      {
        command: "/ckm:competitor list",
        label: { vi: "xác định", en: "identify" },
      },
      {
        command: "/ckm:competitor analyze",
        label: { vi: "phân tích", en: "analyze" },
      },
      {
        command: "/ckm:marketing-research",
        label: { vi: "insights", en: "insights" },
      },
    ],
    phases: [
      {
        name: { vi: "Analysis Pipeline", en: "Analysis Pipeline" },
        duration: "25-35 min",
        steps: [
          {
            command: "/ckm:competitor list",
            description: { vi: "Xác định đối thủ", en: "Identify competitors" },
          },
          {
            command: '/ckm:competitor analyze "url"',
            description: {
              vi: "Deep dive analysis",
              en: "Deep dive analysis",
            },
          },
          {
            command: "/ckm:competitor content",
            description: { vi: "Content audit", en: "Content audit" },
          },
          {
            command: "/ckm:marketing-research",
            description: {
              vi: "Extract strategic insights",
              en: "Extract strategic insights",
            },
          },
        ],
      },
    ],
  },

  // ========================
  // MEDIA & CREATIVE
  // ========================
  {
    id: "video-content",
    title: { vi: "Video Content", en: "Video Content" },
    description: {
      vi: "Tạo programmatic video với React dùng Remotion.",
      en: "Create programmatic video with React using Remotion.",
    },
    level: "intermediate",
    duration: "20-40 min",
    category: "media-creative",
    steps: [
      { command: "/ck:remotion", label: { vi: "tạo", en: "create" } },
      { command: "render", label: { vi: "export", en: "export" } },
    ],
    phases: [
      {
        name: { vi: "Video Pipeline", en: "Video Pipeline" },
        duration: "20-40 min",
        steps: [
          {
            command: "/ck:remotion",
            description: {
              vi: "Tạo video với React: animations, text, 3D, audio sync",
              en: "Create video with React: animations, text, 3D, audio sync",
            },
          },
        ],
      },
    ],
  },
  {
    id: "showcase-social",
    title: {
      vi: "Showcase & Social Content",
      en: "Showcase & Social Content",
    },
    description: {
      vi: "Build interactive HTML showcase cho repos và social platforms.",
      en: "Build interactive HTML showcase for repos and social platforms.",
    },
    level: "beginner",
    duration: "5-10 min",
    category: "media-creative",
    steps: [
      { command: "/ck:show-off", label: { vi: "tạo", en: "create" } },
    ],
    phases: [
      {
        name: { vi: "Create Showcase", en: "Create Showcase" },
        duration: "5-10 min",
        steps: [
          {
            command: "/ck:show-off",
            description: {
              vi: "Multi-section layout với parallax, theme toggle, bilingual, auto-screenshot. Ratios: 16:9, 9:16, 1:1",
              en: "Multi-section layout with parallax, theme toggle, bilingual, auto-screenshot. Ratios: 16:9, 9:16, 1:1",
            },
          },
        ],
      },
    ],
  },
  {
    id: "youtube-production",
    title: { vi: "YouTube Production", en: "YouTube Production" },
    description: {
      vi: "Script, storyboard, voiceover, metadata optimization cho YouTube.",
      en: "Script, storyboard, voiceover, and metadata optimization for YouTube.",
    },
    level: "advanced",
    duration: "45-60 min",
    category: "media-creative",
    steps: [
      { command: "/ckm:video script", label: { vi: "script", en: "script" } },
      { command: "/ckm:video create", label: { vi: "tạo", en: "create" } },
      { command: "/ckm:seo keywords", label: { vi: "SEO", en: "SEO" } },
    ],
    phases: [
      {
        name: { vi: "Production Pipeline", en: "Production Pipeline" },
        duration: "45-60 min",
        steps: [
          {
            command: '/ckm:video script "topic"',
            description: {
              vi: "Viết script & planning",
              en: "Write script & planning",
            },
          },
          {
            command: "/ckm:video storyboard",
            description: {
              vi: "Tạo visual storyboard",
              en: "Create visual storyboard",
            },
          },
          {
            command: "/ckm:video create",
            description: { vi: "Produce video", en: "Produce video" },
          },
          {
            command: '/ckm:seo keywords "video"',
            description: {
              vi: "Optimize metadata cho YouTube",
              en: "Optimize metadata for YouTube",
            },
          },
        ],
      },
    ],
  },
  {
    id: "sprint-retro",
    title: { vi: "Sprint Retrospective", en: "Sprint Retrospective" },
    description: {
      vi: "Phân tích git history cho sprint metrics và team insights.",
      en: "Analyze git history for sprint metrics and team insights.",
    },
    level: "beginner",
    duration: "2-5 min",
    category: "media-creative",
    steps: [
      { command: "/ck:retro", label: { vi: "phân tích", en: "analyze" } },
    ],
    phases: [
      {
        name: { vi: "Retrospective", en: "Retrospective" },
        duration: "2-5 min",
        steps: [
          {
            command: "/ck:retro",
            description: {
              vi: "Commits/day, LOC changes, file hotspots, churn rate, test ratio",
              en: "Commits/day, LOC changes, file hotspots, churn rate, test ratio",
            },
          },
        ],
      },
    ],
  },
];
