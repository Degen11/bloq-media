# Findings: knowledge

Detector: detect-knowledge. Coverage: no ADR directory exists; CLAUDE.md, README.md and .env.example (the declared-decision record per survey) checked claim-by-claim against code; the single env read (import.meta.env.PUBLIC_WEB3FORMS_KEY, contact.ts:91) is documented with its meaning in README, CLAUDE.md and .env.example, so no undocumented required value. Bus-factor-1 list (tests/mobile.test.ts) not reported: it is a static source-assertion test file with a self-describing header, and its author split (degen11/Degen/Degen11) is one owner under several git identities, so the whole repo is effectively single-maintainer rather than this file being a concentration. In-memory rate limiter has a read-site comment (contact.ts:5) so rationale is recorded; whether it is acceptable on Vercel is left to security per survey. Survey treats code as truth and docs as possibly stale, so drift was judged doc-at-fault; architecture should recheck if intent changes. AI-only category, no tool corroborates any of it. [coverage=full]

## PH-719 CLAUDE.md and README still declare Astro v6 after the upgrade to Astro 7

```yaml
id: PH-719
category: knowledge
title: CLAUDE.md and README still declare Astro v6 after the upgrade to Astro 7
severity: minor
traffic: 1
confidence: ai-suspected
evidence:
  - CLAUDE.md:39
  - README.md:22
  - package.json:25
  - 499815f
source:
  - detect-knowledge
repair_cost: S
fingerprint: knowledge:CLAUDE.md:stale-astro-major-version
```

CLAUDE.md:39 (the repo's declared architecture doc and a top hotspot) and README.md:22 both say the site is an Astro v6 site, but package.json:25 pins astro ^7.4.4 (installed 7.4.4) and commit 499815f records the 6 to 7 upgrade. A reader or assistant trusting the doc will consult v6 APIs and migration notes for a v7 codebase.

## PH-720 README describes an Inter-font, interactive, Jakarta-inclusive site the code no longer builds

```yaml
id: PH-720
category: knowledge
title: README describes an Inter-font, interactive, Jakarta-inclusive site the
  code no longer builds
severity: minor
traffic: 0.6452886908735518
confidence: ai-suspected
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
```

README.md:26 says the Astro Fonts API self-hosts Inter, but astro.config.mjs:18 self-hosts Plus Jakarta Sans (Inter is only used for the OG image). README.md:11 lists an interactive map including Jakarta, but heroMap.ts:36-42 has no Jakarta marker and CLAUDE.md:137 records why (it would sit under the story card); the map is a static aria-hidden prerendered SVG with no client JS. The public-facing description contradicts both the code and the other doc.

## PH-721 .env.example says the team CC comes from a hidden form field, but the API adds it server-side

```yaml
id: PH-721
category: knowledge
title: .env.example says the team CC comes from a hidden form field, but the API
  adds it server-side
severity: minor
traffic: 0.3001197363582303
confidence: ai-suspected
evidence:
  - .env.example:3
  - src/pages/api/contact.ts:100
  - src/lib/site.ts:11
source:
  - detect-knowledge
repair_cost: S
fingerprint: knowledge:.env.example:stale-cc-mechanism-comment
```

.env.example:3 says degen@bloq.media is CC'd automatically via the hidden field in the form. ContactForm.astro has no such field (its only hidden field is the honeypot); the CC is set server-side as cc: TEAM_EMAIL at contact.ts:100 from site.ts:11. Someone changing the CC address would look in the form and the Web3Forms dashboard instead of site.ts.
