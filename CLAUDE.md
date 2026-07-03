# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with Turbopack (http://localhost:3000)
npm run build      # Production build (standalone output for Docker)
npm run start      # Run production build
npm run lint       # ESLint check
```

No test suite is configured.

## Architecture

Next.js 15 App Router project using TypeScript, Tailwind CSS v3, and Anime.js v4. The `next.config.ts` sets `output: 'standalone'` for Docker deployment.

**Planned structure** (from `src/diseño/` design specs):
- `src/app/` — Next.js App Router pages and layout
- `src/components/ui/` — Reusable UI components
- `src/components/layout/` — Layout components (Header, Footer, etc.)
- `src/hooks/` — Custom React hooks
- `src/lib/` — Shared utilities and configs
- `src/types/` — Global TypeScript definitions
- `src/utils/` — Utilities; `anime-runner.ts` centralizes all Anime.js animation calls

The `src/diseño/` directory contains design mockups for the target app: a Grace Church admin panel with modules for member management, attendance, events calendar, and ministries, using a "Sanctuary" design system.

## Animation Rules (strict 60FPS)

All animations must go through `src/utils/anime-runner.ts`. Violating these rules causes layout thrashing and dropped frames:

- **Allowed**: `transform` (translate, scale, rotate) and `opacity` only
- **Forbidden**: animating `width`, `height`, `top`, `left`, `margin`, `padding`, or any layout property
- Add `transform-gpu` and `will-change-transform` (or `will-change-opacity`) Tailwind classes to elements that animate frequently
- Never use Tailwind's `transition-all`; specify only the properties being transitioned

## Code Style

Enforced by ESLint + Prettier — run `npm run lint` before committing.

- **Indentation**: tabs (width 2)
- **Quotes**: single quotes in JS/TS, single quotes in JSX
- **Semicolons**: always
- **Max line length**: 90 characters (className strings are exempt)
- **`console.log`**: forbidden (`no-console: error`)
- **Unused imports/vars**: forbidden (auto-detected)
- Prettier auto-sorts imports, Tailwind classes, and HTML attributes on format

## Key Dependencies

- `animejs@^4` — v4 API uses named exports (`import { animate } from 'animejs'`), not the v3 default export
- `next@15.1.5` with React 19
- `tailwindcss@^3` (not v4)
