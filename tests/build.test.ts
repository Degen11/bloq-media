/**
 * Build output validation.
 * Verifies the Vercel deployment artifact is configured correctly.
 * Requires `npm run build` to have been executed first — tests are skipped otherwise.
 *
 * The nodejs18.x issue was the original bug that started this session.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const root = resolve(__dirname, '..');
const vcConfig = resolve(root, '.vercel/output/functions/_render.func/.vc-config.json');
const hasBuild = existsSync(vcConfig);

describe.skipIf(!hasBuild)('Vercel build output', () => {
  const config = JSON.parse(readFileSync(vcConfig, 'utf8'));

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
    const files = existsSync(clientDir)
      ? require('fs').readdirSync(clientDir)
      : [];
    const hasContactScript = files.some((f: string) =>
      f.includes('ContactForm')
    );
    expect(hasContactScript).toBe(true);
  });
});
