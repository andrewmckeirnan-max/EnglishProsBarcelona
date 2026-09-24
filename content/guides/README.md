# Daily guide-writing routine

Goal: publish 2 to 4 new, genuinely useful guides a day for Barcelona English Pros, covering a rotating selection of professions, to earn search (SEO), answer-engine (AEO) and AI-assistant (LLM) visibility. Each guide is one JSON file in this folder. Publishing never means editing code.

Repo: `C:\Users\ANDREW WILLIAM\Documents\Work\barcelona-pro-directory` (run every command as `cd "<repo>" && ...`, the shell resets its directory each call). Deploys automatically when pushed to `main`.

## Each run

1. **Choose topics.** List existing slugs (`content/guides/*.json` and `slug:` entries in `src/lib/blog.ts`). Pick 2 to 4 topics not yet covered, each for a *different* profession category (`CategorySlug` in `src/lib/types.ts`). Prefer categories with many listings in `src/lib/professionals.ts` and few or no guides. Rotate widely: medical, legal, financial, home services, lifestyle. Do not write two guides on one category in the same run.
2. **Find what people actually ask.** For each topic:
   - Run `node scripts/search-demand.mjs "<seed phrase>"` (Google autocomplete, real search demand). Use phrasings like "english speaking <profession> barcelona", "<profession> spain how much", "<task> spain expat". Add `--deep` for more.
   - `seo-queries.json` in the repo root holds the real autocomplete queries already collected for every profession (`node scripts/seo-queries.mjs` refreshes it). Prefer topics that answer its "how much", "cost", "how to" and "do X speak English" style phrases, and use the everyday synonyms from `src/lib/seoTerms.ts` (physio, GP, solicitor, private driver and so on) naturally in headings and FAQs.
   - Use WebSearch for current facts and to see what questions guides and forums cover. Reddit, Facebook groups and Google Trends are NOT reachable by our tools. Do not pretend they were consulted. Accessible forum-style sources (Expatica, expat.com, Tripadvisor forums, Quora) can be used via WebSearch.
   - Look at the listed professionals for that category in `src/lib/professionals.ts` and read a few of their own sites (`bookingUrl`) with WebFetch to learn real industry terms, services and common client questions. Take inspiration and facts only.
3. **Verify facts.** Fetch at least 3 independent sources per guide with WebFetch. Cross-check every number, fee, deadline and rule. When sources disagree, say "roughly" or give a range and tell the reader to check the current figure. Never invent prices, statistics, reviews, testimonials, availability or waiting times. Anything legal, tax or medical is informational only, never advice, and never says "cure", "guaranteed" or similar.
4. **Write it originally.** Never copy or closely paraphrase sentences from a source. Combine several sources into your own structure and wording. Do not quote more than a few words. List the sources consulted in `sources`.
5. **Save** as `content/guides/<slug>.json`, matching the schema below.
6. **Validate:** `node scripts/validate-guides.mjs`. Fix every error. If a guide still fails after two attempts, delete it and move on. Never publish something that fails.
7. **Build check:** `npm run build` must succeed.
8. **Publish:** `git add content/guides` (guide files, community drafts and `content/guides/LOG.md`), commit with a message like `Add guides: <titles>`, `git push origin main`. Nothing else in the repo should be committed by this routine.
9. **Notify search engines:** wait until the guide URLs return 200 on `https://www.barcelonaenglishpros.com/blog/<slug>` (poll with curl, up to about 3 minutes after the push), then run `node scripts/indexnow.mjs https://www.barcelonaenglishpros.com/blog/<slug> ...` for each new guide. A 200 or 202 response means it was accepted.
10. **Community answer drafts:** for each new guide, write `content/guides/community/<slug>.md` with two short, genuinely helpful answers (80 to 120 words each) to the kind of question people ask in expat communities about that topic, ending with a plain, disclosed pointer to the guide ("I help run Barcelona English Pros, there is a longer guide here"). These are drafts for the owner to post manually; never post anything yourself, and never write anything that pretends to be an independent customer.
11. **Freshness rotation:** after publishing, take the guide with the oldest `updatedDate` (or `publishedDate`), re-verify its figures and rules against current sources, fix anything that changed, and set `updatedDate` to today. If nothing changed, still set `updatedDate` only if you actually re-checked. Commit it with the same push.
12. **Log:** append a short entry to `content/guides/LOG.md` (date, slugs, the search-demand phrases used, any caveats).
13. **Report** a one-paragraph summary of what was published and anything the owner should check.

## Guide standards

- British English. **No em dashes or en dashes anywhere** (use commas, colons, full stops).
- Helpful, calm, plain English. Honest about limits. No hype, no filler, no keyword stuffing.
- 800 to 1,400 words of body. Answer first: a `tldr` of one or two sentences that directly answers the main question.
- H2 headings phrased like the questions people ask. Short paragraphs. Bullet lists where they help.
- At least one `find-cta` block (links to the category page for every area, generated live). Add internal links to relevant category pages (`/eixample/<category>`), areas, and 1 or 2 related guides.
- 3 to 5 `faqs` that mirror real autocomplete queries, each answer self-contained in 1 to 3 sentences (these become FAQ structured data and AI-answer material).
- `title` max 75 characters, `description` 80 to 165 characters, `excerpt` a friendly 1 to 2 sentences.
- Extractable for AI answers: state the answer in the first sentence of each section, name entities and conditions explicitly (no vague pronouns), and where figures matter put them in a short list or a comparison table inside the text. Every price, fee, deadline or rule carries an "as of" year in the wording (for example "in 2026") and, when sources disagree, says so.
- Do not name or rank specific listed businesses as "the best". Point to the category pages instead. Never disparage a business.
- Mention Barcelona and English-speaking angle naturally. Do not claim coverage beyond the areas we list.

## Schema

```json
{
  "slug": "kebab-case-same-as-filename",
  "title": "...",
  "description": "...",
  "excerpt": "...",
  "publishedDate": "YYYY-MM-DD",
  "readingMinutes": 6,
  "relatedCategorySlugs": ["doctor"],
  "tldr": "...",
  "content": [
    { "type": "p", "segments": [{ "text": "plain text" }, { "text": "linked text", "href": "/eixample/doctor" }] },
    { "type": "h2", "text": "..." },
    { "type": "h3", "text": "..." },
    { "type": "ul", "items": ["...", "..."] },
    { "type": "find-cta", "categorySlug": "doctor", "lead": "One sentence leading into the per-area links:" }
  ],
  "faqs": [{ "q": "...", "a": "..." }],
  "sources": [{ "name": "...", "url": "https://..." }]
}
```

Valid internal links: `/`, `/blog`, `/about`, `/partners`, `/<area>`, `/<area>/<category>`, `/barcelona/<category>` (the all-Barcelona page for a profession, best to link to for general mentions), `/blog/<existing-slug>`. Two finished examples: `autonomo-spain-costs-and-gestor-guide.json` and `see-a-doctor-in-english-barcelona-public-vs-private.json`.
