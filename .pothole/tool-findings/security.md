# Tool findings: security

Tools run: eslint-sonar (10 findings), jscpd (5 findings), gitleaks (0 findings), osv-scanner (0 findings), madge (0 findings), repowise-dead-code (0 findings), repowise-health (3 findings). Skipped (not measured): sonar — set SONAR_HOST_URL, SONAR_TOKEN, SONAR_PROJECT_KEY (or sonar-project.properties); semgrep — failed (exit 2; message withheld — tool output can echo repo contents); lcov — no coverage/lcov.info in the repo (Pothole never runs the target's tests, so it cannot produce one): coverage is not measured. Coverage notes: none.

## PH-001 Using slow regular expressions is security-sensitive

```yaml
id: PH-001
category: security
title: Using slow regular expressions is security-sensitive
severity: minor
traffic: 0.12166459627194479
confidence: tool-reported
evidence:
  - src/lib/contact.ts:7
source:
  - eslint-sonar
repair_cost: M
fingerprint: security:src/lib/contact.ts:sonarjs/slow-regex
```

## PH-004 Using pseudorandom number generators (PRNGs) is security-sensitive (8× in file)

```yaml
id: PH-004
category: security
title: Using pseudorandom number generators (PRNGs) is security-sensitive (8× in file)
severity: minor
traffic: 0.2256770426644908
confidence: tool-reported
evidence:
  - tests/api/contact.test.ts:11
  - tests/api/contact.test.ts:73
  - tests/api/contact.test.ts:82
  - tests/api/contact.test.ts:91
  - tests/api/contact.test.ts:99
  - tests/api/contact.test.ts:108
  - tests/api/contact.test.ts:109
  - tests/api/contact.test.ts:154
source:
  - eslint-sonar
repair_cost: M
fingerprint: security:tests/api/contact.test.ts:sonarjs/pseudo-random
```

## PH-005 Using clear-text protocols is security-sensitive

```yaml
id: PH-005
category: security
title: Using clear-text protocols is security-sensitive
severity: minor
traffic: 0.2256770426644908
confidence: tool-reported
evidence:
  - tests/api/contact.test.ts:50
source:
  - eslint-sonar
repair_cost: M
fingerprint: security:tests/api/contact.test.ts:sonarjs/no-clear-text-protocols
```

## PH-007 Using hardcoded IP addresses is security-sensitive

```yaml
id: PH-007
category: security
title: Using hardcoded IP addresses is security-sensitive
severity: minor
traffic: 0.2256770426644908
confidence: tool-reported
evidence:
  - tests/api/contact.test.ts:140
source:
  - eslint-sonar
repair_cost: M
fingerprint: security:tests/api/contact.test.ts:sonarjs/no-hardcoded-ip
```
