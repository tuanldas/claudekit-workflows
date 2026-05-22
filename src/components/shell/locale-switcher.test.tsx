import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePathname, useRouter } from "next/navigation";
import { LocaleSwitcher } from "./locale-switcher";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preserves sub-path when switching from vi to en", async () => {
    vi.mocked(usePathname).mockReturnValue("/vi/docs/engineer/01-core");
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    render(<LocaleSwitcher />);
    await userEvent.click(screen.getByRole("button", { name: /en/i }));
    expect(push).toHaveBeenCalledWith("/en/docs/engineer/01-core");
  });

  it("preserves sub-path when switching from en to vi", async () => {
    vi.mocked(usePathname).mockReturnValue("/en/workflows");
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    render(<LocaleSwitcher />);
    await userEvent.click(screen.getByRole("button", { name: /vi/i }));
    expect(push).toHaveBeenCalledWith("/vi/workflows");
  });

  it("does not navigate when clicking already-active locale", async () => {
    vi.mocked(usePathname).mockReturnValue("/vi/workflows");
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    render(<LocaleSwitcher />);
    await userEvent.click(screen.getByRole("button", { name: /vi/i }));
    expect(push).not.toHaveBeenCalled();
  });
});
