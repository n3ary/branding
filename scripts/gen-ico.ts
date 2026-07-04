/**
 * gen-ico.ts — build dist/favicon.ico from the 16 + 32 PNG exports.
 *
 * .ico is a tiny container: a 6-byte header, one 16-byte directory entry
 * per image, then the image bytes concatenated. Both sizes live in the
 * single .ico so the browser picks the right one for the tab/dock.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PATHS } from './paths.ts';

const SIZES = [16, 32] as const;

interface IcoChunk {
  size: number;
  data: Buffer;
}

async function main() {
  await mkdir(PATHS.distDir, { recursive: true });

  const chunks: IcoChunk[] = await Promise.all(
    SIZES.map(async (size) => ({
      size,
      data: await readFile(path.join(PATHS.distDir, `neary-${size}.png`)),
    })),
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = .ico
  header.writeUInt16LE(chunks.length, 4);

  const entrySize = 16;
  const entries = Buffer.alloc(entrySize * chunks.length);
  let imageOffset = 6 + entrySize * chunks.length;
  chunks.forEach((chunk, i) => {
    const base = i * entrySize;
    entries.writeUInt8(chunk.size === 256 ? 0 : chunk.size, base + 0); // width (0 means 256)
    entries.writeUInt8(chunk.size === 256 ? 0 : chunk.size, base + 1); // height
    entries.writeUInt8(0, base + 2); // color palette count
    entries.writeUInt8(0, base + 3); // reserved
    entries.writeUInt16LE(1, base + 4); // color planes
    entries.writeUInt16LE(32, base + 6); // bits per pixel
    entries.writeUInt32LE(chunk.data.length, base + 8); // image bytes
    entries.writeUInt32LE(imageOffset, base + 12); // offset from start of file
    imageOffset += chunk.data.length;
  });

  const out = Buffer.concat([header, entries, ...chunks.map((c) => c.data)]);
  await writeFile(path.join(PATHS.distDir, 'favicon.ico'), out);
  console.log(`wrote favicon.ico (${out.length} bytes, ${SIZES.length} sizes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
