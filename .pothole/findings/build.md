# Findings: build

Detector: detect-build. Coverage: .github/workflows/ci.yml, .github/dependabot.yml, package.json scripts, astro.config.mjs, vercel.json, .gitignore, .env.example and the README setup section read end to end; every env read in src/ (one: import.meta.env.PUBLIC_WEB3FORMS_KEY in src/pages/api/contact.ts) cross-checked against .env.example, which lists it, so no env drift. No scripts/, Makefile, Dockerfile or release doc exists; deploys are Vercel git integration, so release steps are not documented in-repo (not scored as a finding: nothing in the repo claims a manual step). Commit subjects grepped for retry/re-run/flaky/again: no retry loops or retry history in CI. Build-time network fetches noted: og-image.png.ts pulls Inter from jsDelivr pinned by version and SHA-256 (a declared contract, not debt). No tool in this phase reads build inputs, so build coverage is AI-only. For knowledge: .env.example comments name recipient addresses that differ from the CC/TO addresses CLAUDE.md attributes to src/lib/site.ts; worth a knowledge/signage check. No runtime CI flake could be assessed (CI logs out of scope). [coverage=full]

## PH-819 Node runtime version is declared only in CI; no engines field or .nvmrc for local builds or the Vercel deploy

```yaml
id: PH-819
category: build
title: Node runtime version is declared only in CI; no engines field or .nvmrc
  for local builds or the Vercel deploy
severity: minor
traffic: 1
confidence: ai-suspected
evidence:
  - .github/workflows/ci.yml:19
  - package.json:5
  - package-lock.json:3700
source:
  - detect-build
repair_cost: S
fingerprint: build:package.json:node-version-undeclared-outside-ci
```

Astro 7 requires node >=22.23.4 (package-lock.json:3700), but the only place the repo states a Node version is the CI setup-node step ('22'). package.json has no engines field and there is no .nvmrc/.node-version, so a fresh clone gets no signal which Node to use and the production runtime on Vercel is whatever the project dashboard says, an input that lives outside the repo. A contributor on Node 20 or an older 22.x hits an engine failure or subtle breakage with nothing in-repo to explain it; a Vercel default change can drift production away from what CI tested.

## PH-820 Plus Jakarta Sans is downloaded from Fontsource at build time with no pinned version

```yaml
id: PH-820
category: build
title: Plus Jakarta Sans is downloaded from Fontsource at build time with no
  pinned version
severity: minor
traffic: 0.16456899249087573
confidence: ai-suspected
evidence:
  - astro.config.mjs:15
  - astro.config.mjs:17
source:
  - detect-build
repair_cost: S
fingerprint: build:astro.config.mjs:fontsource-build-fetch-unpinned
```

The fonts entry uses fontProviders.fontsource() with no version, so every build fetches whatever font files the Fontsource API currently serves. A fresh clone cannot build offline and two builds of the same commit can ship different font binaries with no diff to attribute it to. The OG image endpoint shows the repo's own better pattern (a version-pinned URL checked against a SHA-256); the site font has neither pin nor integrity check, nor a committed local copy.
