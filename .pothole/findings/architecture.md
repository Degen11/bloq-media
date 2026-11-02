# Findings: architecture

Detector: detect-architecture. Coverage: madge ran (JS/TS) and reported 0 cycles; hand-traced imports across src/pages, src/layouts, src/components and src/lib agree: no cycles, src/lib imports no components or pages (site.ts takes only a type from icons.ts), so the dependency direction is intact. Drift checked against the CLAUDE.md declarations the survey records: prerender on every page and both image endpoints (honoured), host derived from Astro.site (honoured), single-source emails/socials (honoured), section ids from site.ts (violated, 1 finding), Image vs public img (only the declared lazy /hero-map.svg img), aliases everywhere (src honours it; tests/hero-map.test.ts:7 and tests/api/contact.test.ts:8 use relative imports, a convention nit left to code). No god module (site.ts is a leaf library, fan-out 0 features) and no zombie twins found; zombie and god-module coverage is AI-only. Seen but not mine: CLAUDE.md lists Button variants primary/accent/outline/ghost while Button.astro defines primary/secondary/ghost/light, and CLAUDE.md/README still say Astro v6 vs package.json ^7 (knowledge/signage); BLOQ Media literal repeated in Footer.astro:64 and Navbar.astro:60 instead of SITE_NAME (code). [coverage=full]

## PH-519 Section anchor ids are hardcoded in every section component instead of read from the declared single source in site.ts

```yaml
id: PH-519
category: architecture
title: Section anchor ids are hardcoded in every section component instead of
  read from the declared single source in site.ts
severity: major
traffic: 0.5668199597532645
confidence: ai-suspected
evidence:
  - src/lib/site.ts:42
  - src/lib/site.ts:50
  - src/components/About.astro:47
  - src/components/WhyBloq.astro:37
  - src/components/Services.astro:36
  - src/components/Articles.astro:10
  - src/components/Clients.astro:24
  - src/components/ContactForm.astro:17
  - src/components/Hero.astro:45
  - src/components/MobileCta.astro:22
  - src/components/Navbar.astro:215
source:
  - detect-architecture
repair_cost: L
fingerprint: architecture:src/components:section-ids-bypass-site-single-source
```

CLAUDE.md, which the survey treats as the declared architecture, makes src/lib/site.ts the single source for section ids and says never to hardcode one. Only the link side honours it: Navbar and Footer build hrefs and the scroll-spy list from sections and CONTACT_SECTION_ID. The targets do not. Each section component hardcodes its own id literal, and Hero, Services, MobileCta, 404 and the Layout JSON-LD hardcode #contact. Renaming or reordering a section in site.ts therefore breaks nav links without any error, and the scroll-spy skips the missing element at Navbar.astro:215 (if (!el) continue), so nothing fails. Anyone editing a section has to touch site.ts plus the component plus each hardcoded href. Repair cost is L under the mandatory clause: Hero.astro and Navbar.astro are top hotspots (0.58 traffic), and no test checks that each site.ts id has a matching element. tests/mobile.test.ts:150 actually pins the literal href="#contact".
