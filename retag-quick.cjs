/**
 * rebalance-standard.cjs
 *
 *   node rebalance-standard.cjs server/storage.ts
 *
 *  • Keeps these categories in the STANDARD tier:
 *      fc_, aa_, cicd_, dora_, bvs_,
 *      ci_, sc_, obs_, fin_, mod_
 *  • Demotes ENTIRE categories aiml_, dm_, ip_, mch_, ops_ to "comprehensive".
 *  • Within each kept category, only the first 6 IDs stay "standard";
 *    extras become "comprehensive".
 */

const fs   = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node rebalance-standard.cjs path/to/storage.ts');
  process.exit(1);
}

/* ── config ──────────────────────────────────────────────────────────── */
const keepPrefixes   = ['fc_','aa_','cicd_','dora_','bvs_',
                        'ci_','sc_','obs_','fin_','mod_'];

const demotePrefixes = ['aiml_','dm_','ip_','mch_','ops_'];

const MAX_STD_PER_PREFIX = 6;

/* ── helpers ─────────────────────────────────────────────────────────── */
const prefixOf = id => id.slice(0, id.indexOf('_') + 1); // "aa_"

/* ── read file ───────────────────────────────────────────────────────── */
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

/* ── pass 1: count how many std-questions we already have per prefix ─── */
const stdCount = Object.create(null);
lines.forEach(line => {
  const idMatch  = line.match(/\bid:\s*['"]([^'"]+)['"]/);
  const stdMatch = line.match(/\bassessmentType:\s*['"]standard['"]/);
  if (idMatch && stdMatch) {
    const p = prefixOf(idMatch[1]);
    stdCount[p] = (stdCount[p] || 0) + 1;
  }
});

/* ── pass 2: rewrite lines as needed ─────────────────────────────────── */
let curId = null;
let changed = 0;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  const idMatch = line.match(/\bid:\s*['"]([^'"]+)['"]/);
  if (idMatch) curId = idMatch[1];

  const atMatch = line.match(/\bassessmentType:\s*['"]([^'"]+)['"]/);
  if (!atMatch) continue;

  const current = atMatch[1];             // quick / standard / comprehensive
  const quote   = atMatch[0].includes('"') ? '"' : "'";   // keep style
  const prefix  = prefixOf(curId);

  /* ---- CASE 1: entire category demoted -------------------------------- */
  if (demotePrefixes.includes(prefix) && current === 'standard') {
    line = line.replace(/(['"])standard\1/, `${quote}comprehensive${quote}`);
    changed++;
  }

  /* ---- CASE 2: keep-category but over quota --------------------------- */
  if (keepPrefixes.includes(prefix) && current === 'standard') {
    if (stdCount[prefix] > MAX_STD_PER_PREFIX) {
      // demote this one
      line = line.replace(/(['"])standard\1/, `${quote}comprehensive${quote}`);
      stdCount[prefix]--;     // one less counted
      changed++;
    }
  }

  /* ---- CASE 3: keep-category but currently quick/comprehensive -------- */
  if (keepPrefixes.includes(prefix) && current !== 'standard') {
    // NOTE: we leave it as is; only demotion is required by spec
  }

  lines[i] = line;
}

/* ── write results ───────────────────────────────────────────────────── */
fs.copyFileSync(file, file + '.bak');
fs.writeFileSync(file, lines.join('\n'), 'utf8');

console.log(`✅ Standard tier rebalanced.
   Lines changed : ${changed}
   Backup        : ${path.basename(file)}.bak`);
