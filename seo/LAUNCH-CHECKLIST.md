# Launch checklist (owner tasks and next steps)

Updated 2026-09-28. Tick items as they are done. "Owner" means it needs the site owner's own login or account.

## 1. Search engines (do first, free, biggest payoff)
- [ ] **Google Search Console** (owner): add `https://www.barcelonaenglishpros.com` as a URL-prefix property, verify with the `GOOGLE_SITE_VERIFICATION` meta tag (add the value as a Vercel env var, redeploy), then submit `https://www.barcelonaenglishpros.com/sitemap.xml`.
- [ ] Request indexing in Search Console (URL Inspection) for: `/`, `/cost-checker`, `/barcelona/dentist`, `/blog`, and the three newest guides.
- [ ] **Bing Webmaster Tools** (owner): import from Search Console, or add the site with `BING_SITE_VERIFICATION`. Covers Bing, DuckDuckGo, Yahoo and Ecosia.
- [ ] Check Search Console "Pages" report a week after submission: how many pages are indexed, and why others are excluded.
- [ ] Check Vercel Analytics weekly: visitors, top pages, referrers.
- [ ] Run PageSpeed Insights on `/`, `/cost-checker` and one category page (the automated quota ran out).
- [ ] Search `site:barcelonaenglishpros.com` in Google and Bing every few days until pages appear.

## 2. AI search (AEO)
- [ ] Monthly: ask ChatGPT, Claude, Perplexity and Gemini the prompts in `seo/prompts.csv` and note whether the site is named or cited.
- [ ] Keep `public/llms.txt` current (`node scripts/make-llms.mjs` after guides or new pages).
- [ ] Refresh the cost checker figures quarterly (`src/lib/costData.ts`, bump `COST_DATA_CHECKED`).

## 3. Social launch (later, when ready)
- [ ] Create an Instagram business account for Barcelona English Pros (owner). Link in bio: `/cost-checker`.
- [ ] Weekly batch: 5 "What does X cost in Barcelona?" price-card images and captions from the cost checker data (ask Claude to generate).
- [ ] Optional: TikTok reuse of the same clips.
- [ ] Facebook groups (owner, manual): join Barcelona expat groups, answer real questions with a disclosed link. Drafts are in `content/guides/community/`.
- [ ] Reddit (owner, manual): r/barcelona, r/spain, r/expats. Read each subreddit's self-promotion rules first and always disclose.
- [ ] X is optional and only for the founder story, not for reaching expats.
- [ ] Set up Meta Business Suite scheduling. Full auto-posting through Meta's API only once the content proves itself.

## 4. Backlinks and mentions
- [ ] Send the outreach messages in `seo/OUTREACH.md` (18 sites, three message templates). Note: a Google Business Profile is not an option, because Google excludes online-only and lead-generation businesses.
- [ ] Ask Barcelona expat sites to link the cost checker: Barcelona Metropolitan, Angloinfo, Expatica, relocation blogs.
- [ ] Tool directories: AlternativeTo, Toolify.
- [ ] Product Hunt or Indie Hackers launch of the free cost checker.

## 5. Partners and revenue
- [ ] Message Anne-Laure Naudin (featured trial): share the traffic, ask consent for her photo and a few testimonials, agree a price.
- [ ] When a partner signs: remove `partnerTrial` so the badge and tooltip say they pay for placement.
- [ ] Optional: add a click counter for the featured listing so there are numbers for the conversation.
- [ ] Watch lead volume and the "How did you find us" field for a few weeks before judging the new "Send me the full details and typical prices" wording.

## 6. Housekeeping
- [ ] Confirm the `daily-guides` scheduled task is running ("Run now" in the Claude scheduled tasks list).
- [ ] Decide on new areas (Sitges, Castelldefels and Gavà, Ciutat Vella, Sant Cugat). Research is in `research/`.
- [ ] Send a real test email to your own address to check the shortlist email in an inbox.
