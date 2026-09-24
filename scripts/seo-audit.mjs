// Audits every prerendered page in .next/server/app (run `npm run build` first).
// Usage: node scripts/seo-audit.mjs [--verbose]
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), ".next", "server", "app");
const verbose = process.argv.includes("--verbose");
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = path.join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html") && !f.startsWith("_") && !f.includes("not-found")) files.push(p);
  }
})(root);

const pages = files.map((f) => {
  const html = readFileSync(f, "utf8");
  const url = "/" + path.relative(root, f).replace(/\\/g, "/").replace(/\.html$/, "").replace(/^index$/, "");
  const get = (re) => (html.match(re) || [])[1];
  const title = get(/<title>([^<]*)<\/title>/);
  const desc = get(/<meta name="description" content="([^"]*)"/);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  const canonical = get(/<link rel="canonical" href="([^"]*)"/);
  const jsonld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let jsonOk = true;
  const types = [];
  for (const j of jsonld) { try { const o = JSON.parse(j.replace(/&quot;/g, '"')); types.push(o["@type"]); } catch { jsonOk = false; } }
  const body = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const words = body.split(" ").length;
  const links = [...html.matchAll(/<a [^>]*href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  const imgsNoAlt = [...html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)].length;
  const thin = /We don&#x27;t have a verified|We don't have a verified/.test(html);
  return { url, title, desc, h1s, canonical, jsonOk, types, words, links, imgsNoAlt, thin, kb: Math.round(html.length / 1024) };
});

const issues = {};
const add = (k, u) => (issues[k] ||= []).push(u);
const dup = (arr, key) => { const m = new Map(); for (const p of arr) { const v = p[key]; if (!v) continue; (m.get(v) || m.set(v, []).get(v)).push(p.url); } return [...m.values()].filter((v) => v.length > 1); };

const inbound = new Map();
for (const p of pages) for (const l of new Set(p.links)) inbound.set(l.replace(/\/$/, "") || "/", (inbound.get(l.replace(/\/$/, "") || "/") || 0) + 1);

for (const p of pages) {
  if (!p.title) add("missing title", p.url);
  else { if (p.title.length > 65) add("title >65 chars", p.url); if (p.title.length < 25) add("title <25 chars", p.url); }
  if (!p.desc) add("missing meta description", p.url);
  else { if (p.desc.length > 165) add("description >165", p.url); if (p.desc.length < 70) add("description <70", p.url); }
  if (p.h1s.length !== 1) add(`h1 count is ${p.h1s.length}`, p.url);
  if (!p.canonical) add("missing canonical", p.url);
  else if (!p.canonical.startsWith("https://www.barcelonaenglishpros.com")) add("canonical wrong host", p.url);
  if (!p.jsonOk) add("invalid JSON-LD", p.url);
  if (p.words < 300) add("thin content (<300 words)", p.url);
  if (p.imgsNoAlt) add("images without alt", p.url);
  if (p.thin) add("no verified listing (thin/empty results)", p.url);
  if ((inbound.get(p.url.replace(/\/$/, "") || "/") || 0) < 2 && p.url !== "/") add("weakly linked (<2 inbound internal links)", p.url);
}

const groups = { pages: pages.length, categoryPages: pages.filter((p) => p.url.split("/").length === 3 && !p.url.startsWith("/blog")).length, blog: pages.filter((p) => p.url.startsWith("/blog/")).length };
console.log("PAGES", JSON.stringify(groups));
console.log("Avg words (category pages):", Math.round(pages.filter((p) => /^\/[a-z-]+\/[a-z-]+$/.test(p.url) && !p.url.startsWith("/blog")).reduce((a, p) => a + p.words, 0) / groups.categoryPages));
for (const [k, v] of Object.entries(issues)) console.log(`\n${k}: ${v.length}${verbose ? "\n  " + v.join("\n  ") : "  e.g. " + v.slice(0, 3).join(", ")}`);
for (const key of ["title", "desc"]) { const d = dup(pages, key); console.log(`\nduplicate ${key}s: ${d.length} groups${d.length ? "  e.g. " + d[0].slice(0, 3).join(", ") : ""}`); }
const h = dup(pages, "h1s");
const typeCount = {}; for (const p of pages) for (const t of p.types.flat()) typeCount[t] = (typeCount[t] || 0) + 1;
console.log("\nJSON-LD types across site:", JSON.stringify(typeCount));
const kb = pages.map((p) => p.kb).sort((a, b) => a - b); console.log("HTML size KB min/median/max:", kb[0], kb[Math.floor(kb.length / 2)], kb[kb.length - 1]);
