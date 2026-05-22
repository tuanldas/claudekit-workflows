import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageProvider } from "@/i18n/language-context";
import {
  CommandPaletteProvider,
  useCommandPalette,
} from "./command-palette-context";
import { CommandPalette } from "./command-palette";
import { RECENT_SEARCHES_KEY } from "@/lib/recent-searches";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/vi/workflows",
}));

vi.mock("@/lib/search-client", () => ({
  loadSearchIndex: vi.fn(async () => ({
    isEmpty: false,
    search: () => [],
    searchGrouped: (query: string) => {
      const empty = { workflows: [], docs: [], skills: [] };
      if (!query.trim()) return empty;
      const q = query.toLowerCase();
      if (!q.includes("plan")) return empty;
      return {
        workflows: [
          {
            slug: "workflows?selected=plan-wf",
            title: "Planning Workflow",
            kind: "workflow",
            subtitle: "wf desc",
          },
        ],
        docs: [
          {
            slug: "vi/intro",
            title: "Intro to plan",
            kind: "doc",
            subtitle: "vi",
          },
        ],
        skills: [
          {
            slug: "skills/plan",
            title: "plan skill",
            kind: "skill",
            subtitle: "Skill",
          },
        ],
      };
    },
  })),
}));

function OpenOnMount() {
  const { openPalette } = useCommandPalette();
  return (
    <button type="button" onClick={openPalette} data-testid="open-btn">
      open
    </button>
  );
}

function Harness() {
  return (
    <LanguageProvider locale="vi">
      <CommandPaletteProvider>
        <OpenOnMount />
        <CommandPalette />
      </CommandPaletteProvider>
    </LanguageProvider>
  );
}

beforeEach(() => {
  pushMock.mockReset();
  window.localStorage.clear();
});

describe("CommandPalette", () => {
  it("opens on Cmd+K and closes on Esc", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.keyboard("{Meta>}k{/Meta}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("renders grouped results from 3 sources for 'plan' query", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await act(async () => {
      screen.getByTestId("open-btn").click();
    });
    const input = await screen.findByPlaceholderText(/workflow|search/i);
    await user.type(input, "plan");

    await screen.findByText("Planning Workflow");
    expect(screen.getByText("Intro to plan")).toBeInTheDocument();
    expect(screen.getByText("plan skill")).toBeInTheDocument();
  });

  it("saves recent search on selection and navigates", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await act(async () => {
      screen.getByTestId("open-btn").click();
    });
    const input = await screen.findByPlaceholderText(/workflow|search/i);
    await user.type(input, "plan");
    await screen.findByText("Planning Workflow");

    const wfItem = screen.getByText("Planning Workflow");
    await user.click(wfItem);

    await waitFor(() => expect(pushMock).toHaveBeenCalled());
    expect(pushMock.mock.calls[0][0]).toContain("plan-wf");
    const stored = JSON.parse(
      window.localStorage.getItem(RECENT_SEARCHES_KEY) || "[]",
    );
    expect(stored[0]).toBe("plan");
  });

  it("shows recent searches when query empty", async () => {
    window.localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(["plan", "cook"]),
    );
    render(<Harness />);
    await act(async () => {
      screen.getByTestId("open-btn").click();
    });
    await screen.findByRole("dialog");
    expect(screen.getByText("plan")).toBeInTheDocument();
    expect(screen.getByText("cook")).toBeInTheDocument();
  });

  it("clicking a recent search populates the input", async () => {
    window.localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(["plan"]),
    );
    const user = userEvent.setup();
    render(<Harness />);
    await act(async () => {
      screen.getByTestId("open-btn").click();
    });
    await screen.findByRole("dialog");
    await user.click(screen.getByText("plan"));
    const input = screen.getByPlaceholderText(/workflow|search/i) as HTMLInputElement;
    expect(input.value).toBe("plan");
  });

  it("does not render when closed", () => {
    render(<Harness />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
