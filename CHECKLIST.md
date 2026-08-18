# What I need from you

Running list of decisions, credentials, and inputs that are blocking further
progress or need your sign-off. I'll keep this updated as things resolve or
new items come up, check it whenever you're wondering "what's left."

## Blocking / needs your action

- [ ] **Database (leads storage)** — this is the most important one right
      now. Leads currently write to a local file (`data/leads.jsonl`), which
      does **not** persist once deployed (Vercel's filesystem is read-only
      outside `/tmp`) — every lead would be lost. Fix:
      1. Create a free Postgres database. Easiest options that work cleanly
         with Vercel: [Neon](https://neon.tech) or
         [Supabase](https://supabase.com) — either just needs you to sign
         up and create a project, I can't do that step for you.
      2. Copy the connection string it gives you (starts with
         `postgres://...`).
      3. Set it as `DATABASE_URL` in your environment (`.env.local` for
         local dev, Vercel's Environment Variables settings for
         production).
      4. That's it — the table creates itself on first use (see
         `src/lib/db.ts`), no migration step needed. `/admin/leads` will
         show a green "Live database" badge instead of the amber
         "Local file only" one once it's connected.
- [ ] **Resend account (email notifications)** — right now, submitting the
      form does nothing visible to you: no email, no notification,
      nothing. Fix:
      1. Sign up at [resend.com](https://resend.com) (free tier is plenty
         to start).
      2. Create an API key.
      3. Set `RESEND_API_KEY` and `LEAD_NOTIFICATION_EMAIL` (your own
         inbox) as environment variables.
      4. Once your domain is set up, verify it in Resend and set
         `LEAD_FROM_EMAIL` to something like `leads@yourdomain.com` —
         until then it'll try to send from a placeholder address and fail
         quietly, which is fine for testing but not for real leads.
      5. ASAP-urgency leads are flagged 🔥 right in the email subject line
         so they don't get missed.
- [ ] **GitHub push**, no `gh` CLI or credentials in this environment.
      Run from the project folder once you're ready:
      `gh repo create barcelona-pro-directory --private --source=. --remote=origin --push`
- [ ] **Vercel deploy**, needs an interactive login I can't complete for you:
      `npx vercel login` then `npx vercel --prod`. (Note: an earlier no-login
      `vercel deploy --temporary` attempt hit a CLI/Next.js 16 compatibility
      bug, worth retrying properly-logged-in first; flag it back to me if
      it recurs.)
- [ ] **Real WhatsApp Business number**, `NEXT_PUBLIC_BUSINESS_WHATSAPP` is
      still a placeholder (`34600000000`). Every "Message us on WhatsApp"
      link on the site points there. The pre-filled message now includes
      the visitor's need and urgency, not just their name, so whoever's
      watching that inbox has real context on click.
- [ ] **Who's answering the WhatsApp inbox**, see the "Operating the
      WhatsApp inbox" section in README.md for the reply script; needs an
      owner once real leads start arriving.
- [ ] **Domain name**, `NEXT_PUBLIC_SITE_URL` is `https://example.com`,
      used in the sitemap and metadata. Needed before this is worth
      launching publicly.

## Not blocking, but worth deciding soon

- [ ] **`/admin/leads` and `/admin/coverage` protection**, `ADMIN_SECRET`
      is unset, so both viewers are wide open right now. Set it before
      this is public.
- [ ] **Booking attribution** — no way yet to know if a lead actually
      booked with a professional after seeing their info. Cheapest fix
      when you're ready: a follow-up message a few days later asking
      directly. A real fix requires either partner cooperation (they
      report back) or putting your own booking step in front of theirs
      (bigger build, worth it once volume justifies it).
- [ ] **WhatsApp Business Platform (Cloud API)** — true automatic delivery
      of lead data into your WhatsApp inbox (not just a click-to-chat link)
      needs Meta Business verification, approved message templates, and
      costs per conversation. Worth doing once there's real lead volume,
      not before.
- [ ] **Spot-check the research data**, every listing in
      `src/lib/professionals.ts` traces to a real business's own Google
      Maps presence, but none have been contacted or confirmed as
      still-accurate. Worth a pass before using this to approach anyone as
      a "here's what we found" pitch.

## Ongoing, not blocking anything

- [ ] **5 real listings per area × category**, currently well short of
      that on average across all 180 combinations (check
      `/admin/coverage` for the live count). Getting every combination to
      5 is a large, multi-session research effort; I'll keep chipping away
      at it. Diagonal Mar & Vila Olímpica and Les Corts are consistently
      the hardest — genuinely thinner English-speaking professional
      presence there, not a research gap.
- [ ] **Occupational therapist**, zero listings found in any covered area
      despite real search effort — every English-confirmed provider found
      so far is in Horta-Guinardó, outside our 6 areas. May be a genuine
      market gap rather than something more searching will fix.

## Resolved

- [x] Property & Mortgage Advisor category, paused per your instruction
      (soft-hidden, data intact, one-line flip to bring back).
- [x] WhatsApp + email now both required on the lead form.
- [x] "3 visible / rest locked until form submission" UI, live on every
      category page and in the lead form's own results teaser.
- [x] Google Maps cross-check — done via the sandboxed browser tool
      (`?hl=en&gl=us` bypasses the consent wall), used for every listing
      added this session.
- [x] Lead form redesigned: shows real matches before asking for contact
      info, instead of gating everything behind the form.
- [x] Basic spam protection (honeypot field) on the lead form.
- [x] Live coverage tracker at `/admin/coverage`.
- [x] Embedded map on category pages (Leaflet + free OpenStreetMap tiles,
      no Google Maps API key needed).
