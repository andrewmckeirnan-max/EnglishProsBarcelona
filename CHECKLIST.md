# What I need from you

Running list of decisions, credentials, and inputs that are blocking further
progress or need your sign-off. I'll keep this updated as things resolve or
new items come up — check it whenever you're wondering "what's left."

## Blocking / needs your action

- [ ] **GitHub push** — no `gh` CLI or credentials in this environment.
      Run from the project folder once you're ready:
      `gh repo create barcelona-pro-directory --private --source=. --remote=origin --push`
- [ ] **Vercel deploy** — needs an interactive login I can't complete for you:
      `npx vercel login` then `npx vercel --prod`. (Note: an earlier no-login
      `vercel deploy --temporary` attempt hit a CLI/Next.js 16 compatibility
      bug — worth retrying properly-logged-in first; flag it back to me if
      it recurs.)
- [ ] **Real WhatsApp Business number** — `NEXT_PUBLIC_BUSINESS_WHATSAPP` is
      still a placeholder (`34600000000`). Every "Message us on WhatsApp"
      link on the site points there.
- [ ] **Who's answering the WhatsApp inbox** — see the "Operating the
      WhatsApp inbox" section in README.md for the reply script; needs an
      owner once real leads start arriving.
- [ ] **Domain name** — `NEXT_PUBLIC_SITE_URL` is `https://example.com`,
      used in the sitemap and metadata. Needed before this is worth
      launching publicly.

## Not blocking, but worth deciding soon

- [ ] **Email delivery** — `RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL` are
      unset, so lead notifications only log to the console right now, not
      your inbox. Fine for local testing, not for a live site.
- [ ] **Lead storage** — leads currently write to a local file
      (`data/leads.jsonl`), which does **not** persist on most serverless
      hosts (Vercel's filesystem is read-only outside `/tmp`). Needs a real
      store (Postgres/Supabase/Airtable) before relying on it live.
- [ ] **`/admin/leads` protection** — `ADMIN_SECRET` is unset, so the leads
      viewer is wide open right now. Set it before this is public.
- [ ] **Spot-check the research data** — every listing in
      `src/lib/professionals.ts` traces to a real business's own site, but
      none have been contacted or confirmed as still-accurate. Worth a pass
      before using this to approach anyone as a "here's what we found"
      pitch.

## Ongoing, not blocking anything

- [ ] **3-5 real listings per area × category** — currently at 1-2 per
      combination on average (33 total listings across 90 live combinations
      — see the coverage table in README.md). Getting every combination to
      3-5 is a large, multi-session research effort; I'll keep chipping
      away at it and update the table as coverage grows. The site's
      "show 3, lock the rest" UI (see below) is already built for when a
      combination has more than 3.
- [ ] **Google Maps cross-check** — still not done. Either connect Claude in
      Chrome (install: https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn,
      sign in with this same account, then tell me) or I can keep relying
      on web search, which has worked well so far but may miss newer/less-
      indexed businesses that only show up on Maps itself.
- [ ] **Freelancer/autónomo accountant and sworn translator** — zero
      area-confirmed listings found so far despite real search effort;
      may need a different research angle (e.g. searching Spanish-language
      terms, not just English-language ones).

## Resolved

- [x] Property & Mortgage Advisor category — paused per your instruction
      (soft-hidden, data intact, one-line flip to bring back).
- [x] WhatsApp + email now both required on the lead form.
- [x] "3 visible / rest locked until form submission" UI — built, just
      waiting on enough listings per combination to actually trigger.
