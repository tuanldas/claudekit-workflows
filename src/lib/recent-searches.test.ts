import { describe, it, expect, beforeEach } from "vitest";
import {
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches,
  RECENT_SEARCHES_KEY,
  RECENT_SEARCHES_MAX,
} from "./recent-searches";

describe("recent-searches storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns empty array when storage empty", () => {
    expect(getRecentSearches()).toEqual([]);
  });

  it("saves a query to top of list", () => {
    saveRecentSearch("plan");
    expect(getRecentSearches()).toEqual(["plan"]);
  });

  it("dedupes existing query and moves to top", () => {
    saveRecentSearch("a");
    saveRecentSearch("b");
    saveRecentSearch("a");
    expect(getRecentSearches()).toEqual(["a", "b"]);
  });

  it("caps at RECENT_SEARCHES_MAX entries (5)", () => {
    for (let i = 0; i < 7; i++) saveRecentSearch(`q${i}`);
    const recent = getRecentSearches();
    expect(recent).toHaveLength(RECENT_SEARCHES_MAX);
    expect(recent[0]).toBe("q6");
    expect(recent.at(-1)).toBe("q2");
  });

  it("ignores blank queries", () => {
    saveRecentSearch("   ");
    saveRecentSearch("");
    expect(getRecentSearches()).toEqual([]);
  });

  it("clears all stored entries", () => {
    saveRecentSearch("x");
    saveRecentSearch("y");
    clearRecentSearches();
    expect(getRecentSearches()).toEqual([]);
    expect(window.localStorage.getItem(RECENT_SEARCHES_KEY)).toBeNull();
  });

  it("returns [] gracefully when stored JSON malformed", () => {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, "{not-json");
    expect(getRecentSearches()).toEqual([]);
  });

  it("trims whitespace when saving", () => {
    saveRecentSearch("  plan  ");
    expect(getRecentSearches()).toEqual(["plan"]);
  });
});
