// Generates the brand pack of logo proposal 2 ("Organiczny łuk") into brand/propozycja-2/:
// svg/ (web, editors), pdf/ + eps/ (print, CMYK, outlines), dxf/ (cutting, mm), podglad.png.
// Also prints the path data used by src/components/ui/logo-paths-2.ts.
//
// The emblem is a vector reconstruction of the client's raster mock-up (brand/Image.jpg, 1024 px):
// the corner coordinates below were measured on that image to a fraction of a pixel (see the
// comments), and the fillets were fitted to the rounded corners. The wordmark is the same outline
// text as in proposal 1 (Inter Medium converted to curves), taken from its SVG.
//
// Run: node scripts/build-brand.mjs        (needs `sharp`, which ships with Next.js, for the PNG)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'brand', 'propozycja-2');

// ---------------------------------------------------------------------------------------------
// Palette (unchanged from proposal 1, brand/propozycja-1/README.txt)
// ---------------------------------------------------------------------------------------------
const COLORS = {
  mech: { hex: '#2C3E35', cmyk: [0.8, 0.45, 0.65, 0.55], label: 'mech' },
  kreda: { hex: '#F5F2EB', cmyk: [0.03, 0.03, 0.06, 0], label: 'kreda' },
  bursztyn: { hex: '#D9822B', cmyk: [0.15, 0.55, 0.95, 0], label: 'bursztyn' },
  czarny: { hex: '#000000', cmyk: [0, 0, 0, 1], label: 'czarny' },
};

// ---------------------------------------------------------------------------------------------
// Emblem geometry, measured on brand/Image.jpg (light emblem on the dark panel, x 749-799,
// y 132-180 px). Edges: left piece x = 748.9 / 763.3, right piece x = 785.17 / 799.33,
// top y = 132.5, bottom y = 179.3. The diagonals were fitted from sub-pixel edge crossings.
// ---------------------------------------------------------------------------------------------
const PX = { x0: 748.9, y0: 132.5, width: 799.33 - 748.9 };
const SCALE = 100 / PX.width; // the emblem is 100 units wide
const toUnits = ([x, y]) => [(x - PX.x0) * SCALE, (y - PX.y0) * SCALE];

// [corner in px, fillet radius in px]
const LEFT_PIECE = [
  [[748.9, 132.5], 0], // top-left point
  [[781.0, 152.3], 1.5], // tip of the diagonal (slightly rounded)
  [[763.3, 160.9], 4.0], // inner shoulder (rounded)
  [[763.3, 179.3], 0],
  [[748.9, 179.3], 0],
];
const RIGHT_PIECE = [
  [[799.33, 132.5], 0], // top-right point
  [[774.8, 144.0], 0.7], // tip of the notch (slightly rounded)
  [[785.17, 150.9], 3.5], // inner shoulder (rounded)
  [[785.17, 179.3], 0],
  [[799.33, 179.3], 0],
];

const unit = ([x, y]) => {
  const length = Math.hypot(x, y);
  return [x / length, y / length];
};

/**
 * Closed polygon with circular fillets (each arc as one cubic Bézier). The first corner must be
 * sharp: the path starts there and Z closes it.
 */
function roundedPolygon(corners) {
  const points = corners.map(([p]) => toUnits(p));
  const radii = corners.map(([, r]) => r * SCALE);
  if (radii[0] !== 0) throw new Error('the first corner must have no fillet');
  const n = points.length;
  const segs = [];
  for (let i = 1; i < n; i++) {
    const p = points[i];
    const r = radii[i];
    if (r === 0) {
      segs.push(['L', ...p]);
      continue;
    }
    const prev = points[i - 1];
    const next = points[(i + 1) % n];
    const v1 = unit([prev[0] - p[0], prev[1] - p[1]]);
    const v2 = unit([next[0] - p[0], next[1] - p[1]]);
    const theta = Math.acos(Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1])));
    const d = r / Math.tan(theta / 2);
    const t1 = [p[0] + v1[0] * d, p[1] + v1[1] * d];
    const t2 = [p[0] + v2[0] * d, p[1] + v2[1] * d];
    const k = (4 / 3) * Math.tan((Math.PI - theta) / 4) * r;
    segs.push(['L', ...t1]);
    segs.push([
      'C',
      t1[0] - v1[0] * k,
      t1[1] - v1[1] * k,
      t2[0] - v2[0] * k,
      t2[1] - v2[1] * k,
      ...t2,
    ]);
  }
  return { start: points[0], segs };
}

const EMBLEM_HEIGHT = (179.3 - 132.5) * SCALE; // ≈ 92.8
const emblem = () => [roundedPolygon(LEFT_PIECE), roundedPolygon(RIGHT_PIECE)];

// ---------------------------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------------------------
function parsePath(d) {
  const tokens = d.match(/[MLCZ]|-?\d*\.?\d+/g);
  const subpaths = [];
  let current = null;
  let i = 0;
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === 'M') {
      current = { start: [num(), num()], segs: [] };
      subpaths.push(current);
    } else if (command === 'L') {
      current.segs.push(['L', num(), num()]);
    } else if (command === 'C') {
      current.segs.push(['C', num(), num(), num(), num(), num(), num()]);
    } else if (command === 'Z') {
      // closed
    } else {
      // The wordmark repeats coordinates after a command letter (implicit repeats).
      i--;
      const last = current.segs.at(-1);
      current.segs.push(
        last[0] === 'C' ? ['C', num(), num(), num(), num(), num(), num()] : ['L', num(), num()],
      );
    }
  }
  return subpaths;
}

const transform = (subpaths, dx, dy) =>
  subpaths.map(({ start, segs }) => ({
    start: [start[0] + dx, start[1] + dy],
    segs: segs.map(([c, ...v]) => [
      c,
      ...v.map((value, index) => value + (index % 2 === 0 ? dx : dy)),
    ]),
  }));

const fmt = (value) => String(Number(value.toFixed(3)));
const toSvg = (subpaths) =>
  subpaths
    .map(
      ({ start, segs }) =>
        `M${fmt(start[0])} ${fmt(start[1])}${segs.map(([c, ...v]) => c + v.map(fmt).join(' ')).join('')}Z`,
    )
    .join('');

// ---------------------------------------------------------------------------------------------
// Layouts (design units: the emblem is 100 wide; 1 unit = 1 mm in PDF/EPS/DXF)
// ---------------------------------------------------------------------------------------------
const wordmarkSvg = readFileSync(
  join(root, 'brand', 'propozycja-1', 'svg', 'archica-logo-mech.svg'),
  'utf8',
);
const WORDMARK = parsePath(/id="napis" d="([^"]+)"/.exec(wordmarkSvg)[1]);
const LOGO_WIDTH = 230.3;
const LOGO_HEIGHT = 166.789 - (100 - EMBLEM_HEIGHT); // same gap emblem-wordmark as proposal 1
const BOX_OFFSET = (100 - EMBLEM_HEIGHT) / 2; // emblem centred in the 100 x 100 box used by the website

const layouts = {
  sygnet: {
    title: 'sygnet',
    width: 100,
    height: EMBLEM_HEIGHT,
    parts: [{ layer: 'SYGNET', paths: emblem() }],
  },
  logo: {
    title: 'logo',
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    parts: [
      { layer: 'SYGNET', paths: transform(emblem(), (LOGO_WIDTH - 100) / 2, 0) },
      { layer: 'NAPIS', paths: transform(WORDMARK, 0, -(100 - EMBLEM_HEIGHT)) },
    ],
  },
};

// ---------------------------------------------------------------------------------------------
// Writers
// ---------------------------------------------------------------------------------------------
const MM = 72 / 25.4;
const flip = (height) => (subpaths) =>
  subpaths.map(({ start, segs }) => ({
    start: [start[0], height - start[1]],
    segs: segs.map(([c, ...v]) => [
      c,
      ...v.map((value, index) => (index % 2 === 0 ? value : height - value)),
    ]),
  }));

function svgFile(layout, color) {
  const w = fmt(layout.width);
  const h = fmt(layout.height);
  const label = `Archica – ${layout.title}`;
  const paths = layout.parts
    .map((part) => `  <path id="${part.layer.toLowerCase()}" d="${toSvg(part.paths)}"/>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
  <title>${label}</title>
  <g fill="${color.hex}" fill-rule="nonzero">
${paths}
  </g>
</svg>
`;
}

const pdfPath = (subpaths, scale, height) =>
  flip(height)(subpaths)
    .map(({ start, segs }) => {
      const p = (v) => (v * scale).toFixed(3);
      const ops = segs.map(([c, ...v]) =>
        c === 'L'
          ? `${p(v[0])} ${p(v[1])} l`
          : `${p(v[0])} ${p(v[1])} ${p(v[2])} ${p(v[3])} ${p(v[4])} ${p(v[5])} c`,
      );
      return [`${p(start[0])} ${p(start[1])} m`, ...ops, 'h'].join('\n');
    })
    .join('\n');

function pdfFile(layout, color) {
  const w = layout.width * MM;
  const h = layout.height * MM;
  const content = `${color.cmyk.join(' ')} k\n${layout.parts.map((part) => pdfPath(part.paths, MM, layout.height)).join('\n')}\nf\n`;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w.toFixed(4)} ${h.toFixed(4)}] /Contents 4 0 R /Resources << >> >>`,
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}endstream`,
    `<< /Title (Archica - ${layout.title}) /Author (Archica) /Creator (Archica logo build) >>`,
  ];
  let body = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(body));
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = Buffer.byteLength(body);
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) body += `${String(offset).padStart(10, '0')} 00000 n \n`;
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return body;
}

function epsFile(layout, color) {
  const w = layout.width * MM;
  const h = layout.height * MM;
  const p = (v) => (v * MM).toFixed(3);
  const paths = layout.parts
    .flatMap((part) => flip(layout.height)(part.paths))
    .map(({ start, segs }) => {
      const ops = segs.map(([c, ...v]) =>
        c === 'L'
          ? `${p(v[0])} ${p(v[1])} lineto`
          : `${p(v[0])} ${p(v[1])} ${p(v[2])} ${p(v[3])} ${p(v[4])} ${p(v[5])} curveto`,
      );
      return [`${p(start[0])} ${p(start[1])} moveto`, ...ops, 'closepath'].join('\n');
    })
    .join('\n');
  return `%!PS-Adobe-3.0 EPSF-3.0
%%Creator: Archica logo build
%%Title: Archica - ${layout.title}
%%BoundingBox: 0 0 ${Math.ceil(w)} ${Math.ceil(h)}
%%HiResBoundingBox: 0.000 0.000 ${w.toFixed(3)} ${h.toFixed(3)}
%%LanguageLevel: 2
%%DocumentProcessColors: Cyan Magenta Yellow Black
%%EndComments

gsave
${color.cmyk.map((v) => v.toFixed(3)).join(' ')} setcmykcolor
newpath
${paths}
fill
grestore
showpage
%%EOF
`;
}

/** Flattens Bézier segments into short lines (about 0.02 mm accuracy at these sizes). */
function flatten(subpaths) {
  return subpaths.map(({ start, segs }) => {
    const points = [start];
    let [cx, cy] = start;
    for (const [c, ...v] of segs) {
      if (c === 'L') {
        points.push([v[0], v[1]]);
      } else {
        const steps = 24;
        for (let step = 1; step <= steps; step++) {
          const t = step / steps;
          const u = 1 - t;
          points.push([
            u ** 3 * cx + 3 * u * u * t * v[0] + 3 * u * t * t * v[2] + t ** 3 * v[4],
            u ** 3 * cy + 3 * u * u * t * v[1] + 3 * u * t * t * v[3] + t ** 3 * v[5],
          ]);
        }
      }
      [cx, cy] = [v.at(-2), v.at(-1)];
    }
    // The last point returns to the start: closing is done by the polyline flag.
    const [lx, ly] = points.at(-1);
    if (Math.hypot(lx - start[0], ly - start[1]) < 1e-6) points.pop();
    return points;
  });
}

function dxfFile(layout) {
  const lines = [];
  const add = (...items) => lines.push(...items.map(String));
  add(0, 'SECTION', 2, 'HEADER', 9, '$ACADVER', 1, 'AC1009', 0, 'ENDSEC');
  add(
    0,
    'SECTION',
    2,
    'TABLES',
    0,
    'TABLE',
    2,
    'LTYPE',
    70,
    1,
    0,
    'LTYPE',
    2,
    'CONTINUOUS',
    70,
    0,
    3,
    'Solid line',
    72,
    65,
    73,
    0,
    40,
    '0.0',
    0,
    'ENDTAB',
  );
  add(0, 'TABLE', 2, 'LAYER', 70, layout.parts.length);
  for (const part of layout.parts) add(0, 'LAYER', 2, part.layer, 70, 0, 62, 7, 6, 'CONTINUOUS');
  add(0, 'ENDTAB', 0, 'ENDSEC');
  add(0, 'SECTION', 2, 'ENTITIES');
  for (const part of layout.parts) {
    for (const points of flatten(flip(layout.height)(part.paths))) {
      add(0, 'POLYLINE', 8, part.layer, 66, 1, 70, 1, 10, '0.0', 20, '0.0', 30, '0.0');
      for (const [x, y] of points)
        add(0, 'VERTEX', 8, part.layer, 10, x.toFixed(4), 20, y.toFixed(4), 30, '0.0');
      add(0, 'SEQEND', 8, part.layer);
    }
  }
  add(0, 'ENDSEC', 0, 'EOF');
  return `${lines.join('\n')}\n`;
}

// ---------------------------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------------------------
for (const dir of ['svg', 'pdf', 'eps', 'dxf']) mkdirSync(join(out, dir), { recursive: true });

for (const [key, layout] of Object.entries(layouts)) {
  for (const [name, color] of Object.entries(COLORS)) {
    const base = `archica-${key}-${name}`;
    writeFileSync(join(out, 'svg', `${base}.svg`), svgFile(layout, color));
    writeFileSync(join(out, 'pdf', `${base}.pdf`), pdfFile(layout, color));
    writeFileSync(join(out, 'eps', `${base}.eps`), epsFile(layout, color));
  }
  writeFileSync(join(out, 'dxf', `archica-${key}.dxf`), dxfFile(layout));
}

// Path data for the website (src/components/ui/logo-paths-2.ts).
const boxEmblem = toSvg(transform(emblem(), 0, BOX_OFFSET));
const stackedEmblem = toSvg(transform(emblem(), (LOGO_WIDTH - 100) / 2, 100 - EMBLEM_HEIGHT));
writeFileSync(
  join(out, 'web-paths.json'),
  JSON.stringify(
    {
      markPath: boxEmblem,
      stackedMarkPath: stackedEmblem,
      emblemHeight: EMBLEM_HEIGHT,
      boxOffset: BOX_OFFSET,
    },
    null,
    2,
  ) + '\n',
);

// Preview sheet.
const sharp = createRequire(join(root, 'package.json'))('sharp');
const panel = (x, y, color, background, border, key) => {
  const layout = layouts[key];
  const maxWidth = 320;
  const maxHeight = key === 'logo' ? 260 : 260;
  const scale = Math.min(maxWidth / layout.width, maxHeight / layout.height);
  const dx = x + (400 - layout.width * scale) / 2;
  const dy = y + (key === 'logo' ? 90 : 90) + (260 - layout.height * scale) / 2;
  const paths = layout.parts.map((part) => `<path d="${toSvg(part.paths)}"/>`).join('');
  return `<rect x="${x}" y="${y}" width="400" height="440" fill="${background}" stroke="${border}"/>
    <g transform="translate(${dx} ${dy}) scale(${scale})" fill="${color.hex}">${paths}</g>
    <text x="${x + 14}" y="${y + 420}" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="${background === '#2C3E35' ? '#EAD7B7' : '#6E7F62'}">${key} / ${color.label}  ${color.hex}</text>`;
};
const sheet = ['logo', 'sygnet']
  .map((key, row) =>
    [
      ['mech', '#F5F2EB', '#D9D4C4'],
      ['kreda', '#2C3E35', '#2C3E35'],
      ['bursztyn', '#F5F2EB', '#D9D4C4'],
      ['czarny', '#FFFFFF', '#D9D4C4'],
    ]
      .map(([name, bg, border], col) =>
        panel(40 + col * 420, 40 + row * 460, COLORS[name], bg, border, key),
      )
      .join('\n'),
  )
  .join('\n');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1740" height="980" viewBox="0 0 1740 980"><rect width="1740" height="980" fill="#FFFFFF"/>${sheet}</svg>`;
await sharp(Buffer.from(svg)).png().toFile(join(out, 'podglad.png'));

console.log(`Brand pack written to ${out}`);
