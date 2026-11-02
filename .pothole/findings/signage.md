# Findings: signage

Detector: detect-signage. Coverage: 4 simulated newcomer tasks (set up env and contact form recipients; change the contact email or add a homepage section; work on fonts or the hero map; upgrade or debug against the framework version) plus a name/doc contradiction sweep of CLAUDE.md, README.md, .env.example and code comments in api/contact.ts, Navbar.astro, Layout.astro, site.ts, contact.ts, astro.config.mjs. No lying function names found; code comments match their bodies. Dead-export sweep: src has no index/barrel files, so Case 4 cannot apply; every site.ts/contact.ts export checked has call sites. Left out as noise: README.md:31 lists components out of page order (Clients is second on the page, not after Articles) and counts Footer as a section. knip/ts-prune are not run in this phase, so dead-export coverage is AI-only. No ADRs exist, so there is no drifted ADR to hand to knowledge/architecture. [coverage=full]

## PH-219 README and CLAUDE.md say the site is Astro v6, but package.json pins astro ^7.4.4

```yaml
id: PH-219
category: signage
title: README and CLAUDE.md say the site is Astro v6, but package.json pins
  astro ^7.4.4
severity: major
traffic: 1
confidence: ai-suspected
evidence:
  - CLAUDE.md:39
  - README.md:22
  - package.json:28
source:
  - detect-signage
repair_cost: S
fingerprint: signage:repo-docs:docs-name-astro-v6-but-v7-installed
```

CLAUDE.md is the file agents are told to trust and it opens its Architecture section with 'Astro v6'. An agent or newcomer looking up config, Fonts API or adapter behavior will reach for v6 docs and APIs, while the installed framework is v7. Nothing marks a v6 to v7 migration as in progress, so the docs read as current fact.

## PH-220 README says the Astro Fonts API self-hosts Inter, but the site font is Plus Jakarta Sans

```yaml
id: PH-220
category: signage
title: README says the Astro Fonts API self-hosts Inter, but the site font is
  Plus Jakarta Sans
severity: minor
traffic: 0.3241459764182721
confidence: ai-suspected
evidence:
  - README.md:26
  - astro.config.mjs:18
  - src/layouts/Layout.astro:130
source:
  - detect-signage
repair_cost: S
fingerprint: signage:repo-docs:readme-names-inter-as-site-font
```

The Fonts API config registers only Plus Jakarta Sans as --font-jakarta. Inter is used only by the OG image generator, which fetches it from jsDelivr (src/pages/og-image.png.ts:22). A reader who trusts the README will look for an Inter fonts entry that does not exist, or will add Inter weights and miss the real font.

## PH-221 README describes an interactive hero map that includes Jakarta, but the map is a static aria-hidden SVG with no Jakarta marker

```yaml
id: PH-221
category: signage
title: README describes an interactive hero map that includes Jakarta, but the
  map is a static aria-hidden SVG with no Jakarta marker
severity: minor
traffic: 0.6452886908735518
confidence: ai-suspected
evidence:
  - README.md:11
  - src/lib/heroMap.ts:36
  - src/components/Hero.astro:70
  - CLAUDE.md:137
source:
  - detect-signage
repair_cost: S
fingerprint: signage:repo-docs:readme-hero-map-interactive-with-jakarta
```

The CITIES list in heroMap.ts has six cities and no Jakarta. CLAUDE.md says Jakarta was dropped on purpose because the Latest story card covers that spot. The map ships as an <img> of a build-time SVG with no JavaScript. A reader following the README would go looking for map interactivity that does not exist, or would add Jakarta back under the overlapping card.

## PH-222 .env.example says the team address is CC'd through a hidden form field, but the API route sets cc server-side from TEAM_EMAIL

```yaml
id: PH-222
category: signage
title: .env.example says the team address is CC'd through a hidden form field,
  but the API route sets cc server-side from TEAM_EMAIL
severity: minor
traffic: 0.3001197363582303
confidence: ai-suspected
evidence:
  - .env.example:3
  - src/pages/api/contact.ts:100
  - src/lib/site.ts:10
source:
  - detect-signage
repair_cost: S
fingerprint: signage:.env.example:env-example-cc-hidden-field-claim
```

ContactForm.astro has no hidden cc input. The CC is added in the POST handler from TEAM_EMAIL in src/lib/site.ts. .env.example is the first file the setup instructions send a newcomer to. Someone told to change who gets CC'd would search the form for a field that is not there and might add one, which would create a second, competing source for the address.

## PH-223 CLAUDE.md shows a hardcoded hello@bloq.media in the clipboard handler and a home-variable link builder, but the code uses CONTACT_EMAIL and sectionHref()

```yaml
id: PH-223
category: signage
title: CLAUDE.md shows a hardcoded hello@bloq.media in the clipboard handler and
  a home-variable link builder, but the code uses CONTACT_EMAIL and
  sectionHref()
severity: minor
traffic: 0.6452886908735518
confidence: ai-suspected
evidence:
  - CLAUDE.md:133
  - CLAUDE.md:45
  - src/components/ContactForm.astro:333
  - src/components/ContactForm.astro:343
  - src/lib/site.ts:56
  - src/components/Navbar.astro:73
source:
  - detect-signage
repair_cost: S
fingerprint: signage:CLAUDE.md:claude-md-describes-pre-refactor-literals
```

CLAUDE.md quotes navigator.clipboard.writeText('hello@bloq.media') and a mailto:hello@bloq.media fallback as the implementation. It also says section links are built from a home variable. Both were replaced by the site.ts helpers, and no variable named home exists. An agent that copies the documented snippet will hardcode the email, which breaks the same file's rule to never hardcode an email or section id. An agent grepping for home will find nothing.
