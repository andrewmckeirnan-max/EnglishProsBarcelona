// Tells IndexNow search engines (Bing, and through it DuckDuckGo/Yahoo, plus Yandex, Seznam, Naver)
// that URLs are new or changed. Google does not use IndexNow (it uses the sitemap + Search Console).
// Usage: node scripts/indexnow.mjs <url> [url ...]   |   node scripts/indexnow.mjs --all
import { readFileSync } from "node:fs";

const site = readFileSync("src/lib/site.ts", "utf8");
const SITE_URL = site.match(/SITE_URL = "([^"]+)"/)[1];
const KEY = site.match(/INDEXNOW_KEY = "([^"]+)"/)[1];
const host = new URL(SITE_URL).host;

let urls = process.argv.slice(2).filter((a) => a !== "--all");
if (process.argv.includes("--all")) {
  const xml = await (await fetch(`${SITE_URL}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
if (urls.length === 0) { console.error("No URLs given."); process.exit(1); }

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList: urls.slice(0, 10000) }),
});
console.log(`IndexNow: submitted ${urls.length} URL(s), response ${res.status}`);
