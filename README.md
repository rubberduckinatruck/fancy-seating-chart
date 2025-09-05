# Fancy Seating Chart (Robust Setup)

A local-first seating chart tool with a fixed right panel and zone-aware randomize (front/back only). This repo includes a robust developer setup: ESLint, Prettier, Husky, lint-staged, Vitest, Playwright, and GitHub Actions CI.

## Scripts
- `pnpm dev` — Vite dev server
- `pnpm build` — TypeScript + Vite production build
- `pnpm preview` — Preview production build
- `pnpm typecheck` — TypeScript type checking
- `pnpm lint` / `pnpm lint:fix` — ESLint
- `pnpm format` / `pnpm format:check` — Prettier
- `pnpm test` — Unit tests (Vitest)
- `pnpm test:watch` — Watch mode
- `pnpm test:ui` — Vitest UI
- `pnpm test:e2e` — Playwright e2e tests
- `pnpm prepare` — Installs Husky hooks

## Getting Started
1. Install: `pnpm install` (or `yarn`/`npm i`)
2. Enable hooks: `pnpm prepare`
3. Dev: `pnpm dev` → open http://localhost:5173

## Notes
- Student constraints: **front row** or **back row** only.
- Zones are derived from the template: first row = front, last row = back (front edge = top by default).
- Freeform fixtures (door, window, teacher desk) are draggable.
- Export PNG via the right panel.
- Local-only storage (Zustand in-memory demo; extend to IndexedDB if needed).

## CI
- GitHub Actions run typecheck, lint, unit tests, build, and e2e.