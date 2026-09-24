// Real search-demand signal: Google autocomplete suggestions for a seed phrase,
// expanded with a-z and common question stems. No API key needed.
// Usage: node scripts/search-demand.mjs "english speaking dentist barcelona" [--deep]
const seed = process.argv[2];
if (!seed) { console.error('Usage: node scripts/search-demand.mjs "<seed phrase>" [--deep]'); process.exit(1); }
const deep = process.argv.includes("--deep");
const stems = ["how", "how much", "what", "which", "best", "cost", "reddit", "vs", "for expats", "in english", "do i need", "can i"];
const expansions = [seed, ...stems.map((s) => `${seed} ${s}`), ...stems.slice(0, 6).map((s) => `${s} ${seed}`)];
if (deep) for (const c of "abcdefghijklmnopqrstuvwxyz") expansions.push(`${seed} ${c}`);

const seen = new Map();
for (const q of expansions) {
  try {
    const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=${encodeURIComponent(q)}`);
    const [, list] = await res.json();
    for (const s of list) seen.set(s, (seen.get(s) ?? 0) + 1);
  } catch { /* skip */ }
}
console.log([...seen.keys()].sort().join("\n"));
