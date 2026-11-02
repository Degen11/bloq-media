# Traffic Report

Generated 2026-11-02T11:16:50.000Z · 41 commits over last 24 months · complexity via scc.
Traffic = recency-weighted churn (half-life 90 days), normalized to [0,1].
55 file(s) measured, and 2 churned path(s) excluded because they no longer exist. Debt cannot be repaired in a deleted file, and counting one would pad the census that every RQI divides by.

## Hotspots (traffic × complexity)

| File | Commits | Traffic | Complexity | Hotspot | Authors |
|---|---|---|---|---|---|
| src/pages/api/contact.ts | 7 | 0.34 | 33 | 0.34 | 3 |
| src/components/Navbar.astro | 12 | 0.58 | 17 | 0.30 | 4 |
| src/pages/og-image.png.ts | 6 | 0.28 | 4 | 0.03 | 3 |
| tests/config.test.ts | 5 | 0.19 | 6 | 0.03 | 3 |
| src/layouts/Layout.astro | 8 | 0.34 | 3 | 0.03 | 4 |
| src/pages/privacy.astro | 4 | 0.24 | 4 | 0.03 | 1 |
| src/pages/terms.astro | 4 | 0.24 | 4 | 0.03 | 1 |
| src/components/Footer.astro | 9 | 0.43 | 2 | 0.03 | 4 |
| src/components/MobileCta.astro | 3 | 0.18 | 4 | 0.02 | 1 |
| src/components/Hero.astro | 13 | 0.58 | 1 | 0.02 | 4 |
| src/components/SectionHeading.astro | 3 | 0.18 | 3 | 0.02 | 1 |
| tests/mobile.test.ts | 7 | 0.39 | 1 | 0.01 | 2 |
| src/lib/heroMap.ts | 3 | 0.18 | 2 | 0.01 | 1 |
| tests/seo.test.ts | 6 | 0.29 | 1 | 0.01 | 3 |
| src/components/WhyBloq.astro | 6 | 0.26 | 1 | 0.01 | 4 |
| src/pages/404.astro | 4 | 0.24 | 1 | 0.01 | 1 |
| tests/api/contact.test.ts | 5 | 0.23 | 1 | 0.01 | 3 |
| astro.config.mjs | 4 | 0.16 | 1 | 0.00 | 3 |
| tests/hero-map.test.ts | 2 | 0.12 | 1 | 0.00 | 1 |
| tests/accessibility.test.ts | 3 | 0.10 | 1 | 0.00 | 3 |

## Change coupling (files that move together)

| A | B | Co-changes | Strength |
|---|---|---|---|
| src/components/Hero.astro | tests/mobile.test.ts | 4 | 0.57 |
| src/components/Navbar.astro | tests/mobile.test.ts | 4 | 0.57 |

## Bus-factor-1 files (≥5 commits, ≥80% one author)

- tests/mobile.test.ts
