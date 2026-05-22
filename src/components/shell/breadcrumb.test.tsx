import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "./breadcrumb";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("Breadcrumb", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "Workflows" segment for /vi/workflows', () => {
    vi.mocked(usePathname).mockReturnValue("/vi/workflows");
    render(<Breadcrumb locale="vi" />);
    expect(screen.getByText(/workflows/i)).toBeInTheDocument();
  });

  it("renders Docs and nested segments for /vi/docs/engineer/01-core-workflow", () => {
    vi.mocked(usePathname).mockReturnValue("/vi/docs/engineer/01-core-workflow");
    render(<Breadcrumb locale="vi" />);
    expect(screen.getByText(/docs/i)).toBeInTheDocument();
    expect(screen.getByText("engineer")).toBeInTheDocument();
    expect(screen.getByText("01-core-workflow")).toBeInTheDocument();
  });

  it('renders "Skills" segment for /vi/skills', () => {
    vi.mocked(usePathname).mockReturnValue("/vi/skills");
    render(<Breadcrumb locale="vi" />);
    expect(screen.getByText(/skills/i)).toBeInTheDocument();
  });

  it("renders nothing meaningful at locale root /vi", () => {
    vi.mocked(usePathname).mockReturnValue("/vi");
    const { container } = render(<Breadcrumb locale="vi" />);
    expect(container.textContent ?? "").toBeTruthy();
  });
});
