# Verdicts: test

Inspector: inspect-test. Coverage: every finding judged; all evidence refs opened, git history checked for PH-622. Test files read only, nothing executed.

## PH-619 confirmed

```yaml
id: PH-619
verdict: confirmed
reason: "evidence holds: build.test.ts:13-16,39 skipIf(!hasBuild) on
  .vercel/output vc-config; ci.yml:34-38 runs npm test before npm run build, so
  both suites skip on a clean CI checkout. Header comment (line 4) documents the
  skip but not that CI never runs it, so documented route does not kill the cost
  claim; no trap matches."
fingerprint: test:tests/build.test.ts:build-output-suite-skipped-in-ci
```

## PH-620 confirmed

```yaml
id: PH-620
verdict: confirmed
reason: "evidence holds: Navbar.astro:208-247 holds getActiveSection position
  logic, 10px header toggle and 40px close; only tests are source regexes
  (mobile.test.ts:117-125) and aria-label string checks in
  accessibility.test.ts; no test computes the active link for any scroll
  position. No trap, not documented as intentionally untested, reachable on
  every page."
fingerprint: test:src/components/Navbar.astro:navbar-client-behaviour-untested
```

## PH-621 confirmed

```yaml
id: PH-621
verdict: confirmed
reason: "evidence holds: ContactForm.astro:266-330 is the submit handler
  (validation, fetch, server-message display, success swap, track) plus
  clipboard fallback; accessibility.test.ts:45-74 only asserts substrings exist;
  no jsdom/happy-dom or other test exercises the script. Not a trap, reachable."
fingerprint: test:src/components/ContactForm.astro:contact-form-client-script-untested
```

## PH-622 confirmed

```yaml
id: PH-622
verdict: confirmed
reason: "evidence holds at all five lines (literal class lists). git log -L
  confirms commit 871e646 changed line 88 from py-20 sm:py-24 lg:py-28 to py-16
  sm:py-20 alongside the restyle, i.e. the test was edited green to follow code,
  which is the Case 4 cost on the record; single author (Degen/degen11, same
  email). Not the snapshot trap: these are hand-picked class assertions named as
  behavior contracts."
fingerprint: test:tests/mobile.test.ts:class-string-coupled-assertions
```

## PH-623 confirmed

```yaml
id: PH-623
verdict: confirmed
reason: "evidence holds: accessibility.test.ts:19-21,53-55,62-65 use whole-file
  toContain; ContactForm.astro has aria-hidden=true at 33,59,77,86,108,164 and
  aria-required at 99,121,175, so removing it from the honeypot (77) or name
  input would still pass. No trap or documentation."
fingerprint: test:tests/accessibility.test.ts:file-wide-aria-assertions
```

## PH-624 confirmed

```yaml
id: PH-624
verdict: confirmed
reason: "evidence holds: config.test.ts:101 checks 'unsafe-inline' across the
  whole CSP while vercel.json:20 style-src also has it, so removing it from
  script-src stays green; line 114 toMatch(/\\//) accepts any source path. No
  trap."
fingerprint: test:tests/config.test.ts:loose-csp-assertions
```

## PH-625 confirmed

```yaml
id: PH-625
verdict: confirmed
reason: "evidence holds: contact.ts:9-20 expiry and >500 eviction sweep and :40
  comma split of x-forwarded-for; tests never use fake timers/setSystemTime,
  never send a comma list, and never fill 500 entries. The Content-Type
  sub-claim is weak (every response goes through the shared json() helper at
  contact.ts:22-27) but the core untested-branch claim stands."
fingerprint: test:src/pages/api/contact.ts:rate-limit-window-untested
```

## PH-626 confirmed

```yaml
id: PH-626
verdict: confirmed
reason: "evidence holds: performance.test.ts:34-49 pin four fontCache substrings
  with a warm-serverless rationale (line 35) while og-image.png.ts:10 prerenders
  and :12 says once per build; the SHA-256 integrity check at :21-30 has no test
  (no FONT_SHA256/integrity reference in tests/). Fits Case 4 coupling, not its
  interaction-contract trap."
fingerprint: test:tests/performance.test.ts:stale-font-cache-coupled-tests
```
