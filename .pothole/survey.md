# Road Survey: bloq-media

**Date:** 2026-11-02 · **Commit:** 522ec17 · **Pothole version:** 0.2.0

## Stack

- **Languages/runtimes:** TypeScript and Astro components (`.astro`), CSS (Tailwind v4); Node 22 in CI
- **Package manager / build:** npm (`package-lock.json`); Astro 7 (`astro ^7.4.4` in package.json) in SSR mode with `@astrojs/vercel`, Vite + `@tailwindcss/vite`; deployed to Vercel
- **Test framework(s):** Vitest 4 (Node environment, `tests/**/*.test.ts`); ESLint 10 + Prettier + `astro check` in CI (`.github/workflows/ci.yml`)
- **Available adapters:** eslint-sonar (bundled), jscpd, madge; semgrep and repowise only if their install finished before the scan (run-tools.mjs records the truth in `tool-coverage.txt`)
- **Tools not available (degraded slices):** gitleaks (committed secrets), osv-scanner (known advisories), scc (complexity — traffic falls back to line count), lcov (no committed `coverage/lcov.info`; test coverage NOT MEASURED), SonarQube (no server)

## Map (modules and responsibilities)

| Module | Responsibility | Traffic (peak file) | Notes |
|---|---|---|---|
| `src/components/` | Homepage section components and shared UI building blocks (Section, SectionHeading, Button, Icon), plus the client-side contact form, navbar scroll-spy/mobile menu and sticky mobile CTA scripts | 0.58 (`ContactForm.astro`, `Navbar.astro`, `Hero.astro`) | Top hotspots. `Hero.astro` and `Navbar.astro` each co-change with `tests/mobile.test.ts` (strength 0.57) |
| `src/layouts/` | The shared page shell: head metadata, canonical/OG/JSON-LD, font preload, entrance-animation observer | 0.34 (`Layout.astro`) | Derives every absolute URL from `Astro.site` |
| `src/pages/` | Routes: prerendered home, legal and 404 pages, prerendered OG image and hero-map SVG endpoints, and the only server route `POST /api/contact` | 0.34 (`api/contact.ts`) | `og-image.png.ts` must stay prerendered (satori wasm not traced on Vercel) |
| `src/lib/` | Single source of shared data: site constants/emails/socials/sections, contact validation constants, icons, articles, hero-map projection | 0.30 (`site.ts`) | Declared as the only place emails, socials and section ids may live |
| `src/styles/` | Tailwind v4 theme tokens and global utilities (card, animations, legal typography, scrollbars) | 0.45 (`global.css`) | Third hotspot |
| `src/assets/`, `public/` | Optimized display images; favicons and webmanifest | low | Binary assets |
| `tests/` | Vitest suites: API handler, SEO, build output, a11y, performance, legal pages, hero map, config, mobile | 0.39 (`mobile.test.ts`) | `mobile.test.ts` is bus-factor-1 and change-coupled to Hero and Navbar |
| repo root config | Astro/Vite config, ESLint, Prettier, TS, Vercel headers/CSP, CI, Dependabot | 1.00 (`package.json`) | `package.json` churn is mostly Dependabot; CLAUDE.md is a top-5 hotspot (0.76 traffic) |

## Intended architecture

- **Declared decisions (ADRs/docs):** No ADR directory. Declared in `CLAUDE.md` and `README.md`: "single-page Astro site in SSR mode (`output: 'server'`) deployed to Vercel" with every page and both image endpoints `prerender = true` and only `/api/contact` server-rendered (CLAUDE.md, Architecture); "never hardcode the host" — absolute URLs derive from `Astro.site` (CLAUDE.md, SEO); `src/lib/site.ts` is "the single source" for names, emails, socials, sections and brand colors — "never hardcode an email, social URL or section id" (CLAUDE.md); display images go through `astro:assets` `<Image>` — "don't add new `<img src="/...">` tags pointing at `public/`" (CLAUDE.md, Images); path aliases `@components/*` etc. "everywhere instead of relative paths" (CLAUDE.md); fonts are self-hosted, no third-party font requests, CSP `font-src 'self'` (CLAUDE.md, Fonts); "Pothole never runs" note n/a. Site copy uses US spelling (CLAUDE.md).
- **Layering rules:** `src/pages` and `src/components` may import from `src/lib`, `src/layouts`, `src/components`, `src/assets`, `src/styles`; `src/lib` must not import components or pages (implied by "single source" role; not stated as a rule). Shared values flow only from `src/lib/site.ts` and `src/lib/contact.ts`.
- **Known migrations in flight:** none declared. (Documentation still names Astro v6 while package.json pins Astro ^7 — whether the v6→v7 upgrade is complete is an open question.)

## Exclusions

- `package-lock.json` — generated lockfile
- `src/assets/**`, `public/**` image/icon binaries, `docs/screenshot-hero.png` — binary assets, not code
- `dist/`, `.astro/`, `.vercel/`, `node_modules/` — build output and dependencies (already gitignored)
- `.pothole/` — Pothole's own output
- `.repowise/` — repowise index cache if created; propose adding to `.gitignore`

## Open questions for the gate

1. Is the Astro v6→v7 upgrade complete? Docs (CLAUDE.md, README) say v6; package.json says ^7.4.4. (Gate run unattended at the user's request: detectors should treat the code and package.json as truth and the docs as possibly stale.)
2. No ADRs exist — is CLAUDE.md the authoritative statement of intended architecture? (Assumed yes for this run.)
3. README says the hero map covers Jakarta and the fonts are "Inter"; CLAUDE.md says no Jakarta marker and Plus Jakarta Sans. Which is current? (Assumed CLAUDE.md/code are current.)
4. Is the in-memory per-IP rate limit in `/api/contact` an accepted limitation on Vercel's multi-instance serverless runtime? (Unknown; left to the security detector.)
