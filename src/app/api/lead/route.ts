import { NextResponse, type NextRequest } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getArea, getCategory } from "@/lib/data";
import type { LeadPayload } from "@/lib/types";

// -----------------------------------------------------------------------
// Storage: local JSON-lines file for development. This does NOT persist on
// most serverless hosts (e.g. Vercel's filesystem is read-only outside
// /tmp) — before going live, swap `saveLead` for a real store (Postgres,
// Supabase, Airtable) and wire `notifyEmail`/`notifyWhatsApp` up to actual
// providers (e.g. Resend, Twilio/WhatsApp Business API).
// -----------------------------------------------------------------------

const LEADS_FILE = path.join(process.cwd(), "data", "leads.jsonl");

async function saveLead(lead: LeadPayload & { receivedAt: string }) {
  await mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await appendFile(LEADS_FILE, JSON.stringify(lead) + "\n", "utf8");
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
  // Example using Resend's HTTP API directly (no SDK dependency required):
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL || "leads@bcnenglishpros.com",
      to,
      subject: `New lead: ${lead.categorySlug} in ${lead.areaSlug}`,
      text: formatLeadText(lead),
    }),
  }).catch((err) => console.error("[lead] Email send failed:", err));
}

function formatLeadText(lead: LeadPayload): string {
  const area = getArea(lead.areaSlug)?.name ?? lead.areaSlug;
  const category = getCategory(lead.categorySlug)?.name ?? lead.categorySlug;
  return [
    `New enquiry via BCN English Pros`,
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

  await notifyEmail(body);

  return NextResponse.json({ ok: true });
}
