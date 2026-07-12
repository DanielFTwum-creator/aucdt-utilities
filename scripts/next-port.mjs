#!/usr/bin/env node
/**
 * next-port.mjs — allocate the next free backend port for a fleet app (PORT-REGISTRY.md).
 *
 * Automates step 1 of the PORT ASSIGNMENT PROTOCOL: "pick the next-available number".
 * "Used" = every port already in PORT-REGISTRY.md PLUS every server.ts default in the
 * fleet (so a hardcoded drift can't be handed out) PLUS infra ports. Allocation starts
 * at 3042 and never reuses a gap below it (registry convention — those may be claimed by
 * unaudited defaults).
 *
 * Usage:
 *   node scripts/next-port.mjs                          # print the next free port + summary
 *   node scripts/next-port.mjs --assign <pm2> <folder>  # reserve it in PORT-REGISTRY.md
 *
 * After --assign you STILL must set that same number in the app's server.ts default,
 * deploy.ps1 (PORT= in the pm2 start line), the server .env, and the nginx proxy_pass —
 * "one app, one number, matched everywhere" (see the protocol). This only claims the number.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const REG = 'PORT-REGISTRY.md';
const RANGE_START = 3042;                       // registry convention: increment from here
const RANGE_END = 3099;
const INFRA = new Set([3306, 3307, 6379, 8080, 8081]);

function usedPorts() {
  const used = new Set(INFRA);
  const reg = readFileSync(REG, 'utf8');
  for (const m of reg.matchAll(/^\|\s*(\d{4})\s*\|/gm)) used.add(Number(m[1]));  // registry rows
  for (const e of readdirSync('.', { withFileTypes: true })) {                   // server.ts defaults
    if (!e.isDirectory()) continue;
    try {
      const s = readFileSync(join(e.name, 'server.ts'), 'utf8');
      const mm = s.match(/process\.env\.PORT\)?\s*\|\|\s*(\d{4})/);
      if (mm) used.add(Number(mm[1]));
    } catch { /* no server.ts */ }
  }
  return used;
}

function nextFreeFrom(used, start) {
  for (let p = start; p <= RANGE_END; p++) if (!used.has(p)) return p;
  throw new Error(`No free port in ${start}-${RANGE_END} — extend RANGE_END.`);
}

const used = usedPorts();
const next = nextFreeFrom(used, RANGE_START);
const [flag, name, folder] = process.argv.slice(2);

if (flag === '--assign') {
  if (!name || !folder) {
    console.error('usage: node scripts/next-port.mjs --assign <pm2-name> <repo-folder>');
    process.exit(1);
  }
  let reg = readFileSync(REG, 'utf8');
  const marker = '## Next available';
  const row = `| ${next} | ${name} | ${folder} |`;
  const block =
    `| Port | App (PM2 name) | Repo folder |\n` +
    `|------|----------------|-------------|\n${row}\n\n`;
  const heading = '## Allocated via next-port.mjs\n\n';
  if (reg.includes(heading)) {
    // append the row under the existing allocator table
    reg = reg.replace(heading + `| Port | App (PM2 name) | Repo folder |\n|------|----------------|-------------|\n`,
      heading + `| Port | App (PM2 name) | Repo folder |\n|------|----------------|-------------|\n${row}\n`);
  } else {
    reg = reg.replace(marker, heading + block + marker);
  }
  const after = nextFreeFrom(new Set([...used, next]), next + 1);
  reg = reg.replace(/\*\*\d{4}\*\* — increment from here for new apps\./,
    `**${after}** — increment from here for new apps.`);
  writeFileSync(REG, reg);
  console.log(`Reserved port ${next} for "${name}" (${folder}) in ${REG}. Next available is now ${after}.`);
  console.log(`Remember: set ${next} in server.ts default, deploy.ps1 PORT=, server .env, and nginx proxy_pass.`);
} else {
  console.log(`Next free backend port: ${next}`);
  console.log(`(used ports considered: ${[...used].filter(p => !INFRA.has(p)).sort((a,b)=>a-b).join(', ')})`);
  console.log(`To reserve it: node scripts/next-port.mjs --assign <pm2-name> <repo-folder>`);
}
