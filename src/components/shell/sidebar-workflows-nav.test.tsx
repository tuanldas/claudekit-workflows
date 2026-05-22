import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageProvider } from "@/i18n/language-context";
import { SidebarWorkflowsNav } from "./sidebar-workflows-nav";
import { categoryOrder } from "@/data/workflows";
import { uiStrings } from "@/i18n/translations";

const searchParamsMock = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => "/vi/workflows",
  useSearchParams: () => searchParamsMock,
}));

function setQuery(params: Record<string, string>) {
  Array.from(searchParamsMock.keys()).forEach((k) =>
    searchParamsMock.delete(k),
  );
  Object.entries(params).forEach(([k, v]) => searchParamsMock.set(k, v));
}

function renderNav(locale: "vi" | "en" = "vi") {
  return render(
    <LanguageProvider locale={locale}>
      <SidebarWorkflowsNav locale={locale} />
    </LanguageProvider>,
  );
}

describe("SidebarWorkflowsNav", () => {
  beforeEach(() => {
    setQuery({});
  });

  it("renders a link for every category in categoryOrder", () => {
    renderNav("vi");
    categoryOrder.forEach((cat) => {
      expect(
        screen.getByText(uiStrings.categories[cat].vi),
      ).toBeInTheDocument();
    });
  });

  it("category links point to /[locale]/workflows?category=<slug>", () => {
    renderNav("vi");
    const debugLink = screen
      .getByText(uiStrings.categories["debugging-fixes"].vi)
      .closest("a");
    expect(debugLink).toHaveAttribute(
      "href",
      "/vi/workflows?category=debugging-fixes",
    );
  });

  it("'all' link omits the category query param", () => {
    renderNav("vi");
    const allLink = screen
      .getByText(uiStrings.categories.all.vi)
      .closest("a");
    expect(allLink).toHaveAttribute("href", "/vi/workflows");
  });

  it("highlights active category when URL has ?category=<slug>", () => {
    setQuery({ category: "design-frontend" });
    renderNav("vi");
    const activeLink = screen
      .getByText(uiStrings.categories["design-frontend"].vi)
      .closest("a");
    expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  it("highlights 'all' when no category query is set", () => {
    renderNav("vi");
    const allLink = screen
      .getByText(uiStrings.categories.all.vi)
      .closest("a");
    expect(allLink).toHaveAttribute("aria-current", "page");
  });

  it("respects locale: en path renders en category labels", () => {
    renderNav("en");
    expect(
      screen.getByText(uiStrings.categories["design-frontend"].en),
    ).toBeInTheDocument();
  });
});
