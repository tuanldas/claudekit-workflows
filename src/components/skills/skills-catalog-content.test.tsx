import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SkillsCatalogContent } from "./skills-catalog-content";
import type { Skill } from "@/types/skill";

const replaceMock = vi.fn();
const searchParamsMock = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock, push: vi.fn() }),
  useSearchParams: () => searchParamsMock,
  usePathname: () => "/vi/skills",
}));

function setQuery(params: Record<string, string>) {
  Array.from(searchParamsMock.keys()).forEach((k) =>
    searchParamsMock.delete(k),
  );
  Object.entries(params).forEach(([k, v]) => searchParamsMock.set(k, v));
}

const fixtureSkills: Skill[] = [
  {
    id: "ck-plan",
    name: "ck:plan",
    description: "Planning skill for architecture",
    tags: ["planning"],
    group: "ck-plan",
    path: "ck-plan/SKILL.md",
    excerpt: "...",
  },
  {
    id: "ck-cook",
    name: "ck:cook",
    description: "Implementation skill",
    tags: ["coding"],
    group: "ck-cook",
    path: "ck-cook/SKILL.md",
    excerpt: "...",
  },
  {
    id: "analytics",
    name: "ckm:analytics",
    description: "Marketing analytics dashboards",
    tags: ["marketing"],
    group: "analytics",
    path: "analytics/SKILL.md",
    excerpt: "...",
  },
  {
    id: "ai-rules-setup",
    name: "ai-rules-setup",
    description: "Setup AI agent rules",
    tags: [],
    group: "ai-rules-setup",
    path: "ai-rules-setup/SKILL.md",
    excerpt: "...",
  },
];

describe("SkillsCatalogContent", () => {
  beforeEach(() => {
    replaceMock.mockClear();
    setQuery({});
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all skills initially (no query params)", () => {
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    expect(screen.getAllByRole("article")).toHaveLength(fixtureSkills.length);
  });

  it("renders search input with placeholder", () => {
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    expect(
      screen.getByPlaceholderText(/tìm|search/i),
    ).toBeInTheDocument();
  });

  it("filters by group from URL query (?group=ck)", () => {
    setQuery({ group: "ck" });
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    const cards = screen.getAllByRole("article");
    expect(cards.length).toBe(2);
  });

  it("renders group filter options with derived plugins and All option first", () => {
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    const select = screen.getByLabelText(/nhóm|group/i) as HTMLSelectElement;
    const values = Array.from(select.options).map((o) => o.value);
    // First option = empty string (All sentinel)
    expect(values[0]).toBe("");
    expect(values).toContain("ck");
    expect(values).toContain("ckm");
  });

  it("calls router.replace with ?group= when selecting a group", () => {
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    const select = screen.getByLabelText(
      /nhóm|group/i,
    ) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "ck" } });
    expect(replaceMock).toHaveBeenCalledWith(
      "/vi/skills?group=ck",
      expect.objectContaining({ scroll: false }),
    );
  });

  it("calls router.replace with ?q= after debounce when typing in search", async () => {
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    const input = screen.getByPlaceholderText(/tìm|search/i);
    fireEvent.change(input, { target: { value: "plan" } });
    // Before debounce window flushes, no replace yet.
    expect(replaceMock).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    await waitFor(() =>
      expect(replaceMock).toHaveBeenLastCalledWith(
        "/vi/skills?q=plan",
        expect.objectContaining({ scroll: false }),
      ),
    );
  });

  it("filters by local search query immediately (UI updates while debounce pending)", () => {
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    const input = screen.getByPlaceholderText(/tìm|search/i);
    fireEvent.change(input, { target: { value: "marketing" } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("ckm:analytics")).toBeInTheDocument();
  });

  it("seeds search input from ?q= URL param", () => {
    setQuery({ q: "PLAN" });
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    const input = screen.getByPlaceholderText(
      /tìm|search/i,
    ) as HTMLInputElement;
    expect(input.value).toBe("PLAN");
    expect(screen.getByText("ck:plan")).toBeInTheDocument();
  });

  it("shows empty state when no match", () => {
    render(<SkillsCatalogContent skills={fixtureSkills} locale="vi" />);
    fireEvent.change(screen.getByPlaceholderText(/tìm|search/i), {
      target: { value: "nonexistent-xyz-abc" },
    });
    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText(/không|no match|no skills/i)).toBeInTheDocument();
  });

  it("shows CI-aware empty state when skills array is empty", () => {
    render(<SkillsCatalogContent skills={[]} locale="vi" />);
    expect(
      screen.getAllByText(/skills sync|chưa được|chưa cấu hình/i).length,
    ).toBeGreaterThan(0);
  });
});
