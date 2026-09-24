// Checks every unique outbound listing URL (bookingUrl / websiteUrl) for dead links, redirects to other domains
// and bot-blocking, so listings stay fresh. Usage: node scripts/check-links.mjs
import { readFileSync } from "node:fs";

const src = readFileSync("src/lib/professionals.ts", "utf8");
const urls = [...new Set([...src.matchAll(/(?:bookingUrl|websiteUrl):\s*"(https?:\/\/[^"]+)"/g)].map((m) => m[1]))];
console.log(`Checking ${urls.length} unique URLs...`);

async function check(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(url, { method, redirect: "follow", signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; BarcelonaEnglishProsLinkCheck/1.0)" } });
      clearTimeout(t);
      if (method === "HEAD" && (res.status === 405 || res.status === 403 || res.status >= 500)) continue;
      return { url, status: res.status, final: res.url };
    } catch (e) {
      if (method === "GET") return { url, status: 0, error: String(e.cause?.code || e.name) };
    }
  }
}

const results = [];
const queue = [...urls];
await Promise.all(Array.from({ length: 12 }, async () => { while (queue.length) results.push(await check(queue.shift())); }));

const dead = results.filter((r) => r.status === 0 || r.status === 404 || r.status === 410 || r.status >= 500);
const blocked = results.filter((r) => r.status === 403 || r.status === 429);
const moved = results.filter((r) => r.status >= 200 && r.status < 400 && r.final && new URL(r.final).hostname.replace(/^www\./, "") !== new URL(r.url).hostname.replace(/^www\./, ""));
console.log(`OK: ${results.length - dead.length - blocked.length}  Dead: ${dead.length}  Bot-blocked (unverifiable): ${blocked.length}  Redirected to another domain: ${moved.length}`);
for (const r of dead) console.log("DEAD", r.status || r.error, r.url);
for (const r of moved) console.log("MOVED", r.url, "->", r.final);
