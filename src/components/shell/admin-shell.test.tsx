import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageProvider } from "@/i18n/language-context";
import { ThemeProvider } from "@/lib/theme-context";
import { AdminShell } from "./admin-shell";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/vi/workflows"),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LanguageProvider locale="vi">
      <ThemeProvider>{ui}</ThemeProvider>
    </LanguageProvider>,
  );
}

describe("AdminShell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sidebar landmark", () => {
    renderWithProviders(
      <AdminShell>
        <div>content</div>
      </AdminShell>,
    );
    expect(
      screen.getByRole("navigation", { name: /sidebar/i }),
    ).toBeInTheDocument();
  });

  it("renders topbar (banner) landmark", () => {
    renderWithProviders(
      <AdminShell>
        <div>content</div>
      </AdminShell>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders children inside main slot", () => {
    renderWithProviders(
      <AdminShell>
        <div data-testid="page-content">hello</div>
      </AdminShell>,
    );
    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByTestId("page-content"));
  });
});
