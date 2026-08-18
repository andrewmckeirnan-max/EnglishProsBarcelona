# What I need from you

Running list of decisions, credentials, and inputs that are blocking further
progress or need your sign-off. I'll keep this updated as things resolve or
new items come up, check it whenever you're wondering "what's left."

## Blocking / needs your action

- [ ] **Verify a domain in Resend** — until you do, the "email you your
      matched list" feature (the actual deliverable promised on every
      category page) silently fails for every real visitor. Resend's
      testing-mode restriction only allows sending to the account's own
      signup email (`andrew@searchsowreaptalent.com`), not arbitrary
      recipients — confirmed by hitting a real 403 from their API during
      testing. The internal "new lead" notification to you still works
      fine either way. Fix: verify a domain at resend.com/domains (needs
      a domain name — see that item below) and set `LEAD_FROM_EMAIL` to
      an address on it.
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
- [ ] **Point the domain at a real deployment** — `barcelonaenglishpros.com`
      is purchased and `NEXT_PUBLIC_SITE_URL` is set, but there's still no
      live deployment for it to point *at* (see the Vercel deploy item
      above). Once that exists, add the domain in Vercel's project
      settings and update the DNS records there (this host's own "Connect
      domain" step was for email, not the website — this is a separate
      DNS configuration for the site itself).

## Not blocking, but worth deciding soon

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

- [x] **Domain purchased**: `barcelonaenglishpros.com` is bought, and a
      `hello@barcelonaenglishpros.com` mailbox is set up with the
      registrar's own email hosting (this handles *receiving* mail — a
      visitor replying to one of our emails lands there). `NEXT_PUBLIC_SITE_URL`
      updated to match, verified in the live sitemap. Still separate and
      not yet done: verifying this domain in Resend (needed to *send*
      email as this domain — see the blocking item above), and pointing
      the domain at an actual deployment once one exists.
- [x] **Resend account (email notifications to you)** — new API key created
      scoped to this project ("Sending access" only, not full account
      access), `RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL` set in
      `.env.local`. `LEAD_FROM_EMAIL` is Resend's shared
      `onboarding@resend.dev` sender since there's no verified domain yet.
      First test looked successful (no errors logged) but that was a bug —
      the send code only checked for network failures, not Resend's actual
      response status, so a real 403 (testing-mode accounts can only send
      to their own signup email) went silently unlogged. Fixed to check
      `res.ok` and log the real error body; retested and confirmed genuinely
      working this time. `LEAD_NOTIFICATION_EMAIL` corrected to
      `andrew@searchsowreaptalent.com` (the address this Resend account is
      actually verified for) — update it if that's not where you want
      notifications. **The visitor-facing "email you your matched list"
      feature still doesn't work for real visitors** — see the blocking
      item above, it needs a verified domain, not just an API key.
- [x] **`/admin/leads` and `/admin/coverage` protection** — `ADMIN_SECRET`
      set in `.env.local` to a random generated value. Verified live: both
      pages now show "Restricted" without `?key=...`, and load normally
      with it.
- [x] **Database (leads storage)** — connected to your Supabase project via
      the Session pooler connection string (`.env.local`, gitignored, not
      in the repo). Verified live: a test submission showed up in
      `/admin/leads` with the green "Live database" badge. Note: the
      direct connection (`db.xxx.supabase.co`) doesn't work from this dev
      environment (IPv6-only, `ENOTFOUND`) — the Session pooler
      (`aws-1-eu-west-1.pooler.supabase.com`) is what's actually
      configured and working. When you set `DATABASE_URL` in Vercel for
      production, use the same pooler string (or the Transaction pooler,
      Supabase's recommendation for serverless).
      One test lead ("Supabase Pooler Test") is sitting in the table from
      verification — fine to delete anytime via Supabase's Table Editor,
      it's not a real lead.
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
