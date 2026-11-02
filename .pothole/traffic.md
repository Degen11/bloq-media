# Traffic Report

Generated 2026-11-02T11:25:55.000Z · 71 commits over last 24 months · complexity via scc.
Traffic = recency-weighted churn (half-life 90 days), normalized to [0,1].
55 file(s) measured, and 3 churned path(s) excluded because they no longer exist. Debt cannot be repaired in a deleted file, and counting one would pad the census that every RQI divides by.

## Hotspots (traffic × complexity)

| File | Commits | Traffic | Complexity | Hotspot | Authors |
|---|---|---|---|---|---|
| src/pages/api/contact.ts | 9 | 0.30 | 33 | 0.30 | 2 |
| src/components/Navbar.astro | 19 | 0.57 | 17 | 0.29 | 3 |
| src/layouts/Layout.astro | 12 | 0.32 | 3 | 0.03 | 3 |
| src/pages/og-image.png.ts | 6 | 0.22 | 4 | 0.03 | 2 |
| src/components/Footer.astro | 13 | 0.40 | 2 | 0.02 | 3 |
| src/pages/privacy.astro | 4 | 0.20 | 4 | 0.02 | 1 |
| src/pages/terms.astro | 4 | 0.20 | 4 | 0.02 | 1 |
| tests/config.test.ts | 4 | 0.13 | 6 | 0.02 | 2 |
| src/components/MobileCta.astro | 3 | 0.15 | 4 | 0.02 | 1 |
| src/components/Hero.astro | 18 | 0.54 | 1 | 0.02 | 3 |
| src/components/SectionHeading.astro | 3 | 0.15 | 3 | 0.01 | 1 |
| tests/mobile.test.ts | 7 | 0.32 | 1 | 0.01 | 2 |
| src/lib/heroMap.ts | 3 | 0.15 | 2 | 0.01 | 1 |
| src/components/WhyBloq.astro | 7 | 0.21 | 1 | 0.01 | 3 |
| tests/seo.test.ts | 5 | 0.21 | 1 | 0.01 | 2 |
| src/pages/404.astro | 4 | 0.20 | 1 | 0.01 | 1 |
| astro.config.mjs | 9 | 0.20 | 1 | 0.01 | 3 |
| tests/api/contact.test.ts | 4 | 0.16 | 1 | 0.00 | 2 |
| tests/hero-map.test.ts | 2 | 0.10 | 1 | 0.00 | 1 |
| tests/accessibility.test.ts | 2 | 0.06 | 1 | 0.00 | 2 |

## Change coupling (files that move together)

| A | B | Co-changes | Strength |
|---|---|---|---|
| src/components/Hero.astro | src/components/Navbar.astro | 9 | 0.50 |
| src/components/ContactForm.astro | src/styles/global.css | 7 | 0.50 |
| astro.config.mjs | package.json | 6 | 0.67 |
| src/components/Clients.astro | src/components/Navbar.astro | 6 | 0.55 |
| src/components/Navbar.astro | src/layouts/Layout.astro | 6 | 0.50 |
| src/layouts/Layout.astro | src/styles/global.css | 6 | 0.50 |
| src/components/About.astro | src/components/Hero.astro | 5 | 0.63 |
| src/components/About.astro | src/components/Services.astro | 5 | 0.63 |
| src/components/ContactForm.astro | src/pages/api/contact.ts | 5 | 0.56 |
| astro.config.mjs | src/layouts/Layout.astro | 5 | 0.56 |
| src/components/ContactForm.astro | src/components/Services.astro | 5 | 0.50 |
| src/components/Hero.astro | src/components/Services.astro | 5 | 0.50 |
| src/components/Navbar.astro | src/components/Services.astro | 5 | 0.50 |
| src/components/Clients.astro | src/pages/index.astro | 4 | 0.67 |
| src/components/Hero.astro | src/pages/index.astro | 4 | 0.67 |
| src/components/Navbar.astro | src/pages/index.astro | 4 | 0.67 |
| src/components/Hero.astro | tests/mobile.test.ts | 4 | 0.57 |
| src/components/Navbar.astro | tests/mobile.test.ts | 4 | 0.57 |
| src/components/About.astro | src/components/WhyBloq.astro | 4 | 0.57 |
| src/components/Hero.astro | src/components/WhyBloq.astro | 4 | 0.57 |

## Bus-factor-1 files (≥5 commits, ≥80% one author)

- tests/mobile.test.ts
- tests/seo.test.ts
