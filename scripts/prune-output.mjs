// Removes the multi-megabyte original photos from out/ after the build. The pages only reference
// the WebP variants (images/optimized/), so the originals would only slow down the upload.
// The JavaScript still contains the original file names (static imports), but production never
// requests them: src/lib/image-loader.ts maps every one of them to a WebP variant.
import { readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const LIMIT = 300 * 1024;

function* walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

const files = [...walk(out)];
const candidates = files.filter(
  (file) =>
    ['.png', '.jpg', '.jpeg'].includes(extname(file)) &&
    !file.includes(`${join('images', 'optimized')}`) &&
    statSync(file).size > LIMIT,
);
for (const file of files.filter((file) => file.endsWith('.DS_Store'))) rmSync(file);

let removed = 0;
for (const file of candidates) {
  rmSync(file);
  removed += 1;
}
console.log(`Pruned ${removed} original image(s) from out/.`);
