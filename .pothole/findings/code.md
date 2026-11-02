# Findings: code

Detector: detect-code. Coverage: all of src/ read against hotspots; marker grep (zero TODO/FIXME/HACK/XXX in src or root config); copy-admission grep (none); twin review of ContactForm vs api/contact validation (both import EMAIL_RE/MAX_LENGTH/INTERESTS from lib/contact, no drift), site.ts BRAND vs global.css @theme (in sync), privacy vs terms (jscpd PH-011, not restated). No feature flags exist, so no dead-path candidates; no god file (coupling table only pairs components with tests/mobile.test.ts). Not restated: PH-002/003 heroMap ts-comment/any, PH-016/017/018 ContactForm and POST complexity, jscpd PH-011..015. Test-file duplication (PH-012..015 in tests/) belongs to test. Sonar and semgrep not measured; complexity is eslint-sonarjs/repowise only. Seen, not filed (other categories): CLAUDE.md lists Button variants primary/accent/outline/ghost but Button.astro defines primary/secondary/ghost/light, and says Astro v6 vs package.json ^7 (signage); privacy.astro lists collected fields without the new interest picker field (content/legal, not code). [coverage=full]

## PH-019 Homepage section ids are re-declared as string literals beside the site.ts single source, and scroll-spy skips mismatches silently

```yaml
id: PH-019
category: code
title: Homepage section ids are re-declared as string literals beside the
  site.ts single source, and scroll-spy skips mismatches silently
severity: minor
traffic: 0.5668199597532645
confidence: ai-suspected
evidence:
  - src/lib/site.ts:42
  - src/lib/site.ts:50
  - src/components/Navbar.astro:215
  - src/components/MobileCta.astro:14
  - src/components/MobileCta.astro:22
  - src/pages/404.astro:28
  - src/components/Hero.astro:45
  - src/components/Services.astro:47
  - src/components/About.astro:66
  - src/components/ContactForm.astro:17
  - commit 6e06492 Standardize shared site data, UI components, and US spelling
source:
  - detect-code
repair_cost: S
fingerprint: code:src/components:section-ids-duplicated-outside-site-ts
kind: duplication
repair: "Have each section component take its id from
  sections/CONTACT_SECTION_ID in src/lib/site.ts and build every #anchor link
  with sectionHref, so renaming an id is a one-line change."
```

Commit 6e06492 made src/lib/site.ts the declared single source for section ids (CLAUDE.md: never hardcode a section id) and routed Navbar and Footer through sectionHref, but the same commit kept literal ids on the anchors themselves (Section id="contact", "about", "services", ...) and literal #contact / /#contact / #articles / #services links in Hero, Services, About, MobileCta and the 404 page, with MobileCta even looking up getElementById('contact') directly. The two halves now drift independently: renaming an id in site.ts breaks the navbar links, and Navbar's scroll-spy does `if (!el) continue`, so the highlight just stops working with no error, while the literal links keep pointing at the old anchor.
