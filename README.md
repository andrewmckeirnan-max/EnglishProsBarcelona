# Barcelona English Pros

Programmatic-SEO directory + lead-matching site for English-speaking
professionals in Barcelona. Next.js 16 (App Router) + TypeScript + Tailwind.

## What's built

- **Homepage** (`/`), Planity-style service + area search bar, category
  grid, area grid, "how it works", and a full lead-capture form.
- **Area pages** (`/[area]`), one per neighbourhood (currently Eixample,
  Poblenou, Sarrià-Sant Gervasi, Les Corts, the four highest-opportunity
  districts), linking into every service.
- **Area × category landing pages** (`/[area]/[category]`), the actual
  money pages (e.g. `/poblenou/dentist`), one per neighbourhood × service
  combination (32 pages today, all statically generated). Each targets a
  specific long-tail search like "English dentist Poblenou", shows any
  featured partner, and embeds the lead form pre-filled with area + service.
- **Lead form** (`src/components/LeadForm.tsx`), multi-step: service → area
  → specific need → urgency → contact (name, WhatsApp, email). Posts to
  `/api/lead`, then shows a WhatsApp deep-link as the immediate next step.
- **`/partners`**, the sales page you send to a prospective clinic/lawyer/etc.
  to sign them up as the exclusive featured partner for one area + service.
- **`/admin/leads`**, a bare-bones internal viewer for captured leads (gate
  it with `ADMIN_SECRET` before this is public).
- **`sitemap.xml` / `robots.txt`**, generated from the same area/category
  data so new pages are automatically included.

## Why WhatsApp *and* email

WhatsApp is the primary CTA everywhere (`src/lib/whatsapp.ts` generates
`wa.me` deep links, no WhatsApp Business API/Twilio account needed to start)
because it converts far better for this audience than "give us your email."
Email is still captured on every lead as the paper trail for following up
and for invoicing partners. Once volume justifies it, swap the `wa.me` links
for the WhatsApp Business Platform API to receive replies inbound too.

## Directory coverage (as of the last research sweep)

32 real, web-verified listings across 16 categories x 4 areas (64 possible
combinations, so ~50% filled). Every listing links to the business's own
site or a verifiable directory page, nothing fabricated. Where a search
turned up a business but couldn't confirm *both* an area tie *and*
English-speaking service, it was deliberately left out rather than guessed.

| Category | Covered areas | Gaps |
|---|---|---|
| Dentist | Eixample, Sarrià, Les Corts | Poblenou |
| Dermatologist | Poblenou, Eixample, Sarrià | Les Corts |
| Doctor | Poblenou, Eixample, Les Corts | Sarrià |
| Physiotherapist | Eixample, Sarrià, Les Corts | Poblenou |
| Lawyer | Eixample | Poblenou, Sarrià, Les Corts |
| Psychologist | Poblenou, Eixample, Sarrià | Les Corts |
| Tax advisor | Eixample | Poblenou, Sarrià, Les Corts |
| Property advisor | Poblenou | Eixample, Sarrià, Les Corts |
| Chiropractor | Poblenou, Eixample, Sarrià | Les Corts |
| Acupuncturist | Eixample, Sarrià | Poblenou, Les Corts |
| Fertility & IVF | Eixample, Sarrià | Poblenou, Les Corts |
| Plastic/cosmetic surgeon | Sarrià | Poblenou, Eixample, Les Corts |
| LASIK & eye surgery | Sarrià | Poblenou, Eixample, Les Corts |
| Nutritionist | Sarrià | Poblenou, Eixample, Les Corts |
| Naturopath | Eixample | Poblenou, Sarrià, Les Corts |
| Veterinarian | Poblenou, Eixample | Sarrià, Les Corts |

Two web-search sweeps (see git log) closed most of the initial gaps,
especially tax advisor and property advisor which started at zero. The
remaining gaps mostly reflect genuine absence of an English-specific
practice with a confirmable web presence in that exact neighbourhood, not
missed research, a live Google Maps cross-check (once Claude in Chrome is
connected, or manually) is the logical next pass to catch anything
web-search-indexing missed, particularly newer or less-SEO'd businesses.

## Data model (`src/lib/`)

- `data.ts`, the 4 areas and 8 highest-LTV service categories (dentist,
  lawyer, property/mortgage, tax advisor, dermatologist/aesthetic, doctor,
  physiotherapist, psychologist). Add an area or category here and every
  page (nav, sitemap, cross-links) picks it up automatically.
- `professionals.ts`, **intentionally empty.** No real business listing is
  published anywhere on the live pages until you've actually onboarded a
  paying partner, nothing here is scraped or fabricated. When you sign one,
  add a single object (see the commented example in the file) and it renders
  as a featured card automatically. Until then, category pages show an
  honest "we'll hand-match you" CTA instead of a fake listing.

## Lead storage (dev-only right now)

`src/app/api/lead/route.ts` appends leads to `data/leads.jsonl` and, if
`RESEND_API_KEY` + `LEAD_NOTIFICATION_EMAIL` are set, emails a notification.
**Local-file storage does not persist on most serverless hosts** (e.g.
Vercel's filesystem is read-only outside `/tmp`). Before deploying, swap
`saveLead()` for a real store, Postgres/Supabase/Airtable are all a small
change in that one function.

## Running locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in what you have, the site
works with none of it set (WhatsApp links fall back to a placeholder number,
email notification just logs to the console).

## Operating the WhatsApp inbox

WhatsApp is the required contact channel on the site; email is optional and
often skipped, especially by anyone using the "skip the form, WhatsApp us
directly" link, which captures no contact details at all until you reply.
So email capture happens in the conversation, not the form. First-reply
template for whoever's answering:

> Hi [name]! Thanks for reaching out via Barcelona English Pros, checking
> availability with an English-speaking [service] near [area] now. What's
> a good email too, in case WhatsApp drops or you want the details in
> writing?

Two reasons to ask early rather than late: it's the natural moment (you're
already asking questions to route them), and it's the only reliable way to
backfill email for the skip-the-form leads, who by definition gave you
nothing else to work with. Log whatever email they give you back into
`data/leads.jsonl` manually, or wire it into a real CRM once you're past
the manual-reply stage.

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
