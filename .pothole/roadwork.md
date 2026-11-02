# Roadwork: bloq-media

## What this is scored from

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

**Every RQI below is an upper bound on quality, not a score** — at least one finding came from a partial detector run, so its slice is a floor rather than a total; 3 category/ies were only partly measured (dependency, security, test), so their slices are floors rather than totals; deterministic tools were skipped, so the slices they own are unmeasured. Unmeasured debt cannot lower an RQI, so a good number here means "nothing worse was found", never "nothing worse is there".

Scored: 21 confirmed · excluded: 1 refuted, 0 unverified. Refuted and unverified findings are **not** work and appear in no zone below; the unverified ones are not absent either — they were never judged.

Model (`lib/scoring.mjs`): interest = severity weight × traffic × amplifier, priority = interest ÷ repair cost, RQI = 100 × exp(−interest ÷ files). Severity weights {"cosmetic":0.1,"minor":0.3,"major":0.7,"structural":1}; cost weights {"S":1,"M":3,"L":8,"XL":20}; a confirmed swerve or signage finding amplifies its module's other findings ×1.5, once, never compounded.

## Scoreboard

Repo total: **21 confirmed finding(s), 4.064 interest** across 6 module(s) and 55 file(s) in the traffic model.

_No repo-wide RQI is reported. Density across a whole repo is dominated by its clean files — every real repo lands at 95-100 whatever it carries — so the number could not move and would read as a clean bill of health. RQI is meaningful per module, where the denominator is the module's own size._

| module | findings | interest | RQI | files |
|---|---|---:|---:|---:|
| . _(unattributed: repo-root files and git-ref evidence — not a module)_ | 9 | 1.5074 | 89 | 13 |
| src/components | 2 | 0.7861 | 95 | 14 |
| tests | 5 | 0.5852 | 93 | 8 |
| src/lib | 2 | 0.5668 | 89 | 5 |
| src/pages | 2 | 0.3185 | 96 | 7 |
| .github/workflows | 1 | 0.3 | 74 | 1 |

_Ordered by accumulated interest — the burden — not by RQI. RQI is a density, so ranking on it puts the smallest directory on top: a two-file deploy directory with one finding outranks a seven-finding module carrying five times the interest. Anchors: one hot major finding per file ≈ 50, one hot structural per file ≈ 37._

## Work zones (repair in this order)

Findings are grouped by module, and across modules when git history says their files change together (coupling ≥ 0.5). Close the road once.

**Read the order with its bias in mind.** Zones rank by *summed priority*, and priority divides interest by repair cost, so this order favours many cheap repairs over one large one: eight hot cosmetic S findings outrank one hot major S, and because `XL` divides by 20 while `S` divides by 1, the largest structural work will always appear near the bottom however severe it is. That is the intended reading — cheap wins first — but it means **the interest column, not the position, is what says how much a zone actually costs the team.** Where the two disagree, the disagreement is the information.

### Zone 1: .github/workflows + tests — priority 0.7377, cost M

Why together: coupled — package.json ↔ tests/build.test.ts (co 3, strength 0.75).

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-819 | build | minor | 1.00 | 0.3 | 0.3 | S | Node runtime version is declared only in CI; no engines field or .nvmrc for local builds or the Vercel deploy |
| PH-623 | test | minor | 0.56 | 0.1668 | 0.1668 | S | Accessibility tests check aria-hidden and aria-required anywhere in the file, so the specific elements they name are not checked |
| PH-619 | test | major | 0.13 | 0.0914 | 0.0914 | S | Build-output suite (the guard for the original nodejs18 runtime bug) silently skips in every CI run |
| PH-622 | test | major | 0.32 | 0.2213 | 0.0738 | M | mobile.test.ts asserts exact Tailwind class strings, so it changes with every restyle instead of guarding behavior |
| PH-626 | test | minor | 0.22 | 0.0666 | 0.0666 | S | OG-image tests pin a font-cache implementation whose stated reason (warm serverless instances) no longer applies |
| PH-624 | test | minor | 0.13 | 0.039 | 0.039 | S | config.test.ts CSP and header-scope assertions are too loose to catch the regressions they name |

Files this zone opens:
- .github/workflows/ci.yml:19
- .github/workflows/ci.yml:34-38
- package-lock.json:3700
- package.json:5
- src/components/ContactForm.astro:33
- src/components/ContactForm.astro:77
- src/pages/og-image.png.ts:10-38
- tests/accessibility.test.ts:19-21
- tests/accessibility.test.ts:53-55
- tests/accessibility.test.ts:62-65
- tests/build.test.ts:13-16
- tests/build.test.ts:39
- tests/config.test.ts:113-115
- tests/config.test.ts:98-102
- tests/mobile.test.ts:132
- tests/mobile.test.ts:168-169
- tests/mobile.test.ts:205-207
- tests/mobile.test.ts:43
- tests/mobile.test.ts:88
- tests/performance.test.ts:34-49
- vercel.json:19-20

### Zone 2: src/components + src/lib — priority 0.3179, cost L

Why together: coupled — src/components/Hero.astro ↔ tests/mobile.test.ts (co 4, strength 0.57); src/components/Navbar.astro ↔ tests/mobile.test.ts (co 4, strength 0.57).

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-019 | code | minor | 0.57 | 0.17 | 0.17 | S | Homepage section ids are re-declared as string literals beside the site.ts single source, and scroll-spy skips mismatches silently |
| PH-519 | architecture | major | 0.57 | 0.3968 | 0.0496 | L | Section anchor ids are hardcoded in every section component instead of read from the declared single source in site.ts |
| PH-620 | test | major | 0.57 | 0.3968 | 0.0496 | L | Navbar scroll-spy, header shadow and menu-dismissal logic are only checked by regex over the source text |
| PH-621 | test | major | 0.56 | 0.3893 | 0.0487 | L | ContactForm client script (validation, server-error display, success swap, analytics, copy button) has no behavioral test |

Files this zone opens:
- commit 6e06492 Standardize shared site data, UI components, and US spelling
- src/components/About.astro:47
- src/components/About.astro:66
- src/components/Articles.astro:10
- src/components/Clients.astro:24
- src/components/ContactForm.astro:17
- src/components/ContactForm.astro:266-330
- src/components/Hero.astro:45
- src/components/MobileCta.astro:14
- src/components/MobileCta.astro:22
- src/components/Navbar.astro:208-247
- src/components/Navbar.astro:215
- src/components/Services.astro:36
- src/components/Services.astro:47
- src/components/WhyBloq.astro:37
- src/lib/site.ts:42
- src/lib/site.ts:50
- src/pages/404.astro:28
- tests/accessibility.test.ts:45-74
- tests/mobile.test.ts:117-125

### Zone 3: . — priority 0.3, cost S

Why together: same module.

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-419 | dependency | minor | 1.00 | 0.3 | 0.3 | S | Hero map pulls in the whole d3 umbrella for two d3-geo functions, with types suppressed by @ts-ignore |

Files this zone opens:
- package.json:26
- src/lib/heroMap.ts:5
- src/lib/heroMap.ts:6

### Zone 4: . — priority 0.3, cost S

Why together: same module.

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-719 | knowledge | minor | 1.00 | 0.3 | 0.3 | S | CLAUDE.md and README still declare Astro v6 after the upgrade to Astro 7 |

Files this zone opens:
- 499815f
- CLAUDE.md:39
- README.md:22
- package.json:25

### Zone 5: . — priority 0.1936, cost S

Why together: same module.

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-720 | knowledge | minor | 0.65 | 0.1936 | 0.1936 | S | README describes an Inter-font, interactive, Jakarta-inclusive site the code no longer builds |

Files this zone opens:
- CLAUDE.md:137
- README.md:11
- README.md:26
- astro.config.mjs:18
- src/lib/heroMap.ts:36

### Zone 6: . — priority 0.1936, cost S

Why together: same module.

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-221 | signage | minor | 0.65 | 0.1936 | 0.1936 | S | README describes an interactive hero map that includes Jakarta, but the map is a static aria-hidden SVG with no Jakarta marker |

Files this zone opens:
- CLAUDE.md:137
- README.md:11
- src/components/Hero.astro:70
- src/lib/heroMap.ts:36

### Zone 7: . — priority 0.1936, cost S

Why together: same module.

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-223 | signage | minor | 0.65 | 0.1936 | 0.1936 | S | CLAUDE.md shows a hardcoded hello@bloq.media in the clipboard handler and a home-variable link builder, but the code uses CONTACT_EMAIL and sectionHref() |

Files this zone opens:
- CLAUDE.md:133
- CLAUDE.md:45
- src/components/ContactForm.astro:333
- src/components/ContactForm.astro:343
- src/components/Navbar.astro:73
- src/lib/site.ts:56

### Zone 8: src/pages — priority 0.1662, cost M

Why together: same module.

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-625 | test | minor | 0.30 | 0.09 | 0.09 | S | Contact API rate-limit expiry, eviction sweep and forwarded-for parsing are untested |
| PH-319 | security | minor | 0.76 | 0.2284 | 0.0761 | M | contact form abuse control is a per-instance in-memory map, so the documented 1 req/min per-IP limit does not hold on Vercel |

Files this zone opens:
- CLAUDE.md:125
- src/pages/api/contact.ts:40
- src/pages/api/contact.ts:5
- src/pages/api/contact.ts:87
- src/pages/api/contact.ts:9-20
- tests/api/contact.test.ts:247-250
- tests/api/contact.test.ts:71-115

### Zone 9: . — priority 0.0972, cost S

Why together: same module.

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-220 | signage | minor | 0.32 | 0.0972 | 0.0972 | S | README says the Astro Fonts API self-hosts Inter, but the site font is Plus Jakarta Sans |

Files this zone opens:
- README.md:26
- astro.config.mjs:18
- src/layouts/Layout.astro:130

### Zone 10: . — priority 0.09, cost S

Why together: same module.

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-721 | knowledge | minor | 0.30 | 0.09 | 0.09 | S | .env.example says the team CC comes from a hidden form field, but the API adds it server-side |

Files this zone opens:
- .env.example:3
- src/lib/site.ts:11
- src/pages/api/contact.ts:100

### Zone 11: . — priority 0.09, cost S

Why together: same module.

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-222 | signage | minor | 0.30 | 0.09 | 0.09 | S | .env.example says the team address is CC'd through a hidden form field, but the API route sets cc server-side from TEAM_EMAIL |

Files this zone opens:
- .env.example:3
- src/lib/site.ts:10
- src/pages/api/contact.ts:100

### Zone 12: . — priority 0.0494, cost S

Why together: same module.

| id | category | severity | traffic | interest | priority | cost | title |
|---|---|---|---:|---:|---:|---|---|
| PH-820 | build | minor | 0.16 | 0.0494 | 0.0494 | S | Plus Jakarta Sans is downloaded from Fontsource at build time with no pinned version |

Files this zone opens:
- astro.config.mjs:15
- astro.config.mjs:17

## Not scored

- **1 refuted** — judged false positives; kept in the register with their reasons so the same false positive does not return.
- **0 unverified** — never judged. Not absent, not confirmed. Re-run `/pothole:verify` for those categories before reading any number above as complete.
