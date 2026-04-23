# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # start dev server (localhost:4321)
npm run build        # production build
npm run preview      # preview production build locally
npm run check        # TypeScript / Astro type-check

# Testing
npm test             # run all tests once
npm run test:watch   # watch mode

# Run a single test file
npx vitest run tests/api/contact.test.ts
```

## Environment

Copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_KEY` (free key from web3forms.com). Without it the contact form API will still serve but will always return 500.

## Architecture

This is a single-page **Astro v6** site running in **SSR mode** (`output: 'server'`) deployed to Vercel. There is one real page (`src/pages/index.astro`) composed from section components.

### Path aliases

`tsconfig.json` maps `@components/*` → `src/components/*` and `@layouts/*` → `src/layouts/*`. Use these everywhere instead of relative paths.

### Styling

Tailwind CSS v4 is loaded via `@tailwindcss/vite` (no `tailwind.config.*` file). Custom brand tokens are defined in `src/styles/global.css` under `@theme`:

| Token | Hex |
|---|---|
| `bloq-blue` | `#29ABE2` |
| `bloq-navy` | `#1A3C8F` |
| `bloq-dark` | `#0F2260` |

`global.css` also contains the `.honeypot`, `.modal-dialog`, `.modal-inner`, `.modal-header`, `.modal-close`, and `.modal-body` utility classes used by the contact form and any service-detail modals.

### Server routes

| Route | Purpose |
|---|---|
| `POST /api/contact` | Validates form data, checks honeypot + per-IP rate limit (1 req/min via in-memory `Map`), then proxies to Web3Forms |
| `GET /og-image.png` | Generates the 1200×630 OG image at request time using **satori** + **@resvg/resvg-js**; fonts are fetched from jsDelivr and cached in module scope for warm instances |

### Contact form flow

`ContactForm.astro` handles client-side validation and submission entirely in its own `<script>` block. It posts JSON to `/api/contact`, shows a spinner during submission, and swaps the form out for a success state on `{ success: true }`. It also fires a Vercel Analytics `track('contact_form_submitted')` event on success. The honeypot field (`name="website"`) is CSS-hidden (`.honeypot` class) rather than `display:none` so bots still fill it; the API silently returns 200 when it's non-empty.

### Tests

Vitest runs in Node environment against `tests/**/*.test.ts`. The API test (`tests/api/contact.test.ts`) imports the `POST` handler directly and stubs `globalThis.fetch`—no server needed. Other test files cover SEO meta, build output, accessibility, performance, modals, and Astro config.
