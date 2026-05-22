import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveSidebarScroll,
  getSidebarScroll,
  SECTION_KEYS,
} from "./sidebar-scroll-storage";

describe("sidebar-scroll-storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("saves scroll position by key under sidebar-scroll prefix", () => {
    saveSidebarScroll("docs", 150);
    expect(sessionStorage.getItem("sidebar-scroll:docs")).toBe("150");
  });

  it("returns 0 when no stored value", () => {
    expect(getSidebarScroll("docs")).toBe(0);
  });

  it("returns stored numeric value", () => {
    sessionStorage.setItem("sidebar-scroll:docs", "250");
    expect(getSidebarScroll("docs")).toBe(250);
  });

  it("returns 0 when stored value is not numeric", () => {
    sessionStorage.setItem("sidebar-scroll:docs", "not-a-number");
    expect(getSidebarScroll("docs")).toBe(0);
  });

  it("stores integers (floors fractional input)", () => {
    saveSidebarScroll("workflows", 123.7);
    expect(sessionStorage.getItem("sidebar-scroll:workflows")).toBe("123");
  });

  it("does not throw when sessionStorage.setItem rejects (quota)", () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceeded");
      });
    expect(() => saveSidebarScroll("docs", 50)).not.toThrow();
    spy.mockRestore();
  });

  it("keeps section keys isolated", () => {
    saveSidebarScroll("docs", 100);
    saveSidebarScroll("workflows", 200);
    expect(getSidebarScroll("docs")).toBe(100);
    expect(getSidebarScroll("workflows")).toBe(200);
  });

  it("exposes SECTION_KEYS constant with workflows/docs/skills", () => {
    expect(SECTION_KEYS.WORKFLOWS).toBe("workflows");
    expect(SECTION_KEYS.DOCS).toBe("docs");
    expect(SECTION_KEYS.SKILLS).toBe("skills");
  });
});
