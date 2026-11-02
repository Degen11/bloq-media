# Verdicts: build

Inspector: inspect-build. Coverage: every finding judged. All evidence refs opened; build coverage AI-only (no tool reads build inputs).

## PH-819 confirmed

```yaml
id: PH-819
verdict: confirmed
reason: "Survived evidence/trap/documented/unreachable: ci.yml:19 is the only
  Node pin ('22'); package.json has no engines field (line 5 cites the file, the
  absence is the argument); no .nvmrc/.node-version at root; README/CLAUDE.md
  state no Node version; package-lock.json:3700 is astro's engines node
  >=22.23.4. Vercel runtime comes from dashboard. Commit a536585 ('fix
  nodejs18.x runtime error') shows runtime drift has bitten before."
fingerprint: build:package.json:node-version-undeclared-outside-ci
```

## PH-820 confirmed

```yaml
id: PH-820
verdict: confirmed
reason: "Survived all routes: astro.config.mjs:15-17 uses
  fontProviders.fontsource() with no version;
  node_modules/unifont/dist/index.mjs fetches api.fontsource.org/v1 metadata and
  uses API-returned variant URLs (variable path hardcodes @latest), no integrity
  check. The config comment documents the build-time download but not pinning,
  so documented does not refute the reproducibility/offline-build cost. Not Case
  3 trap: no pinned in-repo declaration."
fingerprint: build:astro.config.mjs:fontsource-build-fetch-unpinned
```
