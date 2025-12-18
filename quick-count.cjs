/**
 * tier-summary.cjs
 *
 *   node tier-summary.cjs path/to/storage.ts
 *
 * Reports, for QUICK / STANDARD / COMPREHENSIVE:
 *   • question count per category
 *   • high-relevance counts per role (executive / manager / practitioner)
 *   • min / max each role will see in that tier
 */

const fs   = require('fs');
const file = process.argv[2] || 'server/storage.ts';

const TIERS  = ['quick', 'standard', 'comprehensive'];
const ROLES  = ['executive', 'manager', 'practitioner'];

const tierCat = {};           // tier -> { category -> count }
const tierRoleHigh = {};      // tier -> { role -> count }
const tierTotal = {};         // tier -> total qs

TIERS.forEach(t => {
  tierCat[t] = Object.create(null);
  tierRoleHigh[t] = Object.fromEntries(ROLES.map(r => [r, 0]));
  tierTotal[t] = 0;
});

let cur = {};                 // hold current question props

const flush = () => {
  if (!cur.id || !TIERS.includes(cur.tier)) { cur = {}; return; }
  const { tier, category } = cur;

  tierCat[tier][category] = (tierCat[tier][category] || 0) + 1;
  tierTotal[tier]++;

  ROLES.forEach(r => {
    if (cur[r] === 'high') tierRoleHigh[tier][r]++;
  });

  cur = {};
};

fs.readFileSync(file, 'utf8')
  .split(/\r?\n/)
  .forEach(line => {
    let m;
    if (m = line.match(/\bid:\s*['"]([^'"]+)['"]/)) cur.id = m[1];
    if (m = line.match(/\bcategory:\s*['"]([^'"]+)['"]/)) cur.category = m[1];
    if (m = line.match(/\bassessmentType:\s*['"]([^'"]+)['"]/)) cur.tier = m[1];
    ROLES.forEach(r => {
      if (m = line.match(new RegExp(`${r}:\\s*['"]([^'"]+)['"]`))) cur[r] = m[1];
    });
    if (/\},?/.test(line) && cur.id) flush();  // crude block end
  });
flush();

/* ----------  REPORT  ---------- */
TIERS.forEach(tier => {
  console.log(`\n=== ${tier.toUpperCase()} ===`);
  Object.entries(tierCat[tier])
        .sort((a,b)=>a[0].localeCompare(b[0]))
        .forEach(([c,n]) => console.log(`  • ${c} : ${n}`));

  console.log('\n  High-relevance questions');
  ROLES.forEach(r =>
    console.log(`    ${r.padEnd(12)} : ${tierRoleHigh[tier][r]}`));

  console.log(`\n  Total questions : ${tierTotal[tier]}`);
  ROLES.forEach(r =>
    console.log(`    ${r} sees min ${tierRoleHigh[tier][r]} / max ${tierTotal[tier]}`));
});
