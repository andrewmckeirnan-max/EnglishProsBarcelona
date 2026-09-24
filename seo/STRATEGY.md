# SEO + AI search (AEO) strategy

Living document. Update it when something ships or a measurement changes. Last reviewed: 2026-09-25.

## What the research says (and how far to trust it)

| Finding | Source | Confidence / caveat |
|---|---|---|
| In AI Mode, users mostly accept the AI's shortlist (74% of final shortlists came straight from the AI output; 64% clicked nothing). Classic Google users build their own. | Kevin Indig, Growth Memo (185 purchase tasks) | Headline numbers only; full study is paywalled. |
| Pages that help an AI *explain, compare and validate* (categories, listings, guides, locators) get about 57% of AI citations. Homepages get the AI *traffic* (about 58%) but only 3% of citations. | Aleyda Solis, AI Search Optimization Checklist (Sep 2026) | Sample of 40 US sites. Our category/city/guide pages are the citation pages. |
| External sources are 70-82% of what AI cites. Reddit/community/social is the biggest single bucket. Being mentioned in many places beats ranking first. | Aleyda (Semrush data); Ethan Smith / Graphite | Consistent across sources. |
| New sites can win AI answers faster than classic SEO, via question-specific pages and off-site mentions. AI queries are long (25+ words). | Ethan Smith, Lenny's Podcast | Practitioner claim, not a controlled study. |
| 45% of consumers used AI tools to find local businesses (up from 6%); ChatGPT 31%, Google AI Mode 23%; 88% verify before acting. | BrightLocal Local Consumer Review Survey 2026 | Survey, mostly US/UK. |
| AI Overviews appear in about 68% of local-business queries, and 92% of informational ones ("how much do lawyers charge?"). Third parties (Indeed, Reddit, Yelp, Thumbtack) are ~60% of citations in a Houston test. | Whitespark | Single-city sample. Supports guides and directory pages. |
| ChatGPT sent 44.7% of citations to directories/review sites; Gemini pointed to the business's own site 80.7% of the time. | Cheers study, 28 days to 2 Sep 2026 | Vendor study, US home services. Platform-dependent, not universal. |
| Adding JSON-LD schema did not move AI citations (1,885 pages, controlled). | Ahrefs, May 2026 | Solid. Keep schema for classic Google, do not treat it as an AEO lever. |
| Google Business Profile is ~53-67% of Google AI local citations; Yelp is 61% of ChatGPT's. | BrightLocal | Applies mainly to the listed businesses, not to a directory. |

## Where we stand

Done: all professional names public with links locked; crawlable server-rendered pages; RSS feed of guides; auto-generated llms.txt (`node scripts/make-llms.mjs`); rich-snippet permissions; canonical www host; sitemap of indexable pages only; robots allows all AI crawlers (tested: GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google, Bing all get 200); llms.txt; IndexNow; 45 all-Barcelona profession pages plus 264 neighbourhood pages; synonyms and Spanish terms; unique titles and descriptions; answer-first guides with FAQs and sources; daily guide routine; "at a glance" data summaries (languages, specialties, locally based) on every listing page; optional "how did you find us" question in the lead form; Vercel Web Analytics; listed-on badge for professionals; link-health and SEO audit scripts.

## Prioritised backlog (Aleyda's formula: severity x importance / effort)

1. **Off-site corroboration (highest impact, needs a human).** Real answers in Reddit (r/barcelona, r/spain, r/expats), Facebook expat groups, expat blogs; disclose the affiliation, no astroturfing, no mass posting. Use the guides as the source of useful answers. Create and link (sameAs) a Facebook page, LinkedIn page and YouTube channel.
2. **Search Console + Bing Webmaster Tools** (owner action). Both now have AI reports: Search Console has a generative-AI performance report; Bing has AI Performance (grounding queries, intents, citation share).
3. **Prompt tracking** (below). Baseline before drawing any conclusions.
4. **Commercial data in listings**: verified price bands, opening hours, credentials, booking links. Aleyda's "transactable" and "fresh" characteristics. Only add what is verified.
5. **Freshness**: monthly link-health check, quarterly re-verification of listings, guides re-verified on rotation with `updatedDate` set.
6. **Backlinks from the professionals** via the badge on /partners, offered when outreach happens.
7. **Spanish-language layer** (pilot). Test both local-language and English prompts. Only worth it if Search Console shows Spanish queries arriving.
8. **Video**: short YouTube walk-throughs ("how to exchange your driving licence in Barcelona"). AI Mode cites video far more than ChatGPT does.

## Decisions made

- **Names public, links locked (decided 2026-09-25).** Every professional's name, rating, languages and specialties are public on listing pages and in structured data, so search engines and AI can read and recommend them. Website, map and booking links (and the street address) stay locked beyond the first 3 per page and unlock with the form. Reversible: `locked` in `ProfessionalCard` and the `FREE_PREVIEW_LIMIT` constant control it. Next step when ready: move the gate toward the service (confirmed availability, price, personal best-match, comparison email) and track outbound clicks so professionals can be shown their traffic.
- **Structured data matches what is visible.** Links appear in markup only for the professionals whose links are visible.
- **Paid placements stay labelled** (protects trust; matches guidance on undisclosed endorsements).

## Measurement protocol (monthly, about 45 minutes)

1. Use the prompts in `seo/prompts.csv`. Run each core prompt 3 times, logged out, in a clean session, on 2-3 platforms (ChatGPT, Google AI Mode, Perplexity). Record platform, date and location.
2. Record per prompt: did we appear, were we recommended, was the link clickable, was it described accurately, which sources were cited, which competitors appeared.
3. Report separately by platform. KPIs: prompt coverage, recommendation rate, linked citation rate, representation accuracy. Do not blend platforms into one number.
4. Cross-check with Search Console (generative AI report), Bing AI Performance, and Vercel Analytics referrers (chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com).
5. Count leads whose "how did you find us" note says AI assistant or search.
6. Re-baseline after any major site change. Keep the core prompt set stable for trend comparison.

## Monthly health run

`npm run build && node scripts/seo-audit.mjs && node scripts/check-links.mjs` (a scheduled task runs this and reports).
