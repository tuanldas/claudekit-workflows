import type { Locale, LocalizedString } from "@/types/workflow";

export const DEFAULT_LOCALE: Locale = "vi";

export const uiStrings = {
  appTitle: { vi: "Workflows", en: "Workflows" },
  appSubtitle: {
    vi: "Học ClaudeKit qua các workflow trực quan, tương tác được.",
    en: "Learn ClaudeKit through interactive workflow visualization.",
  },
  appBadge: { vi: "Hướng dẫn Workflow", en: "Workflow Guide" },
  searchPlaceholder: {
    vi: "Tìm workflow…",
    en: "Search workflows…",
  },
  workflowsCount: {
    vi: (n: number) => `${n} workflow`,
    en: (n: number) => `${n} workflow${n !== 1 ? "s" : ""}`,
  },
  noResults: {
    vi: "Không có workflow nào phù hợp.",
    en: "No workflows match your search.",
  },
  phasesHeader: { vi: "Các Phase", en: "Workflow Phases" },
  flowOverviewHeader: { vi: "Tổng quan Flow", en: "Flow Overview" },
  tipsHeader: { vi: "Mẹo", en: "Tips" },
  shortcutHeader: { vi: "Lối tắt", en: "Shortcut" },
  optionalBadge: { vi: "tùy chọn", en: "optional" },
  level: {
    beginner: { vi: "Cơ bản", en: "Beginner" },
    intermediate: { vi: "Trung cấp", en: "Intermediate" },
    advanced: { vi: "Nâng cao", en: "Advanced" },
  },
  categories: {
    all: { vi: "Tất cả", en: "All" },
    "advanced-pipelines": {
      vi: "Pipeline Nâng cao",
      en: "Advanced Pipelines",
    },
    "getting-started": { vi: "Bắt đầu", en: "Getting Started" },
    "design-frontend": { vi: "Design & Frontend", en: "Design & Frontend" },
    "planning-review": { vi: "Plan & Review", en: "Planning & Review" },
    "debugging-fixes": { vi: "Debug & Fix", en: "Debugging & Fixes" },
    "backend-infra": { vi: "Backend & Infra", en: "Backend & Infra" },
    shipping: { vi: "Triển khai", en: "Shipping" },
    "research-docs": { vi: "Research & Docs", en: "Research & Docs" },
    marketing: { vi: "Marketing", en: "Marketing" },
    "media-creative": { vi: "Media & Sáng tạo", en: "Media & Creative" },
  },
  translationBanner: {
    fromEn: {
      vi: "Đang hiển thị bản tiếng Việt vì bản dịch tiếng Anh chưa có.",
      en: "Showing Vietnamese version — English translation coming soon.",
    },
    fromVi: {
      vi: "Đang hiển thị bản tiếng Anh vì bản tiếng Việt chưa có.",
      en: "Showing English version — Vietnamese translation coming soon.",
    },
  },
  nav: {
    workflows: { vi: "Tất cả workflows", en: "All workflows" },
    docs: { vi: "Tài liệu", en: "Docs" },
    skills: { vi: "Skills", en: "Skills" },
    docsStub: { vi: "Docs nav (Phase 3)", en: "Docs nav (Phase 3)" },
    skillsStub: { vi: "Skills nav (Phase 6)", en: "Skills nav (Phase 6)" },
  },
  topbar: {
    searchPlaceholder: { vi: "Tìm kiếm…", en: "Search…" },
    searchHint: { vi: "Cmd+K", en: "Cmd+K" },
    themeToggle: { vi: "Đổi giao diện", en: "Toggle theme" },
  },
  theme: {
    light: { vi: "Sáng", en: "Light" },
    dark: { vi: "Tối", en: "Dark" },
    system: { vi: "Theo hệ thống", en: "System" },
  },
  breadcrumb: {
    home: { vi: "Trang chủ", en: "Home" },
    workflows: { vi: "Workflows", en: "Workflows" },
    docs: { vi: "Docs", en: "Docs" },
    skills: { vi: "Skills", en: "Skills" },
  },
} as const;

export function t(s: LocalizedString, locale: Locale): string {
  return s[locale];
}
