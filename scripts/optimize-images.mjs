// Generates responsive WebP variants of public/images/*.{png,jpg} into public/images/optimized/.
// A static host has no image server, so this replaces Next.js image optimization
// (src/lib/image-loader.ts picks the variant). Runs before `next build` (prebuild).
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

// Keep in sync with IMAGE_WIDTHS in src/lib/image-loader.ts.
const WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920];
const QUALITY = 78;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'public', 'images');
const target = join(source, 'optimized');
mkdirSync(target, { recursive: true });

const files = readdirSync(source).filter((name) =>
  ['.png', '.jpg', '.jpeg'].includes(extname(name)),
);
let written = 0;

for (const name of files) {
  const base = name.slice(0, name.length - extname(name).length);
  const input = join(source, name);
  for (const width of WIDTHS) {
    const output = join(target, `${base}-${width}.webp`);
    // Skip variants that are newer than their source (fast repeated builds).
    try {
      if (statSync(output).mtimeMs > statSync(input).mtimeMs) continue;
    } catch {
      // not generated yet
    }
    await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(output);
    written += 1;
  }
}
console.log(`Image variants: ${files.length} source file(s), ${written} written.`);
