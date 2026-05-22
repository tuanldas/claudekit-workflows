import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageProvider } from "@/i18n/language-context";
import { WorkflowsPageContent } from "./workflows-page-content";
import { workflows } from "@/data/workflows";

const replaceMock = vi.fn();
const searchParamsMock = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock, push: vi.fn() }),
  useSearchParams: () => searchParamsMock,
  usePathname: () => "/vi/workflows",
}));

vi.mock("@/components/workflow-flow-canvas", () => ({
  WorkflowFlowCanvas: () => <div data-testid="flow-canvas" />,
}));

function renderPage(locale: "vi" | "en" = "vi") {
  return render(
    <LanguageProvider locale={locale}>
      <WorkflowsPageContent />
    </LanguageProvider>,
  );
}

function setQuery(params: Record<string, string>) {
  // mutate the same instance so re-renders see updates
  Array.from(searchParamsMock.keys()).forEach((k) =>
    searchParamsMock.delete(k),
  );
  Object.entries(params).forEach(([k, v]) => searchParamsMock.set(k, v));
}

describe("WorkflowsPageContent", () => {
  beforeEach(() => {
    replaceMock.mockClear();
    setQuery({});
  });

  it("renders all workflows by default", () => {
    renderPage("vi");
    // Every workflow title should be visible
    workflows.forEach((w) => {
      expect(screen.getByText(w.title.vi)).toBeInTheDocument();
    });
    // Count message reflects total
    expect(screen.getByText(`${workflows.length} workflow`)).toBeInTheDocument();
  });

  it("filters by category from URL query (?category=debugging-fixes)", () => {
    setQuery({ category: "debugging-fixes" });
    renderPage("vi");
    const expected = workflows.filter((w) => w.category === "debugging-fixes");
    // count visible workflow titles
    expected.forEach((w) => {
      expect(screen.getByText(w.title.vi)).toBeInTheDocument();
    });
    // a non-matching workflow should NOT appear
    const nonMatching = workflows.find(
      (w) => w.category !== "debugging-fixes" && w.category !== "all",
    );
    if (nonMatching) {
      expect(screen.queryByText(nonMatching.title.vi)).not.toBeInTheDocument();
    }
  });

  it("applies search filter from URL query (?q=...)", () => {
    setQuery({ q: "frontend" });
    renderPage("vi");
    // workflows whose title/desc/steps contain "frontend" should still render
    const frontendWorkflow = workflows.find((w) =>
      w.title.vi.toLowerCase().includes("frontend"),
    );
    if (frontendWorkflow) {
      expect(screen.getByText(frontendWorkflow.title.vi)).toBeInTheDocument();
    }
  });

  it("updates URL when category tab clicked", async () => {
    const user = userEvent.setup();
    renderPage("vi");
    const tab = screen.getByRole("button", { name: /debug & fix/i });
    await user.click(tab);
    expect(replaceMock).toHaveBeenCalled();
    const lastCall = replaceMock.mock.calls.at(-1)?.[0] as string;
    expect(lastCall).toContain("category=debugging-fixes");
  });

  it("removes category param when 'all' tab clicked", async () => {
    setQuery({ category: "debugging-fixes" });
    const user = userEvent.setup();
    renderPage("vi");
    const allTab = screen.getByRole("button", { name: /^tất cả$/i });
    await user.click(allTab);
    expect(replaceMock).toHaveBeenCalled();
    const lastCall = replaceMock.mock.calls.at(-1)?.[0] as string;
    expect(lastCall).not.toContain("category=debugging-fixes");
  });

  it("expands detail when workflow card clicked", async () => {
    const user = userEvent.setup();
    renderPage("vi");
    const first = workflows[0];
    const cardHeading = screen.getByText(first.title.vi);
    await user.click(cardHeading);
    // detail panel includes "Các Phase" heading
    expect(screen.getByText(/các phase/i)).toBeInTheDocument();
  });

  it("shows no-results message when search yields nothing", () => {
    setQuery({ q: "zzzzzznoworkflowmatches" });
    renderPage("vi");
    expect(
      screen.getByText(/không có workflow nào phù hợp/i),
    ).toBeInTheDocument();
  });

  it("does not render duplicate app title header (shell topbar owns it)", () => {
    renderPage("vi");
    // The legacy header had this exact app subtitle; ensure it's gone
    expect(
      screen.queryByText(
        /Học ClaudeKit qua các workflow trực quan, tương tác được/i,
      ),
    ).not.toBeInTheDocument();
  });
});
