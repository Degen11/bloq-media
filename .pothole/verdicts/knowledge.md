# Verdicts: knowledge

Inspector: inspect-knowledge. Coverage: every finding judged; all evidence refs resolved and were opened; AI-only category, no tool corroboration available.

## PH-719 confirmed

```yaml
id: PH-719
verdict: confirmed
reason: "Checked all four routes, none kills it. evidence: CLAUDE.md:39 and
  README.md:22 both say Astro v6, package.json:25 pins astro ^7.4.4, and commit
  499815f is titled 'upgrade astro 6->7'. trap: not a superseded doc that says
  so. documented: nothing records v6 as still intended. reachable: CLAUDE.md is
  the declared architecture doc and a top hotspot."
fingerprint: knowledge:CLAUDE.md:stale-astro-major-version
```

## PH-720 confirmed

```yaml
id: PH-720
verdict: confirmed
reason: "evidence: README.md:26 says the site self-hosts Inter, but
  astro.config.mjs:18 self-hosts Plus Jakarta Sans (Inter appears only in
  og-image.png.ts). README.md:11 promises an interactive map that includes
  Jakarta, but the heroMap.ts:36 CITIES list has no Jakarta, and CLAUDE.md:137
  says the map is build-time with no JS and explains why Jakarta is missing.
  README.md:24 also contradicts line 11. Not signage: no setup step fails. This
  is drift in the record of a decision."
fingerprint: knowledge:README.md:stale-readme-feature-stack
```

## PH-721 confirmed

```yaml
id: PH-721
verdict: confirmed
reason: "evidence: .env.example:3 claims the CC is set by a hidden form field,
  but ContactForm.astro has no such field (only the honeypot), and
  contact.ts:100 sets cc: TEAM_EMAIL from site.ts:11. History confirms the
  drift: git log -S finds the hidden cc field in 31c2fb7/d2d9fc3/7a04d24 and
  removes it in ec09bf9, and .env.example was not touched after that. The stale
  part is what the config means, not a missing name, so it is knowledge, not
  build."
fingerprint: knowledge:.env.example:stale-cc-mechanism-comment
```
