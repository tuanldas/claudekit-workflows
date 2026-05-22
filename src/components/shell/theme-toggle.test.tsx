import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/lib/theme-context";
import { ThemeToggle } from "./theme-toggle";

const STORAGE_KEY = "claudekit-theme";

function renderToggle(locale: "vi" | "en" = "vi") {
  return render(
    <ThemeProvider>
      <ThemeToggle locale={locale} />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it("renders an enabled button", () => {
    renderToggle();
    const btn = screen.getByRole("button");
    expect(btn).toBeEnabled();
  });

  it("uses Vietnamese aria-label for vi locale", () => {
    renderToggle("vi");
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-label")).toMatch(/giao diện|đổi/i);
  });

  it("uses English aria-label for en locale", () => {
    renderToggle("en");
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-label")).toMatch(/theme|toggle/i);
  });

  it("cycles system → light on first click (default state is system)", async () => {
    const user = userEvent.setup();
    renderToggle();
    await user.click(screen.getByRole("button"));
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("cycles light → dark → system → light through full rotation", async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY, "light");
    renderToggle();
    const btn = screen.getByRole("button");

    await user.click(btn);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");

    await user.click(btn);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("system");

    await user.click(btn);
    expect(localStorage.getItem(STORAGE_KEY)).toBe("light");
  });

  it("renders sun icon when theme=light", () => {
    localStorage.setItem(STORAGE_KEY, "light");
    renderToggle();
    expect(screen.getByTestId("theme-icon-light")).toBeInTheDocument();
  });

  it("renders moon icon when theme=dark", () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    renderToggle();
    expect(screen.getByTestId("theme-icon-dark")).toBeInTheDocument();
  });

  it("renders monitor icon when theme=system", () => {
    localStorage.setItem(STORAGE_KEY, "system");
    renderToggle();
    expect(screen.getByTestId("theme-icon-system")).toBeInTheDocument();
  });

  it("toggles html.dark on click when going to dark", async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY, "light");
    renderToggle();
    await user.click(screen.getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
