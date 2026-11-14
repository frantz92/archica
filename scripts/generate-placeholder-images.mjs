// Generates TEMPORARY placeholder PNGs for public/images/ (BLUEPRINT §0 / CLAUDE.md).
// Pure Node (zlib only): no project dependencies. Run: node scripts/generate-placeholder-images.mjs
// Replace the output with real photos using the same file names (see README, Stage 5).
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');

// Slot sizes follow BLUEPRINT §7: 4:5 slots 1600x2000, 4:3 slots 2400x1800.
const portrait = { width: 1600, height: 2000, ratio: '4:5' };
const landscape = { width: 2400, height: 1800, ratio: '4:3' };

const images = [
  { name: 'hero-building', ...portrait },
  { name: 'about-studio', ...portrait },
  { name: 'portfolio-residence', ...landscape },
  { name: 'portfolio-office', ...portrait },
  { name: 'portfolio-interior', ...portrait },
  { name: 'portfolio-pavilion', ...landscape },
];

// 5x7 bitmap font, rows top to bottom, '#' = pixel.
const FONT = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  1: ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  2: ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  3: ['.###.', '#...#', '....#', '..##.', '....#', '#...#', '.###.'],
  4: ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  5: ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  6: ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  7: ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  8: ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  9: ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  ':': ['.....', '..#..', '..#..', '.....', '..#..', '..#..', '.....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  '/': ['....#', '....#', '...#.', '..#..', '.#...', '#....', '#....'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};

// Neutral grey values (8-bit grayscale PNG keeps the files small).
const BACKGROUND = 168;
const LINES = 148;
const TEXT = 52;

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function encodePng(width, height, pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 0; // colour type: grayscale
  const stride = width + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * stride] = 0; // filter: none
    pixels.copy(raw, y * stride + 1, y * width, (y + 1) * width);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function drawLine(pixels, width, height, x0, y0, x1, y1, thickness, value) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= steps; i += 1) {
    const cx = Math.round(x0 + ((x1 - x0) * i) / steps);
    const cy = Math.round(y0 + ((y1 - y0) * i) / steps);
    for (let dy = 0; dy < thickness; dy += 1) {
      for (let dx = 0; dx < thickness; dx += 1) {
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < width && y >= 0 && y < height) pixels[y * width + x] = value;
      }
    }
  }
}

function textWidth(text, scale) {
  return text.length * 6 * scale - scale;
}

function drawText(pixels, width, text, centerX, top, scale) {
  let x = Math.round(centerX - textWidth(text, scale) / 2);
  for (const char of text) {
    const glyph = FONT[char];
    if (!glyph) throw new Error(`Missing glyph: ${char}`);
    glyph.forEach((row, ry) => {
      [...row].forEach((cell, rx) => {
        if (cell !== '#') return;
        for (let sy = 0; sy < scale; sy += 1) {
          for (let sx = 0; sx < scale; sx += 1) {
            pixels[(top + ry * scale + sy) * width + x + rx * scale + sx] = TEXT;
          }
        }
      });
    });
    x += 6 * scale;
  }
}

mkdirSync(outDir, { recursive: true });

for (const { name, width, height, ratio } of images) {
  const pixels = Buffer.alloc(width * height, BACKGROUND);
  const stroke = Math.max(3, Math.round(width / 500));
  drawLine(pixels, width, height, 0, 0, width - 1, height - 1, stroke, LINES);
  drawLine(pixels, width, height, width - 1, 0, 0, height - 1, stroke, LINES);

  const scale = Math.round(width / 180);
  const lines = ['PLACEHOLDER', name.toUpperCase(), `${ratio}  ${width}X${height}`];
  const lineHeight = 7 * scale;
  const gap = 3 * scale;
  const blockHeight = lines.length * lineHeight + (lines.length - 1) * gap;
  const blockWidth = Math.max(...lines.map((line) => textWidth(line, scale))) + 8 * scale;
  const blockTop = Math.round((height - blockHeight) / 2);
  const blockLeft = Math.round((width - blockWidth) / 2);
  // Solid plate under the text so the diagonals do not cut through it.
  for (let y = blockTop - 4 * scale; y < blockTop + blockHeight + 4 * scale; y += 1) {
    pixels.fill(BACKGROUND, y * width + blockLeft, y * width + blockLeft + blockWidth);
  }
  lines.forEach((line, index) => {
    drawText(pixels, width, line, width / 2, blockTop + index * (lineHeight + gap), scale);
  });

  const file = join(outDir, `${name}.png`);
  writeFileSync(file, encodePng(width, height, pixels));
  console.log(`${name}.png  ${width}x${height}  (${ratio})`);
}
