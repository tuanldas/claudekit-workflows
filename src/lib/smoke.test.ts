import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2);
  });

  it('supports happy-dom', () => {
    expect(typeof document).toBe('object');
    expect(document.body).toBeDefined();
  });

  it('has IntersectionObserver mock', () => {
    expect(typeof globalThis.IntersectionObserver).toBe('function');
  });

  it('has matchMedia mock', () => {
    expect(typeof globalThis.matchMedia).toBe('function');
    const mq = globalThis.matchMedia('(min-width: 768px)');
    expect(mq.matches).toBe(false);
  });
});
