# Tool findings: code

Tools run: eslint-sonar (10 findings), jscpd (5 findings), gitleaks (0 findings), osv-scanner (0 findings), madge (0 findings), repowise-dead-code (0 findings), repowise-health (3 findings). Skipped (not measured): sonar — set SONAR_HOST_URL, SONAR_TOKEN, SONAR_PROJECT_KEY (or sonar-project.properties); semgrep — failed (exit 2; message withheld — tool output can echo repo contents); lcov — no coverage/lcov.info in the repo (Pothole never runs the target's tests, so it cannot produce one): coverage is not measured. Coverage notes: none.

## PH-002 a `@ts-` directive suppresses a compiler error instead of fixing it (2× in file)

```yaml
id: PH-002
category: code
title: a `@ts-` directive suppresses a compiler error instead of fixing it (2×
  in file)
severity: major
traffic: 0.18054132960367325
confidence: tool-reported
evidence:
  - src/lib/heroMap.ts:5
  - src/lib/heroMap.ts:8
source:
  - eslint-sonar
repair_cost: S
fingerprint: code:src/lib/heroMap.ts:@typescript-eslint/ban-ts-comment
```

## PH-003 explicit `any` erases the type of this value (4× in file)

```yaml
id: PH-003
category: code
title: explicit `any` erases the type of this value (4× in file)
severity: major
traffic: 0.18054132960367325
confidence: tool-reported
evidence:
  - src/lib/heroMap.ts:17
  - src/lib/heroMap.ts:17
  - src/lib/heroMap.ts:17
  - src/lib/heroMap.ts:20
source:
  - eslint-sonar
repair_cost: S
fingerprint: code:src/lib/heroMap.ts:@typescript-eslint/no-explicit-any
```

## PH-006 Remove the declaration of the unused '_' variable. (2× in file)

```yaml
id: PH-006
category: code
title: Remove the declaration of the unused '_' variable. (2× in file)
severity: minor
traffic: 0.2256770426644908
confidence: tool-reported
evidence:
  - tests/api/contact.test.ts:122
  - tests/api/contact.test.ts:212
source:
  - eslint-sonar
repair_cost: S
fingerprint: code:tests/api/contact.test.ts:sonarjs/no-unused-vars
```

## PH-008 non-null assertion asserts what the compiler cannot see

```yaml
id: PH-008
category: code
title: non-null assertion asserts what the compiler cannot see
severity: minor
traffic: 0.1672786401254049
confidence: tool-reported
evidence:
  - tests/build.test.ts:27
source:
  - eslint-sonar
repair_cost: S
fingerprint: code:tests/build.test.ts:@typescript-eslint/no-non-null-assertion
```

## PH-009 Use concise character class syntax '\D' instead of '[^0-9]'. (3× in file)

```yaml
id: PH-009
category: code
title: Use concise character class syntax '\D' instead of '[^0-9]'. (3× in file)
severity: minor
traffic: 0.18793479157051432
confidence: tool-reported
evidence:
  - tests/config.test.ts:43
  - tests/config.test.ts:48
  - tests/config.test.ts:53
source:
  - eslint-sonar
repair_cost: S
fingerprint: code:tests/config.test.ts:sonarjs/concise-regex
```

## PH-010 non-null assertion asserts what the compiler cannot see

```yaml
id: PH-010
category: code
title: non-null assertion asserts what the compiler cannot see
severity: minor
traffic: 0.286226664132174
confidence: tool-reported
evidence:
  - tests/seo.test.ts:80
source:
  - eslint-sonar
repair_cost: S
fingerprint: code:tests/seo.test.ts:@typescript-eslint/no-non-null-assertion
```

## PH-011 Identical block (8 lines) copied between src/pages/privacy.astro and src/pages/terms.astro

```yaml
id: PH-011
category: code
title: Identical block (8 lines) copied between src/pages/privacy.astro and
  src/pages/terms.astro
severity: minor
traffic: 0.24060595591476192
confidence: tool-reported
evidence:
  - src/pages/privacy.astro:81
  - src/pages/terms.astro:87
source:
  - jscpd
repair_cost: S
kind: duplication
repair: Extract the duplicated block into one shared function and import it from
  both files.
fingerprint: code:src/pages/privacy.astro:dup-src/pages/terms.astro-8
```

## PH-012 Identical block (11 lines) copied between tests/accessibility.test.ts and tests/legal-pages.test.ts

```yaml
id: PH-012
category: code
title: Identical block (11 lines) copied between tests/accessibility.test.ts and
  tests/legal-pages.test.ts
severity: minor
traffic: 0.24060595591476192
confidence: tool-reported
evidence:
  - tests/accessibility.test.ts:6
  - tests/legal-pages.test.ts:9
source:
  - jscpd
repair_cost: S
kind: duplication
repair: Extract the duplicated block into one shared function and import it from
  both files.
fingerprint: code:tests/accessibility.test.ts:dup-tests/legal-pages.test.ts-11
```

## PH-013 Identical block (11 lines) copied between tests/accessibility.test.ts and tests/mobile.test.ts

```yaml
id: PH-013
category: code
title: Identical block (11 lines) copied between tests/accessibility.test.ts and
  tests/mobile.test.ts
severity: minor
traffic: 0.3881951216962581
confidence: tool-reported
evidence:
  - tests/accessibility.test.ts:6
  - tests/mobile.test.ts:6
source:
  - jscpd
repair_cost: S
kind: duplication
repair: Extract the duplicated block into one shared function and import it from
  both files.
fingerprint: code:tests/accessibility.test.ts:dup-tests/mobile.test.ts-11
```

## PH-014 Identical block (11 lines) copied between tests/accessibility.test.ts and tests/performance.test.ts

```yaml
id: PH-014
category: code
title: Identical block (11 lines) copied between tests/accessibility.test.ts and
  tests/performance.test.ts
severity: minor
traffic: 0.22539750839938152
confidence: tool-reported
evidence:
  - tests/accessibility.test.ts:6
  - tests/performance.test.ts:6
source:
  - jscpd
repair_cost: S
kind: duplication
repair: Extract the duplicated block into one shared function and import it from
  both files.
fingerprint: code:tests/accessibility.test.ts:dup-tests/performance.test.ts-11
```

## PH-015 Identical block (11 lines) copied between tests/accessibility.test.ts and tests/seo.test.ts

```yaml
id: PH-015
category: code
title: Identical block (11 lines) copied between tests/accessibility.test.ts and
  tests/seo.test.ts
severity: minor
traffic: 0.286226664132174
confidence: tool-reported
evidence:
  - tests/accessibility.test.ts:6
  - tests/seo.test.ts:6
source:
  - jscpd
repair_cost: S
kind: duplication
repair: Extract the duplicated block into one shared function and import it from
  both files.
fingerprint: code:tests/accessibility.test.ts:dup-tests/seo.test.ts-11
```

## PH-016 Hard-to-maintain code: form.addEventListener callback has cyclomatic complexity 11 (src/components/ContactForm.astro)

```yaml
id: PH-016
category: code
title: "Hard-to-maintain code: form.addEventListener callback has cyclomatic
  complexity 11 (src/components/ContactForm.astro)"
severity: minor
traffic: 0.5828487524355577
confidence: tool-reported
evidence:
  - src/components/ContactForm.astro:1
source:
  - repowise
repair_cost: M
kind: terrible
repair: "Refactor: split the function and flatten the nesting until it reads top
  to bottom."
fingerprint: code:src/components/ContactForm.astro:rw-complex-method-form.addEventListener
  callback
```

## PH-017 Hard-to-maintain code: form.addEventListener callback has been modified across 5 commits (repo p80=2) and carries CCN=11 / nesting=2 (src/components/ContactForm.astro)

```yaml
id: PH-017
category: code
title: "Hard-to-maintain code: form.addEventListener callback has been modified
  across 5 commits (repo p80=2) and carries CCN=11 / nesting=2
  (src/components/ContactForm.astro)"
severity: minor
traffic: 0.5828487524355577
confidence: tool-reported
evidence:
  - src/components/ContactForm.astro:1
source:
  - repowise
repair_cost: M
kind: terrible
repair: "Refactor: split the function and flatten the nesting until it reads top
  to bottom."
fingerprint: code:src/components/ContactForm.astro:rw-function-hotspot-form.addEventListener
  callback
```

## PH-018 Hard-to-maintain code: POST has been modified across 5 commits (repo p80=2) and carries CCN=25 / nesting=1 (src/pages/api/contact.ts)

```yaml
id: PH-018
category: code
title: "Hard-to-maintain code: POST has been modified across 5 commits (repo
  p80=2) and carries CCN=25 / nesting=1 (src/pages/api/contact.ts)"
severity: major
traffic: 0.3449385873656819
confidence: tool-reported
evidence:
  - src/pages/api/contact.ts:1
source:
  - repowise
repair_cost: M
kind: terrible
repair: "Refactor: split the function and flatten the nesting until it reads top
  to bottom."
fingerprint: code:src/pages/api/contact.ts:rw-function-hotspot-POST
```
