import { describe, it, expect, beforeEach } from "vitest";
import {
  lockBodyScroll,
  unlockBodyScroll,
  __resetBodyScrollLockForTests,
} from "./body-scroll-lock";

describe("body-scroll-lock", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    __resetBodyScrollLockForTests();
  });

  it("sets body overflow to hidden when locked", () => {
    lockBodyScroll();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow when unlocked", () => {
    document.body.style.overflow = "auto";
    lockBodyScroll();
    expect(document.body.style.overflow).toBe("hidden");
    unlockBodyScroll();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("supports nested locks via lockCount", () => {
    lockBodyScroll();
    lockBodyScroll();
    unlockBodyScroll();
    expect(document.body.style.overflow).toBe("hidden");
    unlockBodyScroll();
    expect(document.body.style.overflow).toBe("");
  });

  it("does not go below zero on extra unlocks", () => {
    unlockBodyScroll();
    unlockBodyScroll();
    lockBodyScroll();
    expect(document.body.style.overflow).toBe("hidden");
    unlockBodyScroll();
    expect(document.body.style.overflow).toBe("");
  });
});
