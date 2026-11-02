# Verdicts: security

Inspector: inspect-security. Coverage: every finding judged (1/1). All four evidence refs resolved and were read; vercel.json, README, docs/ and ContactForm.astro checked for an upstream limiter or recorded acceptance.

## PH-319 confirmed

```yaml
id: PH-319
verdict: confirmed
reason: "Survived all routes. evidence: contact.ts:5-6 module-level Map (comment
  itself scopes it to a warm instance), :40 keys on x-forwarded-for, :87 is the
  only server-side throttle; CLAUDE.md:125 states a plain 1 req/min per IP.
  trap: Case 1 not-this n/a - no middleware file and vercel.json holds only
  headers, no firewall/rate-limit rule; no shared store (KV/Upstash) anywhere in
  src. documented: the code comment admits the scope but no ADR/README accepts
  it as a limitation (survey open question 4 is unanswered), and documentation
  would not refute the cost claim anyway. unreachable: POST /api/contact is the
  one live server route. Category correct (abuse control). Minor stands:
  spam/quota exhaustion of a contact form, honeypot only stops naive bots."
fingerprint: security:src/pages/api/contact.ts:contact-rate-limit-per-instance
```
