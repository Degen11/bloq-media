# Findings: dependency

Detector: detect-dependency. Coverage: package.json, package-lock.json, .prettierrc.json, eslint/vitest/astro configs read; every runtime and dev dependency traced to an import or config use (all are used). osv-scanner ran with 0 findings, so there is no advisory reachability to judge. The path-to-regexp 6.3.0 override is not filed: commit a64615c records why (GHSA-9wv6-86v2-598j via @vercel/routing-utils, which still pins 6.1.0 at its latest release), so it is a recorded decision, though the reason lives only in git history. Unused-dependency and abandonment coverage is AI-only (knip, npm-check-updates and libyear are not run in this phase). Partial: the npm registry was reachable (topojson-client and world-atlas last published in 2022, which is quiet, not abandoned), but GitHub repo pages and API returned 403, so archived status could not be checked. No credentials seen in the manifests. [coverage=partial]

## PH-419 Hero map pulls in the whole d3 umbrella for two d3-geo functions, with types suppressed by @ts-ignore

```yaml
id: PH-419
category: dependency
title: Hero map pulls in the whole d3 umbrella for two d3-geo functions, with
  types suppressed by @ts-ignore
severity: minor
traffic: 1
confidence: ai-suspected
evidence:
  - package.json:26
  - src/lib/heroMap.ts:5
  - src/lib/heroMap.ts:6
source:
  - detect-dependency
repair_cost: S
fingerprint: dependency:src/lib/heroMap.ts:d3-umbrella-for-geo-only
partial: true
```

The only d3 import in the repo is geoMercator and geoPath in src/lib/heroMap.ts, which runs at build time only. Even so, d3 is listed as a production dependency, so about 30 d3-* subpackages get installed for what d3-geo provides alone. The umbrella package ships no type declarations, and the repo has no @types/d3, so the import is covered by a @ts-ignore whose comment blames a missing exports types condition. That leaves the projection code untyped under the strict tsconfig. Depending on d3-geo plus @types/d3-geo directly would let the @ts-ignore go and shrink the dependency graph. The same file uses @types/topojson-client (package.json:23), which sits in dependencies rather than devDependencies.
