/**
 * copy-sources.ts — copy hand-edited SVGs to dist/ so the deploy ships
 * them alongside the generated PNGs.
 *
 * The PNGs/ICO are derived from these SVGs by `gen-pngs.ts` / `gen-ico.ts`,
 * but the SVGs themselves are the source of truth and consumers (e.g.
 * the app PWA) may want to embed them directly. Shipping them via
 * branding.n3ary.com/logo/*.svg gives consumers a stable URL without
 * having to pull from raw.githubusercontent.com.
 *
 * Run via `pnpm build` (or `pnpm build:copy-sources`).
 */
import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { PATHS } from './paths.ts';

const COPY_PAIRS: ReadonlyArray<{ from: string; toDir: string }> = [
  { from: PATHS.srcLogoDir, toDir: path.join(PATHS.distDir, 'logo') },
  { from: PATHS.srcSocialDir, toDir: path.join(PATHS.distDir, 'social') },
];

async function main() {
  for (const { from, toDir } of COPY_PAIRS) {
    const entries = await readdir(from);
    const svgs = entries.filter((e) => e.endsWith('.svg'));
    await mkdir(toDir, { recursive: true });
    await Promise.all(
      svgs.map(async (name) => {
        await copyFile(path.join(from, name), path.join(toDir, name));
        console.log(`wrote ${path.relative(PATHS.distDir, path.join(toDir, name))}`);
      }),
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
