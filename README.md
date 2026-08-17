# BCN English Pros

Programmatic-SEO directory + lead-matching site for English-speaking
professionals in Barcelona. Next.js 16 (App Router) + TypeScript + Tailwind.

## What's built

- **Homepage** (`/`) — Planity-style service + area search bar, category
  grid, area grid, "how it works", and a full lead-capture form.
- **Area pages** (`/[area]`) — one per neighbourhood (currently Eixample,
  Poblenou, Sarrià-Sant Gervasi, Les Corts — the four highest-opportunity
  districts), linking into every service.
- **Area × category landing pages** (`/[area]/[category]`) — the actual
  money pages (e.g. `/poblenou/dentist`), one per neighbourhood × service
  combination (32 pages today, all statically generated). Each targets a
  specific long-tail search like "English dentist Poblenou", shows any
  featured partner, and embeds the lead form pre-filled with area + service.
- **Lead form** (`src/components/LeadForm.tsx`) — multi-step: service → area
  → specific need → urgency → contact (name, WhatsApp, email). Posts to
  `/api/lead`, then shows a WhatsApp deep-link as the immediate next step.
- **`/partners`** — the sales page you send to a prospective clinic/lawyer/etc.
  to sign them up as the exclusive featured partner for one area + service.
- **`/admin/leads`** — a bare-bones internal viewer for captured leads (gate
  it with `ADMIN_SECRET` before this is public).
- **`sitemap.xml` / `robots.txt`** — generated from the same area/category
  data so new pages are automatically included.

## Why WhatsApp *and* email

WhatsApp is the primary CTA everywhere (`src/lib/whatsapp.ts` generates
`wa.me` deep links — no WhatsApp Business API/Twilio account needed to start)
because it converts far better for this audience than "give us your email."
Email is still captured on every lead as the paper trail for following up
and for invoicing partners. Once volume justifies it, swap the `wa.me` links
for the WhatsApp Business Platform API to receive replies inbound too.

## Data model (`src/lib/`)

- `data.ts` — the 4 areas and 8 highest-LTV service categories (dentist,
  lawyer, property/mortgage, tax advisor, dermatologist/aesthetic, doctor,
  physiotherapist, psychologist). Add an area or category here and every
  page (nav, sitemap, cross-links) picks it up automatically.
- `professionals.ts` — **intentionally empty.** No real business listing is
  published anywhere on the live pages until you've actually onboarded a
  paying partner — nothing here is scraped or fabricated. When you sign one,
  add a single object (see the commented example in the file) and it renders
  as a featured card automatically. Until then, category pages show an
  honest "we'll hand-match you" CTA instead of a fake listing.

## Lead storage (dev-only right now)

`src/app/api/lead/route.ts` appends leads to `data/leads.jsonl` and, if
`RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL` are set, emails a notification.
**Local-file storage does not persist on most serverless hosts** (e.g.
Vercel's filesystem is read-only outside `/tmp`). Before deploying, swap
`saveLead()` for a real store — Postgres/Supabase/Airtable are all a small
change in that one function.

## Running locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in what you have — the site
works with none of it set (WhatsApp links fall back to a placeholder number,
email notification just logs to the console).

## Suggested next steps

1. Set `NEXT_PUBLIC_BUSINESS_WHATSAPP` to your real number and deploy
   (Vercel is the path of least resistance for Next.js).
2. Pick one category + area (e.g. **English dentist Poblenou**, per the
   commercial research) and get that one page ranking.
3. Sign one paying partner for that page, add their listing to
   `professionals.ts`.
4. Replace local-file lead storage with a real database before relying on
   it in production.
5. Expand the area × category matrix (`src/lib/data.ts`) once the first few
   pages are proving out.
