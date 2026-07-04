/**
 * gen-social.ts — regenerate dist/social-preview.png (1280×640) from
 * src/social/social-preview.svg. The 1280×640 size is GitHub's preferred
 * social-preview aspect for repo cards and OpenGraph previews.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { PATHS, SOCIAL_PREVIEW, SOCIAL_PREVIEW_SVG } from './paths.ts';

async function main() {
  await mkdir(PATHS.distDir, { recursive: true });
  const svg = await readFile(SOCIAL_PREVIEW_SVG);
  const out = path.join(PATHS.distDir, 'social', 'social-preview.png');
  await sharp(svg, { density: 192 })
    .resize(SOCIAL_PREVIEW.width, SOCIAL_PREVIEW.height, { fit: 'contain' })
    .png()
    .toFile(out);
  console.log(`wrote ${path.relative(PATHS.distDir, out)} (${SOCIAL_PREVIEW.width}×${SOCIAL_PREVIEW.height})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
