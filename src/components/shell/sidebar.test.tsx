import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/i18n/language-context";
import { Sidebar } from "./sidebar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

function renderSidebar(locale: "vi" | "en" = "vi") {
  return render(
    <LanguageProvider locale={locale}>
      <Sidebar locale={locale} />
    </LanguageProvider>,
  );
}

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders workflows nav when pathname starts with /vi/workflows", () => {
    vi.mocked(usePathname).mockReturnValue("/vi/workflows");
    renderSidebar("vi");
    expect(screen.getByText(/tất cả workflows/i)).toBeInTheDocument();
  });

  it("renders docs tree stub when pathname starts with /vi/docs", () => {
    vi.mocked(usePathname).mockReturnValue("/vi/docs/engineer/01-core");
    renderSidebar("vi");
    expect(screen.getByText(/docs nav/i)).toBeInTheDocument();
  });

  it("renders skills nav stub when pathname starts with /vi/skills", () => {
    vi.mocked(usePathname).mockReturnValue("/vi/skills");
    renderSidebar("vi");
    expect(screen.getByText(/skills nav/i)).toBeInTheDocument();
  });

  it("renders sidebar header with brand mark", () => {
    vi.mocked(usePathname).mockReturnValue("/vi/workflows");
    renderSidebar("vi");
    expect(screen.getByText("CK")).toBeInTheDocument();
  });

  it("respects locale: en path renders workflows nav for /en/workflows", () => {
    vi.mocked(usePathname).mockReturnValue("/en/workflows");
    renderSidebar("en");
    expect(screen.getByText(/all workflows/i)).toBeInTheDocument();
  });
});
