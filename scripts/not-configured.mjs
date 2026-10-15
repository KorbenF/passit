#!/usr/bin/env node

const scriptName = process.argv[2] ?? 'unknown';
console.log(
  `[stub] Script "${scriptName}" is not configured yet (scheduled for a future phase). Skipping.`
);
process.exit(0);
