// Quality gate for content/guides/*.json. Exit code 1 = do not publish.
// Usage: node scripts/validate-guides.mjs [file ...]   (no args = all guides)
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "content", "guides");
const types = readFileSync(path.join(root, "src/lib/types.ts"), "utf8");
const categories = new Set([...types.match(/export type CategorySlug =([\s\S]*?);/)[1].matchAll(/"([a-z-]+)"/g)].map((m) => m[1]));
const areas = new Set([...types.match(/export type AreaSlug =([\s\S]*?);/)[1].matchAll(/"([a-z-]+)"/g)].map((m) => m[1]));
const tsPostSlugs = new Set([...readFileSync(path.join(root, "src/lib/blog.ts"), "utf8").matchAll(/^\s{4}slug: "([^"]+)"/gm)].map((m) => m[1]));

const args = process.argv.slice(2);
const files = (args.length ? args.map((a) => path.basename(a)) : readdirSync(dir).filter((f) => f.endsWith(".json")));
const errors = [];
const warn = [];
const slugs = new Map();

function words(s) { return s.trim().split(/\s+/).filter(Boolean).length; }

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  try { slugs.set(JSON.parse(readFileSync(path.join(dir, file), "utf8")).slug, file); } catch { /* reported below */ }
}

for (const file of files) {
  const fail = (m) => errors.push(`${file}: ${m}`);
  let post;
  try { post = JSON.parse(readFileSync(path.join(dir, file), "utf8")); } catch (e) { fail("invalid JSON"); continue; }

  for (const k of ["slug", "title", "description", "excerpt", "publishedDate", "tldr"]) if (!post[k] || typeof post[k] !== "string") fail(`missing ${k}`);
  if (post.slug && file !== `${post.slug}.json`) fail(`filename must be ${post.slug}.json`);
  if (post.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug)) fail("slug must be kebab-case");
  if (post.slug && tsPostSlugs.has(post.slug)) fail("slug already used by a built-in post");
  if (post.slug && slugs.get(post.slug) !== file) fail(`duplicate slug also in ${slugs.get(post.slug)}`);
  if (post.publishedDate && !/^\d{4}-\d{2}-\d{2}$/.test(post.publishedDate)) fail("publishedDate must be yyyy-mm-dd");
  if (post.title && post.title.length > 75) fail(`title too long (${post.title.length}, max 75)`);
  if (post.description && (post.description.length < 80 || post.description.length > 165)) fail(`description length ${post.description.length} (want 80-165)`);
  if (typeof post.readingMinutes !== "number") fail("missing readingMinutes");

  const blocks = Array.isArray(post.content) ? post.content : [];
  if (blocks.length < 8) fail("content too thin (need at least 8 blocks)");
  let bodyText = "";
  let h2s = 0;
  const hrefs = [];
  for (const b of blocks) {
    if (b.type === "p") { if (!Array.isArray(b.segments) || !b.segments.length) fail("p block without segments"); else for (const s of b.segments) { bodyText += " " + s.text; if (s.href) hrefs.push(s.href); } }
    else if (b.type === "h2") { h2s++; bodyText += " " + b.text; }
    else if (b.type === "h3") bodyText += " " + b.text;
    else if (b.type === "ul") { if (!Array.isArray(b.items) || !b.items.length) fail("empty ul"); else bodyText += " " + b.items.join(" "); }
    else if (b.type === "find-cta") { if (!categories.has(b.categorySlug)) fail(`find-cta unknown category ${b.categorySlug}`); bodyText += " " + b.lead; }
    else fail(`unknown block type ${b.type}`);
  }
  const wc = words(bodyText);
  if (wc < 700) fail(`only ${wc} words in body (need 700+)`);
  if (wc > 2600) warn.push(`${file}: ${wc} words is long, consider trimming`);
  if (h2s < 3) fail("need at least 3 h2 sections");
  if (!blocks.some((b) => b.type === "find-cta")) fail("needs at least one find-cta block linking to a category");

  for (const h of hrefs) {
    const parts = h.split("/").filter(Boolean);
    const ok = h.startsWith("/") && (h === "/" || h === "/blog" || h === "/about" || h === "/partners"
      || (parts[0] === "blog" && parts.length === 2)
      || (parts.length === 1 && areas.has(parts[0]))
      || (parts.length === 2 && areas.has(parts[0]) && categories.has(parts[1]))
      || (parts.length === 2 && parts[0] === "barcelona" && categories.has(parts[1])));
    if (!ok) fail(`bad internal link ${h}`);
    if (parts[0] === "blog" && parts.length === 2 && !slugs.has(parts[1]) && !tsPostSlugs.has(parts[1])) fail(`link to missing guide ${h}`);
  }

  const faqs = post.faqs ?? [];
  if (faqs.length < 3) fail("need at least 3 faqs");
  for (const f of faqs) { if (!f.q || !f.a) fail("faq missing q or a"); else bodyText += " " + f.q + " " + f.a; }
  if (!Array.isArray(post.sources) || post.sources.length < 3) fail("need at least 3 sources");
  else for (const s of post.sources) if (!s.name || !/^https:\/\//.test(s.url ?? "")) fail(`bad source ${JSON.stringify(s)}`);
  for (const c of post.relatedCategorySlugs ?? []) if (!categories.has(c)) fail(`unknown relatedCategorySlug ${c}`);

  const all = JSON.stringify(post);
  if (/[—–]/.test(all)) fail("contains em/en dashes (use commas, colons or full stops)");
  if (/\b(cure[sd]?|guaranteed?|miracle)\b/i.test(bodyText)) fail("contains risky medical/legal claim wording (cure, guarantee, miracle)");
  if (/(lorem ipsum|TODO|\[\[|XXX)/i.test(all)) fail("contains placeholder text");
}

for (const w of warn) console.warn("warn:", w);
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`OK: ${files.length} guide(s) valid`);
