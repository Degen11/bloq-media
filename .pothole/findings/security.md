# Findings: security

Detector: detect-security. Coverage: traced the single mutating entry point (POST /api/contact); every other route is prerendered and read-only, and there is no auth/role surface to check. No middleware file; Astro checkOrigin default left on; JSON body needs a CORS preflight the route does not grant. gitleaks ran (0 findings) and only .env.example appears in env-file history, so secret coverage is tool-backed. semgrep FAILED (exit 2), so known-insecure-pattern coverage is eslint-sonar only. No database, schema or migrations exist, so Cases 3 and 4 do not apply. Judged and not filed: PUBLIC_WEB3FORMS_KEY is used only server-side and Web3Forms keys are designed to be form-public; CSP script-src unsafe-inline is a defence-in-depth nit with no user-generated HTML rendered; x-forwarded-for spoofing is not exploitable on Vercel, which overwrites the header. Did not restate PH-001/004/005/007 (test-file hotspots, unreachable in production; slow-regex on EMAIL_RE runs only after a 254-char length cap). Left to other detectors: Dependabot auto-merge job in ci.yml (build/dependency); api error-shape consistency (api). [coverage=partial]

## PH-319 contact form abuse control is a per-instance in-memory map, so the documented 1 req/min per-IP limit does not hold on Vercel

```yaml
id: PH-319
category: security
title: contact form abuse control is a per-instance in-memory map, so the
  documented 1 req/min per-IP limit does not hold on Vercel
severity: minor
traffic: 0.7614597503424346
confidence: ai-suspected
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
```

The rate limit is the only server-side abuse control on the one unauthenticated mutating route, and it lives in a module-level Map. On Vercel serverless every concurrent instance and every cold start has its own empty map, so a single client sending parallel requests gets one submission per instance per minute, and any client rotating IPs is unlimited. CLAUDE.md documents the guarantee as a plain 1 req/min per IP; only the code comment admits it holds within a warm instance. Consequence: an attacker can flood the team inbox (each submission also CCs TEAM_EMAIL) and exhaust the Web3Forms key quota, which silently turns the site's only lead channel into a 500 for real visitors. The tests in tests/api/contact.test.ts exercise a single process and cannot see this. Fix is a shared store (Vercel KV/Upstash) or Vercel Firewall rate-limit rule plus doc correction. Minor rather than major: the exposure is spam and availability of a contact form, not data or privilege.
