// Lists every PLACEHOLDER marker in src/content and src/i18n and exits with code 1 if any exist.
// Pre-publication check (BLUEPRINT §3.3); deliberately not part of `npm run build`.
// Run: npm run check:placeholders
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const directories = ['src/content', 'src/i18n'];
// Case-sensitive on purpose: the lower-case word "placeholder" is also a normal data field and UI label.
const MARKER = /PLACEHOLDER/;
const EXTENSIONS = new Set(['.ts', '.tsx']);

function* walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (EXTENSIONS.has(path.slice(path.lastIndexOf('.')))) yield path;
  }
}

const findings = [];
for (const directory of directories) {
  for (const file of walk(join(root, directory))) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, index) => {
        if (MARKER.test(line)) {
          findings.push(`${relative(root, file)}:${index + 1}  ${line.trim()}`);
        }
      });
  }
}

if (findings.length === 0) {
  console.log('No PLACEHOLDER markers found. Safe to publish (after the rest of the checklist).');
} else {
  console.log(`${findings.length} PLACEHOLDER marker(s) found:\n`);
  for (const finding of findings) console.log(finding);
  console.log('\nReplace them with real data before publishing to production.');
  process.exitCode = 1;
}
