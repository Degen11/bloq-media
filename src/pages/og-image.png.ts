import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { createHash } from 'node:crypto';

// Render once at build time and serve the PNG as a static file. As a runtime
// route it crashed on Vercel: satori's harfbuzz WASM file isn't traced into the
// serverless bundle, so every request returned a 500 and shares had no image.
export const prerender = true;

// Module-scope cache so the fonts are only fetched once per build
let fontCache: { fontBlack: ArrayBuffer; fontBold: ArrayBuffer } | null = null;

// SHA-256 of each pinned font file, so a tampered CDN response fails the build
const FONT_SHA256: Record<number, string> = {
  700: '51df444d3a9a5b5368402f46d7ec6145d78a8e55d184c12bf431c72a3c982da6',
  900: 'c38e95e0fea0113aeb45d3002cfe9b6b75f42695c79bced6157d09e122837564',
};

async function loadFont(weight: number): Promise<ArrayBuffer> {
  const url = `https://cdn.jsdelivr.net/npm/@fontsource/inter@4.5.15/files/inter-latin-${weight}-normal.woff`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load Inter ${weight} font: ${res.status}`);
  const font = await res.arrayBuffer();
  const hash = createHash('sha256').update(Buffer.from(font)).digest('hex');
  if (hash !== FONT_SHA256[weight]) throw new Error(`Inter ${weight} font failed its integrity check`);
  return font;
}

async function getFonts() {
  if (!fontCache) {
    const [fontBlack, fontBold] = await Promise.all([loadFont(900), loadFont(700)]);
    fontCache = { fontBlack, fontBold };
  }
  return fontCache;
}

export const GET: APIRoute = async () => {
  const { fontBlack, fontBold } = await getFonts();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#1A3C8F',
          padding: '72px 80px',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: 24 },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      color: '#29ABE2',
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    },
                    children: 'News & Media · Southeast Asia',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: 'white',
                      fontSize: 62,
                      fontWeight: 900,
                      lineHeight: 1.1,
                      maxWidth: 900,
                    },
                    children: 'Shaping Tech Narratives in Southeast Asia',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: 24,
                      fontWeight: 700,
                      marginTop: 8,
                    },
                    children:
                      'Authoritative reporting · Strategic content · Digital marketing',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      color: 'rgba(255,255,255,0.45)',
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    },
                    children: 'bloq.media',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#29ABE2',
                      color: 'white',
                      padding: '14px 30px',
                      borderRadius: 12,
                      fontSize: 20,
                      fontWeight: 900,
                    },
                    children: 'Get in Touch',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fontBlack, weight: 900 as const, style: 'normal' as const },
        { name: 'Inter', data: fontBold, weight: 700 as const, style: 'normal' as const },
      ],
    }
  );

  const png = new Resvg(svg).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
