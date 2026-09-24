import { NextResponse, type NextRequest } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getArea, getCategory } from "@/lib/data";
import { getProfessionals } from "@/lib/professionals";
import { googleMapsSearchUrl } from "@/lib/maps";
import { insertLead, isDatabaseConfigured } from "@/lib/db";
import type { CategorySlug, LeadPayload } from "@/lib/types";

// -----------------------------------------------------------------------
// Storage: a real Postgres table (see src/lib/db.ts) when DATABASE_URL is
// set, which is required before this is live — Vercel's filesystem is
// read-only outside /tmp, so the JSONL fallback below only works for local
// dev without a database configured yet. Wire notifyEmail/sendMatchEmail
// up to a real Resend account (RESEND_API_KEY) before relying on either.
// -----------------------------------------------------------------------

const LEADS_FILE = path.join(process.cwd(), "data", "leads.jsonl");

async function saveLeadToFile(lead: LeadPayload & { receivedAt: string }) {
  await mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await appendFile(LEADS_FILE, JSON.stringify(lead) + "\n", "utf8");
}

async function saveLead(lead: LeadPayload & { receivedAt: string }) {
  if (isDatabaseConfigured()) {
    // Consent and submission happen in the same request, so the server's
    // own received-at instant is the real consent timestamp — no need to
    // trust a client-supplied one.
    await insertLead({ ...lead, consentedAt: lead.receivedAt });
    return;
  }
  // No DATABASE_URL — local-dev-only fallback, does not persist on a real
  // deployment. See src/lib/db.ts and CHECKLIST.md for setup.
  await saveLeadToFile(lead);
}

async function notifyEmail(lead: LeadPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  // This notifies YOUR inbox that a lead came in — it doesn't require the
  // lead to have given their own email, since WhatsApp is the required
  // contact channel now.
  if (!apiKey || !to) {
    console.log("[lead] Email notification skipped — RESEND_API_KEY / LEAD_NOTIFICATION_EMAIL not set.");
    return;
  }
  // ASAP leads are worth more, both to you and to whoever you route them
  // to, so they're flagged right in the subject rather than buried in the
  // body where a quick inbox glance would miss them.
  const urgencyFlag = lead.urgency === "asap" ? "🔥 ASAP — " : "";
  await sendViaResend(apiKey, {
    from: process.env.LEAD_FROM_EMAIL || "leads@barcelonaenglishpros.com",
    to,
    subject: `${urgencyFlag}New lead: ${lead.categorySlug} in ${lead.areaSlug}`,
    text: formatLeadText(lead),
  }, "[lead] Internal notification email");
}

// Resend's HTTP API directly (no SDK dependency required). Checks the
// actual response status — a fetch() promise resolves even on a 4xx/5xx
// response, it only rejects on a real network failure, so relying on
// .catch() alone silently swallows real send failures (e.g. Resend's
// testing-mode restriction: unverified accounts can only send to the
// account owner's own signup email, everything else 403s).
async function sendViaResend(
  apiKey: string,
  payload: { from: string; to: string; subject: string; text: string },
  logLabel: string,
) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`${logLabel} failed: ${res.status} ${res.statusText} — ${body}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`${logLabel} failed:`, err);
    return false;
  }
}

// Groups the 40+ categories into a few broad voices so the visitor email
// reads like it was written for THIS enquiry rather than a generic form
// letter, without hand-writing bespoke copy per category. Medical stuff
// gets a reassuring tone, legal/financial gets a clarity-first tone, home
// services gets a practical no-hassle tone, lifestyle/luxury gets a warmer,
// more indulgent tone. Anything uncategorised falls back to the default.
const MEDICAL_CATEGORIES = new Set<CategorySlug>([
  "dentist", "dermatologist", "doctor", "physiotherapist", "psychologist",
  "chiropractor", "acupuncturist", "nutritionist", "naturopath",
  "holistic-doctor", "veterinarian", "lasik", "fertility-clinic",
  "plastic-surgeon", "obgyn-midwife", "pediatrician", "osteopath",
  "orthodontist", "podiatrist", "eye-care", "occupational-therapist",
  "speech-therapist", "family-therapist",
]);
const LEGAL_FINANCIAL_CATEGORIES = new Set<CategorySlug>([
  "lawyer", "tax-advisor", "property-advisor", "autonomo-accountant",
  "business-lawyer", "sworn-translator", "insurance-broker",
  "wealth-manager", "notary",
]);
const HOME_SERVICE_CATEGORIES = new Set<CategorySlug>([
  "air-conditioning", "locksmith", "appliance-repair", "pest-control",
  "balcony-terrace-design", "storage-service", "house-clearance",
]);
const LIFESTYLE_CATEGORIES = new Set<CategorySlug>([
  "personal-trainer", "driving-school", "private-chauffeur",
  "wedding-planner", "recruiter", "private-chef",
]);

function matchIntro(categorySlug: CategorySlug, categoryLabel: string, areaLabel: string): string {
  if (MEDICAL_CATEGORIES.has(categorySlug)) {
    return `Sorted — here's your shortlist of English-speaking ${categoryLabel} in ${areaLabel}, so you can explain what's actually going on without a language barrier getting in the way.`;
  }
  if (LEGAL_FINANCIAL_CATEGORIES.has(categorySlug)) {
    return `Here's your shortlist of English-speaking ${categoryLabel} in ${areaLabel} — people who'll walk you through it in plain English, not just correct Spanish.`;
  }
  if (HOME_SERVICE_CATEGORIES.has(categorySlug)) {
    return `Here's your shortlist of English-speaking ${categoryLabel} in ${areaLabel}, ready to help sort things out without you needing to explain yourself twice.`;
  }
  if (LIFESTYLE_CATEGORIES.has(categorySlug)) {
    return `Here's your shortlist of English-speaking ${categoryLabel} in ${areaLabel} — the fun part starts now.`;
  }
  return `Here's your shortlist of English-speaking ${categoryLabel} in ${areaLabel}.`;
}

// Emails the VISITOR their matched list — this is the actual deliverable
// promised on the site ("we'll send you the vetted list"). Fully
// automatable, unlike WhatsApp (see note on notifyEmail below): a business
// can't message someone on WhatsApp first without the WhatsApp Business
// Platform (Cloud API + approved templates) — plain wa.me links only let
// the *customer* start the conversation. Email has no such restriction.
async function sendMatchEmailToVisitor(lead: LeadPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.LEAD_FROM_EMAIL || "leads@barcelonaenglishpros.com";
  if (!apiKey) {
    console.log("[lead] Visitor match email skipped — RESEND_API_KEY not set.");
    return;
  }

  const area = getArea(lead.areaSlug);
  const category = getCategory(lead.categorySlug);
  const matches = getProfessionals(lead.areaSlug, lead.categorySlug);
  if (matches.length === 0) {
    // No listing yet for this combination — this is the concierge case,
    // handled by a human following up on WhatsApp/email, not an automated send.
    return;
  }

  // Ranked (partners first, per getProfessionals) with everything the
  // on-page cards intentionally leave out: a Maps link and, only where
  // we've actually verified pricing, a cost comparison. `priceRange` is
  // unset for most listings today, we don't guess at prices we haven't
  // confirmed, so those rows just omit that line rather than show a
  // fabricated figure.
  const listText = matches
    .map((p, i) => {
      const lines = [
        `${i + 1}. ${p.name}`,
        `   ${p.specialties.join(", ")}`,
        p.priceRange ? `   Price: ${p.priceRange}` : undefined,
        `   Speaks: ${p.languages.join(", ")}`,
        `   Map: ${googleMapsSearchUrl(p)}`,
        p.bookingUrl ? `   Website: ${p.bookingUrl}` : undefined,
        p.phoneDisplay ? `   Phone: ${p.phoneDisplay}` : undefined,
      ];
      return lines.filter(Boolean).join("\n");
    })
    .join("\n\n");

  const firstName = lead.name.trim().split(/\s+/)[0] || lead.name;
  const categoryLabel = (category?.pluralName ?? "professionals").toLowerCase();
  const categoryLabelSingular = (category?.name ?? "professional").toLowerCase();
  const areaLabel = area?.name ?? "your area";

  const text = [
    `Hi ${firstName},`,
    ``,
    matchIntro(lead.categorySlug, categoryLabel, areaLabel),
    ``,
    listText,
    ``,
    `—`,
    ``,
    `One small favour: when you reach out, mention you found them through Barcelona English Pros. It costs you nothing, it's how we keep this free, and it's the only way the good ones ever find out we sent you.`,
    ``,
    `Know someone else hunting for an English-speaking ${categoryLabelSingular} — or anything else — in Barcelona? Forward this email or point them to barcelonaenglishpros.com. Free for them too.`,
    ``,
    `Want a hand choosing? Just reply to this email or message us on WhatsApp.`,
    ``,
    `¡Suerte!`,
    `Barcelona English Pros`,
  ].join("\n");

  await sendViaResend(
    apiKey,
    {
      from: fromEmail,
      to: lead.email,
      subject: `Your English-speaking ${categoryLabelSingular} shortlist for ${areaLabel} 🎉`,
      text,
    },
    "[lead] Visitor match email",
  );
}

function formatLeadText(lead: LeadPayload): string {
  const area = getArea(lead.areaSlug)?.name ?? lead.areaSlug;
  const category = getCategory(lead.categorySlug)?.name ?? lead.categorySlug;
  return [
    `New enquiry via Barcelona English Pros`,
    ``,
    `Service: ${category}`,
    `Area: ${area}`,
    `Need: ${lead.need}`,
    `Urgency: ${lead.urgency}`,
    `Name: ${lead.name}`,
    `WhatsApp: ${lead.whatsapp}`,
    `Email: ${lead.email}`,
    lead.notes ? `Notes: ${lead.notes}` : undefined,
    `Page: ${lead.pageUrl}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function isValidLead(body: unknown): body is LeadPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.areaSlug === "string" &&
    typeof b.categorySlug === "string" &&
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.whatsapp === "string" &&
    b.whatsapp.trim().length >= 6 &&
    // both required: WhatsApp is fast, email is the fallback when someone
    // doesn't have/use WhatsApp, so we need a way to reach them either way
    typeof b.email === "string" &&
    b.email.includes("@") &&
    // Enforced here, not just a disabled button client-side — a disabled
    // button is trivially bypassable by anyone calling this endpoint
    // directly, and consent has to actually have been given to be real.
    b.consent === true
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field. A filled value
  // means a bot submitted the form. Return success so the bot doesn't learn
  // to work around it, but skip validation, storage and every notification.
  const honeypot = body && typeof body === "object" ? (body as Record<string, unknown>).company : undefined;
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!isValidLead(body)) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const area = getArea(body.areaSlug);
  const category = getCategory(body.categorySlug);
  if (!area || !category) {
    return NextResponse.json({ error: "Unknown area or category" }, { status: 400 });
  }

  const lead = { ...body, receivedAt: new Date().toISOString() };

  try {
    await saveLead(lead);
  } catch (err) {
    console.error("[lead] Failed to persist lead:", err);
    // Don't fail the request just because local storage failed — the
    // notification path below is the more important delivery mechanism.
  }

  await Promise.all([notifyEmail(body), sendMatchEmailToVisitor(body)]);

  return NextResponse.json({ ok: true });
}
