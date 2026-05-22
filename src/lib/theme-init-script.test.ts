import { describe, it, expect } from "vitest";
import { getThemeInitScript } from "./theme-init-script";

describe("getThemeInitScript", () => {
  it("returns non-empty IIFE string", () => {
    const script = getThemeInitScript();
    expect(typeof script).toBe("string");
    expect(script.length).toBeGreaterThan(0);
    expect(script).toMatch(/\(function\s*\(\s*\)\s*\{/);
  });

  it("reads from localStorage key 'claudekit-theme'", () => {
    const script = getThemeInitScript();
    expect(script).toContain("localStorage.getItem('claudekit-theme')");
  });

  it("queries prefers-color-scheme media for system mode", () => {
    const script = getThemeInitScript();
    expect(script).toContain("prefers-color-scheme: dark");
  });

  it("toggles document.documentElement classList", () => {
    const script = getThemeInitScript();
    expect(script).toContain("document.documentElement.classList");
    expect(script).toContain("'dark'");
  });

  it("guards with try/catch so it never throws on storage blocked", () => {
    const script = getThemeInitScript();
    expect(script).toMatch(/try\s*\{/);
    expect(script).toMatch(/catch/);
  });

  it("executes successfully when evaluated with dark stored", () => {
    const script = getThemeInitScript();
    const root = document.createElement("html");
    const doc = {
      documentElement: root,
    };
    const win = {
      localStorage: {
        getItem: (k: string) => (k === "claudekit-theme" ? "dark" : null),
      },
      matchMedia: () => ({ matches: false }),
      document: doc,
    };
    new Function("window", "document", "localStorage", script)(
      win,
      doc,
      win.localStorage,
    );
    expect(root.classList.contains("dark")).toBe(true);
  });

  it("does NOT add dark class when stored=light", () => {
    const script = getThemeInitScript();
    const root = document.createElement("html");
    const doc = { documentElement: root };
    const win = {
      localStorage: {
        getItem: (k: string) => (k === "claudekit-theme" ? "light" : null),
      },
      matchMedia: () => ({ matches: true }),
      document: doc,
    };
    new Function("window", "document", "localStorage", script)(
      win,
      doc,
      win.localStorage,
    );
    expect(root.classList.contains("dark")).toBe(false);
  });

  it("system mode follows OS preference (matches=true → dark)", () => {
    const script = getThemeInitScript();
    const root = document.createElement("html");
    const doc = { documentElement: root };
    const win = {
      localStorage: { getItem: () => null },
      matchMedia: () => ({ matches: true }),
      document: doc,
    };
    new Function("window", "document", "localStorage", script)(
      win,
      doc,
      win.localStorage,
    );
    expect(root.classList.contains("dark")).toBe(true);
  });
});
