import { describe, it, expect } from "vitest";
import {
  getRedirectTarget,
  swapLocaleInPath,
  getLocaleFromPath,
} from "./locale-routing";

describe("getRedirectTarget", () => {
  it("redirects / to /vi", () => {
    expect(getRedirectTarget("/")).toBe("/vi");
  });

  it("redirects /workflows to /vi/workflows", () => {
    expect(getRedirectTarget("/workflows")).toBe("/vi/workflows");
  });

  it("redirects bare locale /vi to /vi/workflows", () => {
    expect(getRedirectTarget("/vi")).toBe("/vi/workflows");
  });

  it("redirects bare locale /en to /en/workflows", () => {
    expect(getRedirectTarget("/en")).toBe("/en/workflows");
  });

  it("passes /vi/... (with sub-path) through unchanged", () => {
    expect(getRedirectTarget("/vi/docs")).toBeNull();
    expect(getRedirectTarget("/vi/workflows")).toBeNull();
  });

  it("passes /en/... (with sub-path) through unchanged", () => {
    expect(getRedirectTarget("/en/docs/something")).toBeNull();
  });

  it("redirects unknown locale /xx/... to /vi prefix", () => {
    expect(getRedirectTarget("/xx/docs")).toBe("/vi/xx/docs");
  });

  it("returns null for Next.js internals (/_next/...)", () => {
    expect(getRedirectTarget("/_next/static/foo.js")).toBeNull();
    expect(getRedirectTarget("/_next/data/abc")).toBeNull();
  });

  it("returns null for /api/...", () => {
    expect(getRedirectTarget("/api/foo")).toBeNull();
    expect(getRedirectTarget("/api/revalidate")).toBeNull();
  });

  it("returns null for files with extension", () => {
    expect(getRedirectTarget("/sitemap.xml")).toBeNull();
    expect(getRedirectTarget("/favicon.ico")).toBeNull();
    expect(getRedirectTarget("/robots.txt")).toBeNull();
  });
});

describe("swapLocaleInPath", () => {
  it("swaps vi to en in docs path", () => {
    expect(swapLocaleInPath("/vi/docs/engineer", "en")).toBe(
      "/en/docs/engineer",
    );
  });

  it("swaps en to vi", () => {
    expect(swapLocaleInPath("/en/workflows", "vi")).toBe("/vi/workflows");
  });

  it("returns input unchanged when no locale prefix", () => {
    expect(swapLocaleInPath("/about", "en")).toBe("/about");
  });

  it("only replaces first segment", () => {
    expect(swapLocaleInPath("/vi/vi-flavored-page", "en")).toBe(
      "/en/vi-flavored-page",
    );
  });
});

describe("getLocaleFromPath", () => {
  it("returns vi for /vi/docs", () => {
    expect(getLocaleFromPath("/vi/docs")).toBe("vi");
  });

  it("returns en for /en", () => {
    expect(getLocaleFromPath("/en")).toBe("en");
  });

  it("returns default (vi) for unknown prefix", () => {
    expect(getLocaleFromPath("/about")).toBe("vi");
    expect(getLocaleFromPath("/")).toBe("vi");
  });
});
