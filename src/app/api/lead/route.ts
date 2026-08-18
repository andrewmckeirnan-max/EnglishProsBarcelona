import { NextResponse, type NextRequest } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getArea, getCategory } from "@/lib/data";
import { getProfessionals } from "@/lib/professionals";
import { googleMapsSearchUrl } from "@/lib/maps";
import { insertLead, isDatabaseConfigured } from "@/lib/db";
import type { LeadPayload } from "@/lib/types";

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
    await insertLead(lead);
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
  // Example using Resend's HTTP API directly (no SDK dependency required):
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL || "leads@barcelonaenglishpros.com",
      to,
      subject: `${urgencyFlag}New lead: ${lead.categorySlug} in ${lead.areaSlug}`,
      text: formatLeadText(lead),
    }),
  }).catch((err) => console.error("[lead] Email send failed:", err));
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

  const text = [
    `Hi ${lead.name},`,
    ``,
    `Here's your ranked, vetted list of English-speaking ${category?.pluralName ?? "professionals"} in ${area?.name ?? "your area"}:`,
    ``,
    listText,
    ``,
    `No cost to you, reach out to whichever one fits best. Reply to this email or message us on WhatsApp if you'd like help choosing.`,
  ].join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: lead.email,
      subject: `Your vetted ${category?.name ?? "professional"} options in ${area?.name ?? "Barcelona"}`,
      text,
    }),
  }).catch((err) => console.error("[lead] Visitor match email failed:", err));
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
    b.email.includes("@")
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
