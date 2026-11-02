# Pothole Register: bloq-media

Verified: 21 confirmed, 1 refuted, 0 not verified — 22 finding(s) across 10 category file(s).
Detector coverage: Detector: detect-api. Coverage: full enumeration of the file-based route surface in src/pages. Only one JSON contract exists, POST /api/contact (src/pages/api/contact.ts). Every path returns the same shape: success is {success:true}, and every failure (400 invalid or missing, 429 rate limit, 500 upstream) goes through one fail() helper as {success:false,message}. GET /og-image.png and GET /hero-map.svg are prerendered static image files with no JSON contract to compare. The only consumer is src/components/ContactForm.astro:299-316, a single in-repo caller from the same team. It reads data.success and data.message the same way on every status and has no per-status or per-endpoint branch. With only one JSON endpoint there are no two endpoints to compare, so no inconsistency is possible. No tool covers api debt in this phase (no OpenAPI or spectral linting is wired), so this slice is entirely AI-only. Seen but not mine, left for security: the in-memory per-IP rate limit keyed on the first x-forwarded-for value (contact.ts:6-20, 40) does not survive across Vercel instances. [coverage=full]
Detector coverage: Detector: detect-architecture. Coverage: madge ran (JS/TS) and reported 0 cycles; hand-traced imports across src/pages, src/layouts, src/components and src/lib agree: no cycles, src/lib imports no components or pages (site.ts takes only a type from icons.ts), so the dependency direction is intact. Drift checked against the CLAUDE.md declarations the survey records: prerender on every page and both image endpoints (honoured), host derived from Astro.site (honoured), single-source emails/socials (honoured), section ids from site.ts (violated, 1 finding), Image vs public img (only the declared lazy /hero-map.svg img), aliases everywhere (src honours it; tests/hero-map.test.ts:7 and tests/api/contact.test.ts:8 use relative imports, a convention nit left to code). No god module (site.ts is a leaf library, fan-out 0 features) and no zombie twins found; zombie and god-module coverage is AI-only. Seen but not mine: CLAUDE.md lists Button variants primary/accent/outline/ghost while Button.astro defines primary/secondary/ghost/light, and CLAUDE.md/README still say Astro v6 vs package.json ^7 (knowledge/signage); BLOQ Media literal repeated in Footer.astro:64 and Navbar.astro:60 instead of SITE_NAME (code). [coverage=full]
Detector coverage: Detector: detect-build. Coverage: .github/workflows/ci.yml, .github/dependabot.yml, package.json scripts, astro.config.mjs, vercel.json, .gitignore, .env.example and the README setup section read end to end; every env read in src/ (one: import.meta.env.PUBLIC_WEB3FORMS_KEY in src/pages/api/contact.ts) cross-checked against .env.example, which lists it, so no env drift. No scripts/, Makefile, Dockerfile or release doc exists; deploys are Vercel git integration, so release steps are not documented in-repo (not scored as a finding: nothing in the repo claims a manual step). Commit subjects grepped for retry/re-run/flaky/again: no retry loops or retry history in CI. Build-time network fetches noted: og-image.png.ts pulls Inter from jsDelivr pinned by version and SHA-256 (a declared contract, not debt). No tool in this phase reads build inputs, so build coverage is AI-only. For knowledge: .env.example comments name recipient addresses that differ from the CC/TO addresses CLAUDE.md attributes to src/lib/site.ts; worth a knowledge/signage check. No runtime CI flake could be assessed (CI logs out of scope). [coverage=full]
Detector coverage: Detector: detect-code. Coverage: all of src/ read against hotspots; marker grep (zero TODO/FIXME/HACK/XXX in src or root config); copy-admission grep (none); twin review of ContactForm vs api/contact validation (both import EMAIL_RE/MAX_LENGTH/INTERESTS from lib/contact, no drift), site.ts BRAND vs global.css @theme (in sync), privacy vs terms (jscpd PH-011, not restated). No feature flags exist, so no dead-path candidates; no god file (coupling table only pairs components with tests/mobile.test.ts). Not restated: PH-002/003 heroMap ts-comment/any, PH-016/017/018 ContactForm and POST complexity, jscpd PH-011..015. Test-file duplication (PH-012..015 in tests/) belongs to test. Sonar and semgrep not measured; complexity is eslint-sonarjs/repowise only. Seen, not filed (other categories): CLAUDE.md lists Button variants primary/accent/outline/ghost but Button.astro defines primary/secondary/ghost/light, and says Astro v6 vs package.json ^7 (signage); privacy.astro lists collected fields without the new interest picker field (content/legal, not code). [coverage=full]
Detector coverage: Detector: detect-dependency. Coverage: package.json, package-lock.json, .prettierrc.json, eslint/vitest/astro configs read; every runtime and dev dependency traced to an import or config use (all are used). osv-scanner ran with 0 findings, so there is no advisory reachability to judge. The path-to-regexp 6.3.0 override is not filed: commit a64615c records why (GHSA-9wv6-86v2-598j via @vercel/routing-utils, which still pins 6.1.0 at its latest release), so it is a recorded decision, though the reason lives only in git history. Unused-dependency and abandonment coverage is AI-only (knip, npm-check-updates and libyear are not run in this phase). Partial: the npm registry was reachable (topojson-client and world-atlas last published in 2022, which is quiet, not abandoned), but GitHub repo pages and API returned 403, so archived status could not be checked. No credentials seen in the manifests. [coverage=partial]
Detector coverage: Detector: detect-knowledge. Coverage: no ADR directory exists; CLAUDE.md, README.md and .env.example (the declared-decision record per survey) checked claim-by-claim against code; the single env read (import.meta.env.PUBLIC_WEB3FORMS_KEY, contact.ts:91) is documented with its meaning in README, CLAUDE.md and .env.example, so no undocumented required value. Bus-factor-1 list (tests/mobile.test.ts) not reported: it is a static source-assertion test file with a self-describing header, and its author split (degen11/Degen/Degen11) is one owner under several git identities, so the whole repo is effectively single-maintainer rather than this file being a concentration. In-memory rate limiter has a read-site comment (contact.ts:5) so rationale is recorded; whether it is acceptable on Vercel is left to security per survey. Survey treats code as truth and docs as possibly stale, so drift was judged doc-at-fault; architecture should recheck if intent changes. AI-only category, no tool corroborates any of it. [coverage=full]
Detector coverage: Detector: detect-security. Coverage: traced the single mutating entry point (POST /api/contact); every other route is prerendered and read-only, and there is no auth/role surface to check. No middleware file; Astro checkOrigin default left on; JSON body needs a CORS preflight the route does not grant. gitleaks ran (0 findings) and only .env.example appears in env-file history, so secret coverage is tool-backed. semgrep FAILED (exit 2), so known-insecure-pattern coverage is eslint-sonar only. No database, schema or migrations exist, so Cases 3 and 4 do not apply. Judged and not filed: PUBLIC_WEB3FORMS_KEY is used only server-side and Web3Forms keys are designed to be form-public; CSP script-src unsafe-inline is a defence-in-depth nit with no user-generated HTML rendered; x-forwarded-for spoofing is not exploitable on Vercel, which overwrites the header. Did not restate PH-001/004/005/007 (test-file hotspots, unreachable in production; slow-regex on EMAIL_RE runs only after a 254-char length cap). Left to other detectors: Dependabot auto-merge job in ci.yml (build/dependency); api error-shape consistency (api). [coverage=partial]
Detector coverage: Detector: detect-signage. Coverage: 4 simulated newcomer tasks (set up env and contact form recipients; change the contact email or add a homepage section; work on fonts or the hero map; upgrade or debug against the framework version) plus a name/doc contradiction sweep of CLAUDE.md, README.md, .env.example and code comments in api/contact.ts, Navbar.astro, Layout.astro, site.ts, contact.ts, astro.config.mjs. No lying function names found; code comments match their bodies. Dead-export sweep: src has no index/barrel files, so Case 4 cannot apply; every site.ts/contact.ts export checked has call sites. Left out as noise: README.md:31 lists components out of page order (Clients is second on the page, not after Articles) and counts Footer as a section. knip/ts-prune are not run in this phase, so dead-export coverage is AI-only. No ADRs exist, so there is no drifted ADR to hand to knowledge/architecture. [coverage=full]
Detector coverage: Detector: detect-swerve. Coverage: full history (unshallowed, first commit 2026-04-22, all 158 commits, inside the 24-month window). Walked every non-Dependabot subject and body for workaround/hack/temporary/revert/band-aid/downgrade/guard, grepped src, tests and root config for folklore, TODO/FIXME, ts-ignore, eslint-disable and catch blocks, and read hotspot comments (api/contact.ts, Navbar, ContactForm, og-image, Layout, heroMap). No detour survived. The early history holds only resolved one-off thrash: contact delivery went Web3Forms, Resend, revert, Resend removed (7a04d24, d69fb21, same day); TypeScript went 6 to 5.9.3 and back (6a8180f, adda083); src/scripts import wrappers were reverted (8bf5813). heroMap.ts ts-ignores and the og-image prerender document external constraints (third-party typings, Vercel wasm tracing). The catch blocks are single intentional fallbacks, not a swallow cluster. No feature flags exist. Seen, owned elsewhere: the path-to-regexp 6.3.0 override (a64615c, after repeated skipped audit fixes) is dependency, already noted there; the CSP unsafe-inline added in 8bf5813 is security; tests/build.test.ts skipping in CI because ci.yml runs tests before build is test, already filed there. No architecture-level observations. [coverage=full]
Detector coverage: Detector: detect-test. Coverage: NOT MEASURED. There is no coverage/lcov.info, so lcov did not run and no percentage is claimed. All nine test files under tests/ were read in full. Assertion, skip, coupling and nondeterminism review is AI-only: no mutation testing, no flake detection, no run history. No nondeterminism tells found: no timing waits, no retry setting in vitest.config.ts, and contact.test.ts isolates the module-level rate-limit Map with random IPs. Other categories: (build) .github/workflows/ci.yml runs npm test before npm run build, which is why tests/build.test.ts always skips in CI. (docs) CLAUDE.md says Section uses py-20 sm:py-24 lg:py-28 but src/components/Section.astro:13 and tests/mobile.test.ts:88 say py-16 sm:py-20. CLAUDE.md and the config.test.ts CSP comment still say Astro 6 while package.json pins astro ^7.4.4. legal-pages.test.ts:66 says Inter is self-hosted when the site font is Plus Jakarta Sans. (code) og-image.png.ts:12-13 says fontCache persists per build, but the old serverless-cache rationale lives on only in performance.test.ts:35. [coverage=partial]
Tool coverage: Tools run: eslint-sonar (10 findings), jscpd (5 findings), gitleaks (0 findings), osv-scanner (0 findings), madge (0 findings), repowise-dead-code (0 findings), repowise-health (3 findings). Skipped (not measured): sonar — set SONAR_HOST_URL, SONAR_TOKEN, SONAR_PROJECT_KEY (or sonar-project.properties); semgrep — failed (exit 2; message withheld — tool output can echo repo contents); lcov — no coverage/lcov.info in the repo (Pothole never runs the target's tests, so it cannot produce one): coverage is not measured. Coverage notes: none.
Coverage flags: unverified=0 partial-findings=10 missing-verdicts=0 never-scanned=0 stale-verdicts=0 unparseable=0 tool-coverage=partial
Category status: code=verified+full architecture=verified+full test=verified+partial dependency=verified+partial knowledge=verified+full build=verified+full api=verified+full security=verified+partial swerve=verified+full signage=verified+full
A category with 0 confirmed findings is "nothing confirmed", never "no debt". Read the coverage clauses above before drawing any conclusion from a count.

## Confirmed

Survived an adversarial Inspector. These are the register: everything downstream — scoring, work zones, issues — derives from this section only.

## PH-519 Section anchor ids are hardcoded in every section component instead of read from the declared single source in site.ts

```yaml
id: PH-519
category: architecture
title: Section anchor ids are hardcoded in every section component instead of
  read from the declared single source in site.ts
severity: major
traffic: 0.5668199597532645
confidence: confirmed
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
verdict_reason: "All 11 refs resolve: site.ts:42/50 declare sections and
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
```

## PH-819 Node runtime version is declared only in CI; no engines field or .nvmrc for local builds or the Vercel deploy

```yaml
id: PH-819
category: build
title: Node runtime version is declared only in CI; no engines field or .nvmrc
  for local builds or the Vercel deploy
severity: minor
traffic: 1
confidence: confirmed
evidence:
  - .github/workflows/ci.yml:19
  - package.json:5
  - package-lock.json:3700
source:
  - detect-build
repair_cost: S
fingerprint: build:package.json:node-version-undeclared-outside-ci
verdict_reason: "Survived evidence/trap/documented/unreachable: ci.yml:19 is the
  only Node pin ('22'); package.json has no engines field (line 5 cites the
  file, the absence is the argument); no .nvmrc/.node-version at root;
  README/CLAUDE.md state no Node version; package-lock.json:3700 is astro's
  engines node >=22.23.4. Vercel runtime comes from dashboard. Commit a536585
  ('fix nodejs18.x runtime error') shows runtime drift has bitten before."
```

## PH-820 Plus Jakarta Sans is downloaded from Fontsource at build time with no pinned version

```yaml
id: PH-820
category: build
title: Plus Jakarta Sans is downloaded from Fontsource at build time with no
  pinned version
severity: minor
traffic: 0.16456899249087573
confidence: confirmed
evidence:
  - astro.config.mjs:15
  - astro.config.mjs:17
source:
  - detect-build
repair_cost: S
fingerprint: build:astro.config.mjs:fontsource-build-fetch-unpinned
verdict_reason: "Survived all routes: astro.config.mjs:15-17 uses
  fontProviders.fontsource() with no version;
  node_modules/unifont/dist/index.mjs fetches api.fontsource.org/v1 metadata and
  uses API-returned variant URLs (variable path hardcodes @latest), no integrity
  check. The config comment documents the build-time download but not pinning,
  so documented does not refute the reproducibility/offline-build cost. Not Case
  3 trap: no pinned in-repo declaration."
```

## PH-019 Homepage section ids are re-declared as string literals beside the site.ts single source, and scroll-spy skips mismatches silently

```yaml
id: PH-019
category: code
title: Homepage section ids are re-declared as string literals beside the
  site.ts single source, and scroll-spy skips mismatches silently
severity: minor
traffic: 0.5668199597532645
confidence: confirmed
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
verdict_reason: "All refs resolve: site.ts:42/50 declare sections and
  CONTACT_SECTION_ID; literal ids at ContactForm:17 (also About:47, Services:36,
  WhyBloq:37, Articles:10, Clients:24) and literal #contact/#services/#articles
  hrefs at Hero:45, Services:47, About:66, MobileCta:14, 404:28, plus
  getElementById(contact) at MobileCta:22; Navbar:215 skips missing ids
  silently. No trap matches (one value, not separate bounded contexts);
  CLAUDE.md forbids hardcoding section ids, so it is undocumented drift, not
  intent; all on the live homepage. Further literals at Hero:49, Services:58,
  Layout:45 not cited."
```

## PH-419 Hero map pulls in the whole d3 umbrella for two d3-geo functions, with types suppressed by @ts-ignore

```yaml
id: PH-419
category: dependency
title: Hero map pulls in the whole d3 umbrella for two d3-geo functions, with
  types suppressed by @ts-ignore
severity: minor
traffic: 1
confidence: confirmed
evidence:
  - package.json:26
  - src/lib/heroMap.ts:5
  - src/lib/heroMap.ts:6
source:
  - detect-dependency
repair_cost: S
fingerprint: dependency:src/lib/heroMap.ts:d3-umbrella-for-geo-only
partial: true
verdict_reason: "All three refs resolve: package.json:26 is d3 ^7.9.0 in
  dependencies, heroMap.ts:5-6 is the @ts-ignore over the only d3 import in src
  (geoMercator, geoPath). node_modules/d3/package.json has no types field and
  node_modules/@types has no d3, so the import is really untyped under astro
  strict; 30 d3-* packages installed. No study-case trap matches (not an
  advisory, abandonment, duplicate pair or pin), the ts-ignore comment misstates
  the cause rather than documenting the choice, and build-time-only use does not
  refute an install-graph/typing claim. Severity minor stands."
```

## PH-719 CLAUDE.md and README still declare Astro v6 after the upgrade to Astro 7

```yaml
id: PH-719
category: knowledge
title: CLAUDE.md and README still declare Astro v6 after the upgrade to Astro 7
severity: minor
traffic: 1
confidence: confirmed
evidence:
  - CLAUDE.md:39
  - README.md:22
  - package.json:25
  - 499815f
source:
  - detect-knowledge
repair_cost: S
fingerprint: knowledge:CLAUDE.md:stale-astro-major-version
verdict_reason: "Checked all four routes, none kills it. evidence: CLAUDE.md:39
  and README.md:22 both say Astro v6, package.json:25 pins astro ^7.4.4, and
  commit 499815f is titled 'upgrade astro 6->7'. trap: not a superseded doc that
  says so. documented: nothing records v6 as still intended. reachable:
  CLAUDE.md is the declared architecture doc and a top hotspot."
```

## PH-720 README describes an Inter-font, interactive, Jakarta-inclusive site the code no longer builds

```yaml
id: PH-720
category: knowledge
title: README describes an Inter-font, interactive, Jakarta-inclusive site the
  code no longer builds
severity: minor
traffic: 0.6452886908735518
confidence: confirmed
evidence:
  - README.md:26
  - astro.config.mjs:18
  - README.md:11
  - src/lib/heroMap.ts:36
  - CLAUDE.md:137
source:
  - detect-knowledge
repair_cost: S
fingerprint: knowledge:README.md:stale-readme-feature-stack
verdict_reason: "evidence: README.md:26 says the site self-hosts Inter, but
  astro.config.mjs:18 self-hosts Plus Jakarta Sans (Inter appears only in
  og-image.png.ts). README.md:11 promises an interactive map that includes
  Jakarta, but the heroMap.ts:36 CITIES list has no Jakarta, and CLAUDE.md:137
  says the map is build-time with no JS and explains why Jakarta is missing.
  README.md:24 also contradicts line 11. Not signage: no setup step fails. This
  is drift in the record of a decision."
```

## PH-721 .env.example says the team CC comes from a hidden form field, but the API adds it server-side

```yaml
id: PH-721
category: knowledge
title: .env.example says the team CC comes from a hidden form field, but the API
  adds it server-side
severity: minor
traffic: 0.3001197363582303
confidence: confirmed
evidence:
  - .env.example:3
  - src/pages/api/contact.ts:100
  - src/lib/site.ts:11
source:
  - detect-knowledge
repair_cost: S
fingerprint: knowledge:.env.example:stale-cc-mechanism-comment
verdict_reason: "evidence: .env.example:3 claims the CC is set by a hidden form
  field, but ContactForm.astro has no such field (only the honeypot), and
  contact.ts:100 sets cc: TEAM_EMAIL from site.ts:11. History confirms the
  drift: git log -S finds the hidden cc field in 31c2fb7/d2d9fc3/7a04d24 and
  removes it in ec09bf9, and .env.example was not touched after that. The stale
  part is what the config means, not a missing name, so it is knowledge, not
  build."
```

## PH-319 contact form abuse control is a per-instance in-memory map, so the documented 1 req/min per-IP limit does not hold on Vercel

```yaml
id: PH-319
category: security
title: contact form abuse control is a per-instance in-memory map, so the
  documented 1 req/min per-IP limit does not hold on Vercel
severity: minor
traffic: 0.7614597503424346
confidence: confirmed
evidence:
  - src/pages/api/contact.ts:5
  - src/pages/api/contact.ts:40
  - src/pages/api/contact.ts:87
  - CLAUDE.md:125
source:
  - detect-security
repair_cost: M
fingerprint: security:src/pages/api/contact.ts:contact-rate-limit-per-instance
partial: true
verdict_reason: "Survived all routes. evidence: contact.ts:5-6 module-level Map
  (comment itself scopes it to a warm instance), :40 keys on x-forwarded-for,
  :87 is the only server-side throttle; CLAUDE.md:125 states a plain 1 req/min
  per IP. trap: Case 1 not-this n/a - no middleware file and vercel.json holds
  only headers, no firewall/rate-limit rule; no shared store (KV/Upstash)
  anywhere in src. documented: the code comment admits the scope but no
  ADR/README accepts it as a limitation (survey open question 4 is unanswered),
  and documentation would not refute the cost claim anyway. unreachable: POST
  /api/contact is the one live server route. Category correct (abuse control).
  Minor stands: spam/quota exhaustion of a contact form, honeypot only stops
  naive bots."
```

## PH-220 README says the Astro Fonts API self-hosts Inter, but the site font is Plus Jakarta Sans

```yaml
id: PH-220
category: signage
title: README says the Astro Fonts API self-hosts Inter, but the site font is
  Plus Jakarta Sans
severity: minor
traffic: 0.3241459764182721
confidence: confirmed
evidence:
  - README.md:26
  - astro.config.mjs:18
  - src/layouts/Layout.astro:130
source:
  - detect-signage
repair_cost: S
fingerprint: signage:repo-docs:readme-names-inter-as-site-font
verdict_reason: "Checked: README.md:26 says the Fonts API self-hosts Inter;
  astro.config.mjs:18 registers only Plus Jakarta Sans and Layout.astro:130
  renders --font-jakarta. No trap applies (not a marked future path, no ADR);
  nothing documents Inter as the site font."
```

## PH-221 README describes an interactive hero map that includes Jakarta, but the map is a static aria-hidden SVG with no Jakarta marker

```yaml
id: PH-221
category: signage
title: README describes an interactive hero map that includes Jakarta, but the
  map is a static aria-hidden SVG with no Jakarta marker
severity: minor
traffic: 0.6452886908735518
confidence: confirmed
evidence:
  - README.md:11
  - src/lib/heroMap.ts:36
  - src/components/Hero.astro:70
  - CLAUDE.md:137
source:
  - detect-signage
repair_cost: S
fingerprint: signage:repo-docs:readme-hero-map-interactive-with-jakarta
verdict_reason: "Checked: README.md:11 claims an interactive map incl. Jakarta;
  heroMap.ts:36 CITIES has six cities without Jakarta, Hero.astro:70 marks the
  map card aria-hidden and it ships as a static img with no script;
  CLAUDE.md:137 records Jakarta was dropped on purpose, which documents the
  code, not the README. No trap applies."
```

## PH-222 .env.example says the team address is CC'd through a hidden form field, but the API route sets cc server-side from TEAM_EMAIL

```yaml
id: PH-222
category: signage
title: .env.example says the team address is CC'd through a hidden form field,
  but the API route sets cc server-side from TEAM_EMAIL
severity: minor
traffic: 0.3001197363582303
confidence: confirmed
evidence:
  - .env.example:3
  - src/pages/api/contact.ts:100
  - src/lib/site.ts:10
source:
  - detect-signage
repair_cost: S
fingerprint: signage:.env.example:env-example-cc-hidden-field-claim
verdict_reason: "Checked: .env.example:3 says the team address is CC'd via a
  hidden form field; ContactForm.astro has no cc input (only the honeypot), and
  api/contact.ts:100 sets cc from TEAM_EMAIL (site.ts:10-11) server-side.
  Demonstrable contradiction; no trap applies."
```

## PH-223 CLAUDE.md shows a hardcoded hello@bloq.media in the clipboard handler and a home-variable link builder, but the code uses CONTACT_EMAIL and sectionHref()

```yaml
id: PH-223
category: signage
title: CLAUDE.md shows a hardcoded hello@bloq.media in the clipboard handler and
  a home-variable link builder, but the code uses CONTACT_EMAIL and
  sectionHref()
severity: minor
traffic: 0.6452886908735518
confidence: confirmed
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
verdict_reason: "Checked: CLAUDE.md:133 quotes writeText('hello@bloq.media') and
  a hardcoded mailto fallback, but ContactForm.astro:333/343 use CONTACT_EMAIL;
  CLAUDE.md:45 describes a home variable, but Navbar.astro:73 and
  Footer.astro:15 call sectionHref() (site.ts:56) and no home identifier exists.
  The only hello@bloq.media literal in src is site.ts:9. No trap applies."
```

## PH-619 Build-output suite (the guard for the original nodejs18 runtime bug) silently skips in every CI run

```yaml
id: PH-619
category: test
title: Build-output suite (the guard for the original nodejs18 runtime bug)
  silently skips in every CI run
severity: major
traffic: 0.13063748858357987
confidence: confirmed
evidence:
  - tests/build.test.ts:13-16
  - tests/build.test.ts:39
  - .github/workflows/ci.yml:34-38
source:
  - detect-test
repair_cost: S
fingerprint: test:tests/build.test.ts:build-output-suite-skipped-in-ci
kind: flaky
repair: Make the build-output tests run after the build in CI (a separate vitest
  run or project invoked after npm run build), and make them fail rather than
  skip when CI is set and the artifact is missing.
partial: true
verdict_reason: "evidence holds: build.test.ts:13-16,39 skipIf(!hasBuild) on
  .vercel/output vc-config; ci.yml:34-38 runs npm test before npm run build, so
  both suites skip on a clean CI checkout. Header comment (line 4) documents the
  skip but not that CI never runs it, so documented route does not kill the cost
  claim; no trap matches."
```

## PH-620 Navbar scroll-spy, header shadow and menu-dismissal logic are only checked by regex over the source text

```yaml
id: PH-620
category: test
title: Navbar scroll-spy, header shadow and menu-dismissal logic are only
  checked by regex over the source text
severity: major
traffic: 0.5668199597532645
confidence: confirmed
evidence:
  - src/components/Navbar.astro:208-247
  - tests/mobile.test.ts:117-125
source:
  - detect-test
repair_cost: L
fingerprint: test:src/components/Navbar.astro:navbar-client-behaviour-untested
repair: Move getActiveSection into src/lib as a pure function of (section tops,
  scrollY, navHeight) and unit test it, including the Clients-out-of-order case
  and the contact section.
partial: true
verdict_reason: "evidence holds: Navbar.astro:208-247 holds getActiveSection
  position logic, 10px header toggle and 40px close; only tests are source
  regexes (mobile.test.ts:117-125) and aria-label string checks in
  accessibility.test.ts; no test computes the active link for any scroll
  position. No trap, not documented as intentionally untested, reachable on
  every page."
```

## PH-621 ContactForm client script (validation, server-error display, success swap, analytics, copy button) has no behavioral test

```yaml
id: PH-621
category: test
title: ContactForm client script (validation, server-error display, success
  swap, analytics, copy button) has no behavioral test
severity: major
traffic: 0.5561511218948507
confidence: confirmed
evidence:
  - src/components/ContactForm.astro:266-330
  - tests/accessibility.test.ts:45-74
source:
  - detect-test
repair_cost: L
fingerprint: test:src/components/ContactForm.astro:contact-form-client-script-untested
repair: Extract the validation and response-handling logic into a module under
  src/lib and test it, or add a jsdom/happy-dom test that submits the form
  against a stubbed fetch and asserts on the visible error, success and
  analytics calls.
partial: true
verdict_reason: "evidence holds: ContactForm.astro:266-330 is the submit handler
  (validation, fetch, server-message display, success swap, track) plus
  clipboard fallback; accessibility.test.ts:45-74 only asserts substrings exist;
  no jsdom/happy-dom or other test exercises the script. Not a trap, reachable."
```

## PH-622 mobile.test.ts asserts exact Tailwind class strings, so it changes with every restyle instead of guarding behavior

```yaml
id: PH-622
category: test
title: mobile.test.ts asserts exact Tailwind class strings, so it changes with
  every restyle instead of guarding behavior
severity: major
traffic: 0.3160864787198279
confidence: confirmed
evidence:
  - tests/mobile.test.ts:43
  - tests/mobile.test.ts:88
  - tests/mobile.test.ts:132
  - tests/mobile.test.ts:168-169
  - tests/mobile.test.ts:205-207
source:
  - detect-test
repair_cost: M
fingerprint: test:tests/mobile.test.ts:class-string-coupled-assertions
repair: Keep the few assertions that encode a real contract (44px tap targets,
  no viewport-height units, lazy map) and check them against rendered output or
  a named token, and drop the ones that just copy the current class list.
partial: true
verdict_reason: "evidence holds at all five lines (literal class lists). git log
  -L confirms commit 871e646 changed line 88 from py-20 sm:py-24 lg:py-28 to
  py-16 sm:py-20 alongside the restyle, i.e. the test was edited green to follow
  code, which is the Case 4 cost on the record; single author (Degen/degen11,
  same email). Not the snapshot trap: these are hand-picked class assertions
  named as behavior contracts."
```

## PH-623 Accessibility tests check aria-hidden and aria-required anywhere in the file, so the specific elements they name are not checked

```yaml
id: PH-623
category: test
title: Accessibility tests check aria-hidden and aria-required anywhere in the
  file, so the specific elements they name are not checked
severity: minor
traffic: 0.5561511218948507
confidence: confirmed
evidence:
  - tests/accessibility.test.ts:19-21
  - tests/accessibility.test.ts:53-55
  - tests/accessibility.test.ts:62-65
  - src/components/ContactForm.astro:33
  - src/components/ContactForm.astro:77
source:
  - detect-test
repair_cost: S
fingerprint: test:tests/accessibility.test.ts:file-wide-aria-assertions
repair: Scope each assertion to its element, e.g. match the honeypot div with a
  regex like /class="honeypot"[^>]*aria-hidden="true"/ or parse the markup and
  select the element by id.
partial: true
verdict_reason: "evidence holds: accessibility.test.ts:19-21,53-55,62-65 use
  whole-file toContain; ContactForm.astro has aria-hidden=true at
  33,59,77,86,108,164 and aria-required at 99,121,175, so removing it from the
  honeypot (77) or name input would still pass. No trap or documentation."
```

## PH-624 config.test.ts CSP and header-scope assertions are too loose to catch the regressions they name

```yaml
id: PH-624
category: test
title: config.test.ts CSP and header-scope assertions are too loose to catch the
  regressions they name
severity: minor
traffic: 0.129985012226537
confidence: confirmed
evidence:
  - tests/config.test.ts:98-102
  - tests/config.test.ts:113-115
  - vercel.json:19-20
source:
  - detect-test
repair_cost: S
fingerprint: test:tests/config.test.ts:loose-csp-assertions
repair: Parse the CSP into directives and assert on script-src itself, and
  assert the header source equals '/(.*)'.
partial: true
verdict_reason: "evidence holds: config.test.ts:101 checks 'unsafe-inline'
  across the whole CSP while vercel.json:20 style-src also has it, so removing
  it from script-src stays green; line 114 toMatch(/\\//) accepts any source
  path. No trap."
```

## PH-625 Contact API rate-limit expiry, eviction sweep and forwarded-for parsing are untested

```yaml
id: PH-625
category: test
title: Contact API rate-limit expiry, eviction sweep and forwarded-for parsing
  are untested
severity: minor
traffic: 0.3001197363582303
confidence: confirmed
evidence:
  - src/pages/api/contact.ts:9-20
  - src/pages/api/contact.ts:40
  - tests/api/contact.test.ts:71-115
  - tests/api/contact.test.ts:247-250
source:
  - detect-test
repair_cost: S
fingerprint: test:src/pages/api/contact.ts:rate-limit-window-untested
repair: Use vi.useFakeTimers()/vi.setSystemTime to add an after-the-window case
  and an eviction case, add a comma-separated x-forwarded-for case, and check
  Content-Type on a 400 and a 500 response.
partial: true
verdict_reason: "evidence holds: contact.ts:9-20 expiry and >500 eviction sweep
  and :40 comma split of x-forwarded-for; tests never use fake
  timers/setSystemTime, never send a comma list, and never fill 500 entries. The
  Content-Type sub-claim is weak (every response goes through the shared json()
  helper at contact.ts:22-27) but the core untested-branch claim stands."
```

## PH-626 OG-image tests pin a font-cache implementation whose stated reason (warm serverless instances) no longer applies

```yaml
id: PH-626
category: test
title: OG-image tests pin a font-cache implementation whose stated reason (warm
  serverless instances) no longer applies
severity: minor
traffic: 0.22212064131062326
confidence: confirmed
evidence:
  - tests/performance.test.ts:34-49
  - src/pages/og-image.png.ts:10-38
source:
  - detect-test
repair_cost: S
fingerprint: test:tests/performance.test.ts:stale-font-cache-coupled-tests
repair: Delete the four fontCache string tests and add one that stubs fetch with
  wrong bytes and asserts that loadFont/GET rejects with the integrity error.
partial: true
verdict_reason: "evidence holds: performance.test.ts:34-49 pin four fontCache
  substrings with a warm-serverless rationale (line 35) while og-image.png.ts:10
  prerenders and :12 says once per build; the SHA-256 integrity check at :21-30
  has no test (no FONT_SHA256/integrity reference in tests/). Fits Case 4
  coupling, not its interaction-contract trap."
```

## Refuted

Judged false positives, kept with their reasons **so the same false positive does not return** on the next run: the next Inspector reads these before judging, and overturning one needs a reason that answers the refutation.

## PH-219 README and CLAUDE.md say the site is Astro v6, but package.json pins astro ^7.4.4

```yaml
id: PH-219
category: signage
title: README and CLAUDE.md say the site is Astro v6, but package.json pins
  astro ^7.4.4
severity: major
traffic: 1
confidence: refuted
evidence:
  - CLAUDE.md:39
  - README.md:22
  - package.json:28
source:
  - detect-signage
repair_cost: S
fingerprint: signage:repo-docs:docs-name-astro-v6-but-v7-installed
refutation: "evidence: package.json:28 is the topojson-client dependency, not
  astro (astro ^7.4.4 is at package.json:25, also at HEAD 2613e84); a ref that
  points at an unrelated line refutes the finding. The underlying v6-vs-v7 drift
  (CLAUDE.md:39, README.md:22) looks real and should be re-filed next scan with
  correct evidence."
```

## Not verified

No verdict was recorded for these. They are neither confirmed nor absent — an Inspector did not complete, or its category has no verdicts file. Do not read this section as "less important"; read it as "unmeasured".

_None._
