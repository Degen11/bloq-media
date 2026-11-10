/**
 * Build output validation.
 * Verifies the Vercel deployment artifact is configured correctly.
 * Requires `npm run build` to have been executed first. Locally the suites skip
 * without a build; in CI (where `CI` is set) a missing build is a failure, so the
 * guard can't silently turn into a no-op.
 *
 * The nodejs18.x issue was the original bug that started this session.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';
import { CONTACT_SECTION_ID, sections } from '../src/lib/site';

const root = resolve(__dirname, '..');
const vcConfig = resolve(root, '.vercel/output/functions/_render.func/.vc-config.json');
const hasBuild = existsSync(vcConfig);

describe.runIf(process.env.CI)('build output in CI', () => {
  it('exists, so the suites below actually run', () => {
    expect(hasBuild, 'run `npm run build` before `npm test` in CI').toBe(true);
  });
});

describe.skipIf(!hasBuild)('Vercel build output', () => {
  // Lazy read so the describe callback doesn't throw when hasBuild is false.
  const config = hasBuild ? JSON.parse(readFileSync(vcConfig, 'utf8')) : {};

  it('runtime is NOT nodejs18.x (the original bug)', () => {
    expect(config.runtime).not.toBe('nodejs18.x');
  });

  it('runtime is nodejs20.x or higher', () => {
    const match = config.runtime?.match(/nodejs(\d+)/);
    expect(match).not.toBeNull();
    expect(parseInt(match![1], 10)).toBeGreaterThanOrEqual(20);
  });

  it('has a handler defined', () => {
    expect(config.handler).toBeDefined();
  });

  it('supports response streaming', () => {
    expect(config.supportsResponseStreaming).toBe(true);
  });
});

describe.skipIf(!hasBuild)('client bundle', () => {
  const clientDir = resolve(root, 'dist/client/_astro');

  it('client _astro directory exists', () => {
    expect(existsSync(clientDir)).toBe(true);
  });

  it('contact form script is bundled as external file (has npm import)', () => {
    const files = existsSync(clientDir) ? readdirSync(clientDir) : [];
    const hasContactScript = files.some((f: string) => f.includes('ContactForm'));
    expect(hasContactScript).toBe(true);
  });
});

describe.skipIf(!hasBuild)('homepage section anchors', () => {
  const html = hasBuild ? readFileSync(resolve(root, 'dist/client/index.html'), 'utf8') : '';
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

  it.each([...sections.map((s) => s.id), CONTACT_SECTION_ID])(
    'section id "%s" from site.ts exists on /',
    (id) => {
      expect(ids.has(id)).toBe(true);
    },
  );

  it('every in-page #anchor link points at an element on /', () => {
    const targets = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets) expect(ids, `#${target}`).toContain(target);
  });
});

describe.skipIf(!hasBuild)('rendered buttons', () => {
  const html = hasBuild ? readFileSync(resolve(root, 'dist/client/index.html'), 'utf8') : '';
  const buttons = html.match(/<button\b[^>]*>/g) ?? [];

  it('no button renders a duplicate type attribute (the first one wins in browsers)', () => {
    expect(buttons.length).toBeGreaterThan(0);
    for (const tag of buttons) expect(tag.match(/\stype="/g)?.length ?? 0).toBeLessThanOrEqual(1);
  });

  it('the contact form button is a submit button', () => {
    const submit = buttons.find((tag) => tag.includes('id="submit-btn"'));
    expect(submit).toMatch(/\stype="submit"/);
  });
});
