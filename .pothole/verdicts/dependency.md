# Verdicts: dependency

Inspector: inspect-dependency. Coverage: every finding judged (1/1). All evidence files present and read; the d3 types claim was checked against installed node_modules.

## PH-419 confirmed

```yaml
id: PH-419
verdict: confirmed
reason: "All three refs resolve: package.json:26 is d3 ^7.9.0 in dependencies,
  heroMap.ts:5-6 is the @ts-ignore over the only d3 import in src (geoMercator,
  geoPath). node_modules/d3/package.json has no types field and
  node_modules/@types has no d3, so the import is really untyped under astro
  strict; 30 d3-* packages installed. No study-case trap matches (not an
  advisory, abandonment, duplicate pair or pin), the ts-ignore comment misstates
  the cause rather than documenting the choice, and build-time-only use does not
  refute an install-graph/typing claim. Severity minor stands."
fingerprint: dependency:src/lib/heroMap.ts:d3-umbrella-for-geo-only
```
