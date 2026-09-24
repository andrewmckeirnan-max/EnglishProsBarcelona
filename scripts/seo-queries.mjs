// For every profession category, pulls real Google-autocomplete queries around the main search patterns
// and writes them to seo-queries.json (repo root, gitignored is not needed, small). Usage: node scripts/seo-queries.mjs
import { readFileSync, writeFileSync } from "node:fs";
const data = readFileSync("src/lib/data.ts", "utf8");
const cats = [...data.matchAll(/slug: "([a-z-]+)",\s*name: "([^"]+)",\s*pluralName: "([^"]+)"/g)].map((m) => ({ slug: m[1], name: m[2], plural: m[3] }));
const out = {};
async function suggest(q) {
  try { const r = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=${encodeURIComponent(q)}`); return (await r.json())[1] ?? []; } catch { return []; }
}
for (const c of cats) {
  const n = c.name.toLowerCase().replace(/ & .*/, "").replace(/s$/, "");
  const seeds = [`english speaking ${n} barcelona`, `${n} barcelona english`, `${n} in barcelona`, `best ${n} barcelona expat`];
  const set = new Set();
  for (const s of seeds) for (const x of await suggest(s)) set.add(x);
  out[c.slug] = { name: c.name, suggestions: [...set] };
}
writeFileSync("seo-queries.json", JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, "categories");
