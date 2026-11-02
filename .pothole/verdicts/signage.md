# Verdicts: signage

Inspector: inspect-signage. Coverage: every finding judged; all evidence refs opened at the working tree (package.json also checked at 2613e84).

## PH-219 refuted

```yaml
id: PH-219
verdict: refuted
reason: "evidence: package.json:28 is the topojson-client dependency, not astro
  (astro ^7.4.4 is at package.json:25, also at HEAD 2613e84); a ref that points
  at an unrelated line refutes the finding. The underlying v6-vs-v7 drift
  (CLAUDE.md:39, README.md:22) looks real and should be re-filed next scan with
  correct evidence."
fingerprint: signage:repo-docs:docs-name-astro-v6-but-v7-installed
```

## PH-220 confirmed

```yaml
id: PH-220
verdict: confirmed
reason: "Checked: README.md:26 says the Fonts API self-hosts Inter;
  astro.config.mjs:18 registers only Plus Jakarta Sans and Layout.astro:130
  renders --font-jakarta. No trap applies (not a marked future path, no ADR);
  nothing documents Inter as the site font."
fingerprint: signage:repo-docs:readme-names-inter-as-site-font
```

## PH-221 confirmed

```yaml
id: PH-221
verdict: confirmed
reason: "Checked: README.md:11 claims an interactive map incl. Jakarta;
  heroMap.ts:36 CITIES has six cities without Jakarta, Hero.astro:70 marks the
  map card aria-hidden and it ships as a static img with no script;
  CLAUDE.md:137 records Jakarta was dropped on purpose, which documents the
  code, not the README. No trap applies."
fingerprint: signage:repo-docs:readme-hero-map-interactive-with-jakarta
```

## PH-222 confirmed

```yaml
id: PH-222
verdict: confirmed
reason: "Checked: .env.example:3 says the team address is CC'd via a hidden form
  field; ContactForm.astro has no cc input (only the honeypot), and
  api/contact.ts:100 sets cc from TEAM_EMAIL (site.ts:10-11) server-side.
  Demonstrable contradiction; no trap applies."
fingerprint: signage:.env.example:env-example-cc-hidden-field-claim
```

## PH-223 confirmed

```yaml
id: PH-223
verdict: confirmed
reason: "Checked: CLAUDE.md:133 quotes writeText('hello@bloq.media') and a
  hardcoded mailto fallback, but ContactForm.astro:333/343 use CONTACT_EMAIL;
  CLAUDE.md:45 describes a home variable, but Navbar.astro:73 and
  Footer.astro:15 call sectionHref() (site.ts:56) and no home identifier exists.
  The only hello@bloq.media literal in src is site.ts:9. No trap applies."
fingerprint: signage:CLAUDE.md:claude-md-describes-pre-refactor-literals
```
