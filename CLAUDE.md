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

## Git commit identity

Commits in this repo are authored as **degen11** `<hill.degen@gmail.com>`. This repo uses a gmail address rather than any other email that may be configured as a default elsewhere — set it locally (per clone/session, not globally) before committing:

```bash
git config user.name "degen11"
git config user.email "hill.degen@gmail.com"
```

## Architecture

This is a single-page **Astro v6** site running in **SSR mode** (`output: 'server'`) deployed to Vercel. The main page (`src/pages/index.astro`) is composed from section components; `src/pages/privacy.astro`, `src/pages/terms.astro`, and `src/pages/404.astro` are standalone pages sharing `Layout`, `Navbar`, and `Footer`. Every page and the two image endpoints (`og-image.png.ts`, `hero-map.svg.ts`) set `export const prerender = true` so they are built statically and served from the CDN — this is also required for `@astrojs/sitemap` to include pages (the integration only emits prerendered routes in server mode). Only `/api/contact` stays server-rendered.

### SEO / metadata

`site` in `astro.config.mjs` is `https://www.bloq.media`, matching the primary Vercel domain (the apex 308-redirects to `www`). `Layout.astro` derives every absolute URL (canonical, `og:url`, OG image, JSON-LD `url`/`@id`) from `Astro.site`, so never hardcode the host. Pass `title` and `description` (≤ 160 chars) props per page; pass `noindex` to emit `noindex, follow` and skip canonical/`og:url` (used by the 404 page). The Organization JSON-LD has an `@id` that the WebSite `publisher` references. The sitemap filter excludes `.png`/`.svg` endpoints and `/404/`.

Section links in `Navbar.astro` and `Footer.astro` are built as `${home}#section`, where `home` is `''` on `/` and `'/'` elsewhere, so they work from the legal and 404 pages.

### Fonts

Inter is self-hosted through Astro's Fonts API (`fonts` in `astro.config.mjs`, `fontsource` provider, weights 400/500/600/700, latin subset) and rendered with `<Font cssVariable="--font-inter" preload=...>` in `Layout.astro`, preloading 400 and 700. `--font-sans` in `global.css` is `var(--font-inter)`, which includes Astro's generated metric-matched fallback so the font swap doesn't shift layout. No third-party font requests are made, and the CSP `font-src` is `'self'`.

### Images & favicons

Display images (BLOQ logo, client logos) live in `src/assets/` and are rendered through the `astro:assets` `<Image>` component so they're resized/optimized at build time — don't add new `<img src="/...">` tags pointing at `public/`. `Layout.astro` derives the JSON-LD organization logo URL from the imported asset. The favicon set in `public/` (`favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`) was generated from `src/assets/logo-icon.png` with sharp (32 px transparent; the larger sizes padded on a `bloq-navy` background).

### Path aliases

`tsconfig.json` maps `@components/*` → `src/components/*` and `@layouts/*` → `src/layouts/*`. Use these everywhere instead of relative paths.

### Styling

Tailwind CSS v4 is loaded via `@tailwindcss/vite` (no `tailwind.config.*` file). Custom brand tokens are defined in `src/styles/global.css` under `@theme`:

| Token | Hex |
|---|---|
| `bloq-blue` | `#29ABE2` |
| `bloq-navy` | `#1A3C8F` |
| `bloq-dark` | `#0F2260` |

`global.css` also contains the `.honeypot` utility class used by the contact form and the `.legal-content` typography (h2, p, ul, a) used by the `/privacy` and `/terms` pages.

It also houses the UI enhancement utilities added for polish:

| Class / selector | Purpose |
|---|---|
| `html.js-ready [data-animate]` | Initial hidden state for scroll-triggered elements (`opacity: 0; transform: translateY(16px)`) |
| `html.js-ready [data-animate].is-visible` | Visible state applied by `IntersectionObserver` in `Layout.astro` |
| `#site-header` | Smooth `box-shadow` transition for scroll-aware navbar |
| `#site-header.header-scrolled` | Shadow applied after 10 px of scroll; toggled by `Navbar.astro` script |
| `.field-shake` | `@keyframes field-shake` animation applied to invalid form fields on submit |
| `.nav-active` | Applied by scroll-spy in `Navbar.astro` to highlight the link for the currently visible section. Sets the navy colour, `font-weight: 600`, and a 2 px `bloq-blue` underline (`text-underline-offset: 6px`) so the active section reads clearly beyond colour alone. Unlayered so it beats Tailwind utility colours without `!important` |
| `.copy-icon-stack` / `.copy-icon-layer` | Stack the clipboard and check SVGs inside `#copy-email-btn` so they crossfade. The check icon (`#check-icon`) starts `opacity: 0; scale(0.5)`; adding `.is-copied` to the button fades/scales it in and the clipboard out over 200 ms. Disabled under `prefers-reduced-motion: reduce` |
| `scrollbar-color` / `::-webkit-scrollbar*` | Themed scrollbars (bloq-navy thumb on a light-gray track) instead of the default OS gray, applied globally to `html` so it covers the page and any scrollable containers. A `prefers-color-scheme: dark` block swaps in a bloq-blue thumb on a bloq-dark track to match dark browser/OS chrome |

### Scroll-triggered entrance animations

`Layout.astro` contains an `IntersectionObserver` (`<script>` before `</body>`) that adds `is-visible` to every `[data-animate]` element as it enters the viewport. A `js-ready` class on `<html>` (set by an `is:inline` script in `<head>`) gates the hidden state so content is always visible when JS is disabled. Stagger delays are set via inline `style="transition-delay: Nms"` on individual items inside loops; the observer clears each delay after 1 s so hover transitions on cards are not affected.

### Navbar behaviour

- **Scroll-aware shadow:** The `#site-header` starts borderless-shadow; the `header-scrolled` class adds a soft `box-shadow` after 10 px of scroll. Toggled by a passive `scroll` listener in `Navbar.astro`.
- **Mobile menu animation:** The mobile menu uses a `max-height` + `opacity` CSS transition (set inline on the element) instead of `display:none` toggling, giving a smooth slide open/close on tap. Both properties share the same `0.3s` duration so the slide and fade finish together.
- **Scroll-spy:** The same passive `scroll` listener also runs `updateScrollSpy()`, which walks `['about', 'why', 'services', 'articles', 'clients', 'contact']` from top to bottom and applies `.nav-active` to whichever `[data-section]` link matches the last section whose top edge has crossed the navbar bottom (plus a 32 px buffer). The "Contact Us" CTA button intentionally has no `data-section` attribute so it is excluded. `updateScrollSpy()` also fires once on page load to handle deep-links.

### Server routes

| Route | Purpose |
|---|---|
| `POST /api/contact` | Checks honeypot, validates form data (object body, string fields, email format, max lengths 100/254/100/5000 for name/email/company/message, mirrored by `maxlength` in `ContactForm.astro`), then applies the per-IP rate limit (1 req/min via in-memory `Map`, only for valid submissions and released if Web3Forms fails) and proxies to Web3Forms |
| `GET /og-image.png` | **Prerendered.** Generates the 1200×630 OG image at build time using **satori** + **@resvg/resvg-js**; fonts are fetched from jsDelivr and checked against pinned SHA-256 hashes (`FONT_SHA256`), so update those if the font URL changes. It must stay prerendered: as a runtime route it crashed on Vercel because satori's `harfbuzzjs/hb.wasm` isn't traced into the function bundle. Stick to glyphs in the Inter latin subset (no arrows) |
| `GET /hero-map.svg` | **Prerendered.** The hero map SVG, built from `src/lib/heroMap.ts` |

### Contact form flow

`ContactForm.astro` handles client-side validation and submission entirely in its own `<script>` block. It posts JSON to `/api/contact`, shows a spinner during submission, and swaps the form out for a success state on `{ success: true }`. It also fires a Vercel Analytics `track('contact_form_submitted')` event on success. The honeypot field (`name="website"`) is CSS-hidden (`.honeypot` class) rather than `display:none` so bots still fill it; the API silently returns 200 when it's non-empty.

The left column also shows `hello@bloq.media` as a `mailto:` link alongside a **click-to-copy** button (`#copy-email-btn`). Clicking it calls `navigator.clipboard.writeText('hello@bloq.media')`, then toggles `.is-copied` on the button to crossfade the clipboard icon into a green checkmark (via `.copy-icon-stack`/`.copy-icon-layer`) for 2 s before reverting. If the Clipboard API is unavailable the handler falls back to `window.location.href = 'mailto:hello@bloq.media'`.

### Hero map

The hero's D3 Mercator map of Southeast Asia is drawn entirely at build time; no map JavaScript ships to the browser. `src/lib/heroMap.ts` projects the 50m world-atlas countries (paths rounded to 1 decimal) and the city markers (Singapore, Bangkok, Jakarta, Manila, Ho Chi Minh, Kuala Lumpur, Yangon) into a fixed 600×520 box. `src/pages/hero-map.svg.ts` turns that into a static SVG (country outlines, glow filter, marker dots). `Hero.astro` shows it as `<img src="/hero-map.svg" loading="lazy">` inside an `aspect-ratio: 600 / 520` container in the `hidden lg:flex` column. The lazy loading matters: browsers never fetch lazy images inside a `display:none` container, so phones and tablets skip the file. Each city gets an absolutely-positioned 28 px hover target placed with percentage `left`/`top` values from `heroMap.ts`, with a glass-style label revealed by CSS `group-hover`. The whole column is `aria-hidden="true"`.

### Tests

Vitest runs in Node environment against `tests/**/*.test.ts`. The API test (`tests/api/contact.test.ts`) imports the `POST` handler directly and stubs `globalThis.fetch`—no server needed. Other test files cover SEO meta, build output, accessibility, performance, the legal pages, the hero map, and Astro config.
