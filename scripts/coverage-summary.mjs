// Prints the unit-test coverage as a Markdown table (used for the GitHub job summary).
// Usage: node scripts/coverage-summary.mjs [path/to/coverage-summary.json]
import { readFileSync } from 'node:fs';

const path = process.argv[2] ?? 'coverage/coverage-summary.json';
const { total } = JSON.parse(readFileSync(path, 'utf8'));

const rows = ['statements', 'branches', 'functions', 'lines']
  .map(
    (metric) =>
      `| ${metric} | ${total[metric].pct}% | ${total[metric].covered}/${total[metric].total} |`,
  )
  .join('\n');

console.log(`### Unit test coverage\n\n| metric | coverage | covered |\n|---|---|---|\n${rows}\n`);
