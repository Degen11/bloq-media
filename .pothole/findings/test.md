# Findings: test

Detector: detect-test. Coverage: NOT MEASURED. There is no coverage/lcov.info, so lcov did not run and no percentage is claimed. All nine test files under tests/ were read in full. Assertion, skip, coupling and nondeterminism review is AI-only: no mutation testing, no flake detection, no run history. No nondeterminism tells found: no timing waits, no retry setting in vitest.config.ts, and contact.test.ts isolates the module-level rate-limit Map with random IPs. Other categories: (build) .github/workflows/ci.yml runs npm test before npm run build, which is why tests/build.test.ts always skips in CI. (docs) CLAUDE.md says Section uses py-20 sm:py-24 lg:py-28 but src/components/Section.astro:13 and tests/mobile.test.ts:88 say py-16 sm:py-20. CLAUDE.md and the config.test.ts CSP comment still say Astro 6 while package.json pins astro ^7.4.4. legal-pages.test.ts:66 says Inter is self-hosted when the site font is Plus Jakarta Sans. (code) og-image.png.ts:12-13 says fontCache persists per build, but the old serverless-cache rationale lives on only in performance.test.ts:35. [coverage=partial]

## PH-619 Build-output suite (the guard for the original nodejs18 runtime bug) silently skips in every CI run

```yaml
id: PH-619
category: test
title: Build-output suite (the guard for the original nodejs18 runtime bug)
  silently skips in every CI run
severity: major
traffic: 0.13063748858357987
confidence: ai-suspected
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
```

Both describes use skipIf(!hasBuild), where hasBuild checks for .vercel/output/functions/_render.func/.vc-config.json. CI runs `npm test` before `npm run build`, so on a clean checkout that file never exists. Both suites skip and the job still reports green. The header comment calls the runtime check the original bug that started this work, yet CI never runs it. The suite only runs on a developer machine that happens to hold a stale build, so whether it runs depends on local state, not on the code under test.

## PH-620 Navbar scroll-spy, header shadow and menu-dismissal logic are only checked by regex over the source text

```yaml
id: PH-620
category: test
title: Navbar scroll-spy, header shadow and menu-dismissal logic are only
  checked by regex over the source text
severity: major
traffic: 0.5668199597532645
confidence: ai-suspected
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
```

getActiveSection() (it picks the lowest section whose page position has crossed the navbar line, by design not in list order), the 10px header-scrolled toggle and the 40px scroll-away close in Navbar.astro carry real logic in the second-hottest file. The only tests are regexes that check the text `window.scrollY - openedAtY` and an addEventListener('click' ... closeMenu() sequence exist (mobile.test.ts:117-125). No test checks which link gets .nav-active for any scroll position. An inverted comparison or a broken position calculation would pass the suite. Nothing tests this behavior, and fixing it means pulling the logic out of an untested hot file, hence L.

## PH-621 ContactForm client script (validation, server-error display, success swap, analytics, copy button) has no behavioral test

```yaml
id: PH-621
category: test
title: ContactForm client script (validation, server-error display, success
  swap, analytics, copy button) has no behavioral test
severity: major
traffic: 0.5561511218948507
confidence: ai-suspected
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
```

The submit handler validates fields, posts to /api/contact, shows the server's message on failure (e.g. the 429 notice), swaps in the success state and fires track(). The clipboard handler has a mailto fallback. The only coverage is string presence: `setAttribute('aria-invalid', 'true')`, `track('contact_form_submitted')` and `fetch('/api/contact'` each have to appear somewhere in the file. The API handler is tested well, but the browser half of the lead-capture path, in a 0.58-traffic file, is not tested at all.

## PH-622 mobile.test.ts asserts exact Tailwind class strings, so it changes with every restyle instead of guarding behavior

```yaml
id: PH-622
category: test
title: mobile.test.ts asserts exact Tailwind class strings, so it changes with
  every restyle instead of guarding behavior
severity: major
traffic: 0.3160864787198279
confidence: ai-suspected
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
```

Most tests check that a literal class list appears in component source ('text-[44px] sm:text-6xl lg:text-[68px]', 'py-12 sm:py-16 lg:py-[72px]', 'gap-3 md:gap-6', 'flex-wrap sm:flex-nowrap'). A change that keeps the behavior (reordered classes, a token, class:list) turns them red, and a real regression elsewhere in the markup stays green. The record shows the cost: the file changes with Hero.astro and Navbar.astro in 4 of 7 commits (strength 0.57), it is bus-factor-1, and line 88 now asserts 'py-16 sm:py-20' while CLAUDE.md documents the Section padding as py-20 sm:py-24. The test was edited to match the code, so it does not check what was intended.

## PH-623 Accessibility tests check aria-hidden and aria-required anywhere in the file, so the specific elements they name are not checked

```yaml
id: PH-623
category: test
title: Accessibility tests check aria-hidden and aria-required anywhere in the
  file, so the specific elements they name are not checked
severity: minor
traffic: 0.5561511218948507
confidence: ai-suspected
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
```

'honeypot is hidden from assistive technology' passes if `aria-hidden="true"` appears anywhere, and ContactForm.astro has at least five such occurrences (lines 33, 59, 77, 86, 108...). Removing it from the honeypot wrapper at line 77 would still pass. The 'decorative SVG arrows' test has the same problem. 'name input has aria-required' passes if any input has it.

## PH-624 config.test.ts CSP and header-scope assertions are too loose to catch the regressions they name

```yaml
id: PH-624
category: test
title: config.test.ts CSP and header-scope assertions are too loose to catch the
  regressions they name
severity: minor
traffic: 0.129985012226537
confidence: ai-suspected
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
```

The test named "CSP script-src includes 'unsafe-inline'" checks the whole CSP string, and style-src also contains 'unsafe-inline', so dropping it from script-src (which would silently block Astro's inlined scripts, as the comment warns) stays green. 'headers apply to all routes' checks source against /\//, which matches any path, so narrowing the source to one route would not fail.

## PH-625 Contact API rate-limit expiry, eviction sweep and forwarded-for parsing are untested

```yaml
id: PH-625
category: test
title: Contact API rate-limit expiry, eviction sweep and forwarded-for parsing
  are untested
severity: minor
traffic: 0.3001197363582303
confidence: ai-suspected
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
```

The rate-limit tests cover blocking within a window but never move the clock. Nothing checks that an IP is allowed again after 60s, or that the over-500 sweep evicts only expired entries. A broken comparison there could lock visitors out or let the Map grow without bound. The multi-hop x-forwarded-for split (line 40) is never tested with a comma list. 'all responses include Content-Type' checks only the 200 response.

## PH-626 OG-image tests pin a font-cache implementation whose stated reason (warm serverless instances) no longer applies

```yaml
id: PH-626
category: test
title: OG-image tests pin a font-cache implementation whose stated reason (warm
  serverless instances) no longer applies
severity: minor
traffic: 0.22212064131062326
confidence: ai-suspected
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
```

Four tests check that the strings fontCache, `if (!fontCache)`, `fontCache = {` and `return fontCache` exist, justified as persisting across requests on a warm serverless instance. The route is now prerendered (line 10), so that reason no longer holds, and the tests would fail on any rewrite of getFonts() even if output were identical. The behavior that matters, the SHA-256 integrity check at og-image.png.ts:21-30 that rejects a tampered CDN font, has no test.
