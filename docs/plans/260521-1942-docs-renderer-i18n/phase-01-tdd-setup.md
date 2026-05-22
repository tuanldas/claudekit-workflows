---
phase: 1
title: "TDD setup + pre-commit hook"
status: pending
priority: P2
effort: "3-4h"
dependencies: []
---

# Phase 1: TDD setup

## Overview

Setup Vitest 2.0 + Testing Library + happy-dom làm foundation cho TDD-structured phases sau. Phải xong trước Phase 2+ để mỗi feature có thể write tests-first.

## Requirements

**Functional:**
- `npm test` chạy Vitest watch mode
- `npm run test:run` chạy 1 lần (CI)
- `npm run test:coverage` chạy với coverage report
- Test files co-located với source (`*.test.ts(x)` next to component/util)
- Sample smoke test pass

**Non-functional:**
- Test startup <3s
- happy-dom mock DOM (không jsdom)
- Vitest config support `.tsx` + path alias `@/`
- React 19 compat

## Architecture

```
project root
├── vitest.config.ts          # Test runner config
├── vitest.setup.ts            # Global setup (RTL matchers, mocks)
├── package.json               # Add: vitest, RTL, happy-dom deps + scripts
└── src/
    └── lib/
        ├── example.ts
        └── example.test.ts    # Co-located test
```

## Related Code Files

**Create:**
- `vitest.config.ts`
- `vitest.setup.ts`
- `src/lib/smoke.test.ts` (sanity test)

**Modify:**
- `package.json` (deps + scripts)
- `tsconfig.json` (add vitest types)
- `.gitignore` (ignore coverage/)

**Delete:** None.

## Implementation Steps

### Step 1: Tests-First — Define expected behavior

Write smoke test trước khi install (it sẽ fail, then install + pass):

```ts
// src/lib/smoke.test.ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2);
  });

  it('supports happy-dom', () => {
    expect(typeof document).toBe('object');
    expect(document.body).toBeDefined();
  });
});
```

### Step 2: Install dependencies

```bash
npm install -D vitest @vitest/coverage-v8 \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  happy-dom \
  msw \
  @vitejs/plugin-react \
  @types/node
```

Note (LOW 1): `@vitejs/plugin-react` consumed by Vitest only; Next.js dùng Turbopack/SWC riêng.

### Step 3: Configure `vitest.config.ts`

```ts
// Vitest needs this for React JSX transforms in tests; Next.js handles JSX via SWC/Turbopack independently.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', '.next/', 'docs/', 'scripts/', '*.config.*', '**/*.test.*'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
        perFile: false,
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
```

**Note (MEDIUM 3 fix)**: `thresholds` ENFORCED, CI fail nếu coverage drop. Per-file=false vì utils thường cao, UI tests thấp hơn — aggregate metric đủ tốt.

### Step 4: Configure `vitest.setup.ts`

```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => cleanup());

// HIGH 3 fix: Mock IntersectionObserver — happy-dom partial support.
// Tests can override via vi.mocked(IntersectionObserver) for specific scenarios.
class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = '';
  thresholds = [];
}
globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

// Mock matchMedia (some components may use it)
globalThis.matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));
```

### Step 5: Update `package.json` scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Step 6: Update `tsconfig.json` types

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

### Step 7: Run tests, verify all pass

```bash
npm run test:run
```

Expected: 2 tests pass.

### Step 8: Setup lefthook pre-commit hook (validate decision)

Install:
```bash
npm install -D lefthook
npx lefthook install
```

Create `lefthook.yml`:
```yaml
pre-commit:
  commands:
    test:
      glob: "src/**/*.{ts,tsx}"
      run: npm run test:run
    lint:
      glob: "src/**/*.{ts,tsx,js,jsx}"
      run: npx eslint {staged_files}
    typecheck:
      glob: "src/**/*.{ts,tsx}"
      run: npx tsc --noEmit
pre-push:
  commands:
    coverage:
      run: npm run test:coverage
```

**Note**: Coverage threshold gate enforce pre-push (slow check). Pre-commit chỉ unit tests + lint + typecheck (fast).

Verify:
```bash
git add . && git commit -m "test commit"   # Should run hooks
```

## Success Criteria

- [ ] `npm test` start watch mode
- [ ] `npm run test:run` exits 0 với 2 tests pass
- [ ] `npm run test:coverage` generate `coverage/index.html`
- [ ] Coverage threshold gate active (intentionally fail by under-testing → verify red)
- [ ] Path alias `@/lib/smoke` resolve trong test
- [ ] `IntersectionObserver` globally mocked (verify `expect(globalThis.IntersectionObserver).toBeDefined()`)
- [ ] No console warnings về React 19 compat
- [ ] `.gitignore` includes `coverage/` và `/public/search-index-*.json`
- [ ] `lefthook.yml` config + `npx lefthook install` chạy OK
- [ ] Test commit triggers hooks (lint + test + typecheck)

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `@testing-library/react` chưa support React 19 stable | Low | RTL 16+ đã support React 19; verify version trước install |
| `@vitejs/plugin-react` conflict với Next.js | Low | Plugin chỉ dùng cho Vitest, không Next; isolated |
| happy-dom thiếu API so với jsdom | Medium | Sample test verify document/body work; fallback jsdom nếu cần |

## TDD discipline note

Mọi phase tiếp theo PHẢI write tests trước implementation. Pattern: viết test mô tả expected behavior → run test (red) → implement → run test (green) → refactor.

## Next phase

Phase 2: Locale restructure (move app → /[locale]/ + redirect root).
