# Verdicts: architecture

Inspector: inspect-architecture. Coverage: every finding judged (1/1); all evidence refs opened and resolved.

## PH-519 confirmed

```yaml
id: PH-519
verdict: confirmed
reason: "All 11 refs resolve: site.ts:42/50 declare sections and
  CONTACT_SECTION_ID; About/WhyBloq/Services/Articles/Clients/ContactForm each
  hardcode their id literal; Hero.astro:45 (plus Services:47/58, MobileCta:14,
  404.astro:28, Layout.astro:45) hardcode #contact; Navbar.astro:215 silently
  skips a missing element. No trap matches: CLAUDE.md, which the survey records
  as still-intended, says never hardcode a section id, so this is Case 2 drift
  with the code at fault, not the doc. No comment or ADR exempts the targets,
  and every target is reachable on /. Major holds on the hot-file clause
  (Hero.astro/Navbar.astro at 0.58). git history shows no shipped bug from id
  drift (d2d9fc3 changed mailto links to #contact), so major rests on traffic
  alone. CLAUDE.md also claims ContactForm reads from site.ts, which is
  inaccurate (knowledge, next scan)."
fingerprint: architecture:src/components:section-ids-bypass-site-single-source
```
