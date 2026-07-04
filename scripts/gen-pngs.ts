/**
 * gen-pngs.ts — regenerate the full PNG export set from src/logo/neary-logo.svg.
 *
 * Outputs land in dist/neary-{size}.png. The CI deploy step ships dist/
 * to branding.n3ary.com so consumers (the app PWA, the gtfs repo, GitHub
 * avatars, social cards) can reference stable URLs.
 *
 * Run locally:  pnpm build
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { PATHS, PNG_SIZES, PRIMARY_LOGO } from './paths.ts';

const BACKGROUND = { r: 0x4f, g: 0x46, b: 0xe5, alpha: 1 } as const;

async function main() {
  await mkdir(PATHS.distDir, { recursive: true });
  const svg = await readFile(PRIMARY_LOGO);

  await Promise.all(
    PNG_SIZES.map(async (size) => {
      const out = path.join(PATHS.distDir, `neary-${size}.png`);
      await sharp(svg, { density: 384 })
        .resize(size, size, { fit: 'contain', background: BACKGROUND })
        .png()
        .toFile(out);
      console.log(`wrote ${path.relative(PATHS.distDir, out)} (${size}×${size})`);
    }),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
