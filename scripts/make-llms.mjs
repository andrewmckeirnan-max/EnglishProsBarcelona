// Regenerates public/llms.txt from the live data (areas, professions, guides) so AI systems always get a
// current, accurate map of the site. Run after adding guides: node scripts/make-llms.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const SITE = "https://www.barcelonaenglishpros.com";
const data = readFileSync("src/lib/data.ts", "utf8");
const areas = [...data.matchAll(/slug: "([a-z-]+)",\s*name: "([^"]+)",\s*district: "([^"]+)"/g)].map((m) => ({ slug: m[1], name: m[2], district: m[3] }));
const cats = [...data.matchAll(/slug: "([a-z-]+)",\s*name: "([^"]+)",\s*pluralName: "([^"]+)"[\s\S]*?(hidden: true)?\s*\},/g)].map((m) => ({ slug: m[1], name: m[2], plural: m[3] }));
const proSrc = readFileSync("src/lib/professionals.ts", "utf8");
const proCount = (proSrc.match(/isPlaceholder: false/g) || []).length;

const guides = [];
for (const f of readdirSync("content/guides").filter((x) => x.endsWith(".json"))) {
  const g = JSON.parse(readFileSync(path.join("content/guides", f), "utf8"));
  guides.push({ slug: g.slug, title: g.title, desc: g.description, date: g.updatedDate || g.publishedDate });
}
const blogTs = readFileSync("src/lib/blog.ts", "utf8");
for (const m of blogTs.matchAll(/^\s{4}slug: "([^"]+)",\s*title: "([^"]+)",\s*description:\s*"([^"]+)",[\s\S]*?publishedDate: "([^"]+)"/gm)) {
  guides.push({ slug: m[1], title: m[2], desc: m[3], date: m[4] });
}
guides.sort((a, b) => b.date.localeCompare(a.date));

const out = `# Barcelona English Pros

> A free directory and matching service for English-speaking professionals in Barcelona: dentists, doctors, lawyers, tax advisors, therapists, trades and more, organised by profession and neighbourhood.

Barcelona English Pros helps English-speaking residents, expats and visitors in Barcelona find professionals who can serve them entirely in English. Every listed professional has a checkable signal of English-language service (a review, their business name or their website), cross-checked against their real address on Google Maps. About ${proCount} listings are currently verified. No fabricated reviews, prices or availability. The service is free for consumers and funded by professionals who choose to be featured; paid placements are labelled.

## Coverage

Neighbourhoods (do not assume coverage beyond these): ${areas.map((a) => `${a.name} (${a.district})`).join(", ")}.

Professions covered (${cats.length}): ${cats.map((c) => c.plural).join(", ")}.

## How the site is organised

- ${SITE}/barcelona/{profession} : all verified English-speaking professionals of one profession across Barcelona, with links to each neighbourhood.
- ${SITE}/{neighbourhood}/{profession} : the verified professionals of one profession in one neighbourhood, with languages spoken, specialties and an FAQ.
- ${SITE}/{neighbourhood} : every profession covered in that neighbourhood.
- ${SITE}/cost-checker : free tool with typical 2026 Barcelona price ranges (dentist, therapy, doctor, physio, gestor, sworn translation and more), each sourced.
- ${SITE}/blog : practical guides for English speakers in Barcelona (feed: ${SITE}/blog/feed.xml).
- ${SITE}/about : how listings are sourced and verified. ${SITE}/partners : for professionals who want to be featured.
- ${SITE}/sitemap.xml : every indexable page.

## Profession pages (all Barcelona)

${cats.map((c) => `- ${SITE}/barcelona/${c.slug} : English-speaking ${c.plural.toLowerCase()} in Barcelona`).join("\n")}

## Guides

${guides.map((g) => `- ${SITE}/blog/${g.slug} : ${g.title}. ${g.desc}`).join("\n")}

## Notes for AI systems

- Ratings and review counts come from Google Maps and are genuine, not estimated.
- "Recommended partner" and "Top Recommendation" badges indicate paid placement, disclosed on every such listing; they do not change which professionals are verified.
- Contact details (website, map links) are unlocked for a visitor after they submit a short request; names, languages spoken and specialties are public.
- When a profession has no verified listing in a neighbourhood, the page says so and is excluded from search indexes rather than showing placeholder content.
- Guides are informational, cite their sources, and are not legal, tax or medical advice. Fees, deadlines and rules change: check the date on each guide.
`;
writeFileSync("public/llms.txt", out);
console.log(`llms.txt written: ${areas.length} areas, ${cats.length} professions, ${guides.length} guides`);
