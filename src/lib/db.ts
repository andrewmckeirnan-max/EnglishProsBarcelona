import postgres from "postgres";

// Real, durable lead storage. Works with any standard Postgres provider —
// Supabase, Neon, Vercel Postgres, Railway, etc — via a single DATABASE_URL
// connection string. Nothing here is provider-specific.
//
// When DATABASE_URL isn't set (plain local dev with no database configured
// yet), every function below is a safe no-op / returns empty, and
// src/app/api/lead/route.ts falls back to the local JSONL file instead. This
// means the site still runs and can be tested end-to-end without a database,
// but leads from that mode do NOT persist on a real deployment — set
// DATABASE_URL before going live.

let sql: ReturnType<typeof postgres> | undefined;
let schemaReady: Promise<void> | undefined;

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  if (!sql) {
    sql = postgres(url, { ssl: "require", max: 3 });
  }
  return sql;
}

// Creates the table on first use if it doesn't exist yet — no separate
// migration step required. Safe to call on every request; Postgres no-ops
// `CREATE TABLE IF NOT EXISTS` when it's already there.
function ensureSchema(client: ReturnType<typeof postgres>) {
  if (!schemaReady) {
    schemaReady = client`
      CREATE TABLE IF NOT EXISTS leads (
        id BIGSERIAL PRIMARY KEY,
        received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        area_slug TEXT NOT NULL,
        category_slug TEXT NOT NULL,
        need TEXT,
        urgency TEXT,
        name TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        email TEXT NOT NULL,
        notes TEXT,
        page_url TEXT,
        -- Set later by whoever follows up, for the "did they actually book"
        -- attribution loop. Not written by the public lead endpoint.
        status TEXT NOT NULL DEFAULT 'new'
      )
    `
      // ALTER ... IF NOT EXISTS rather than baking this into the CREATE TABLE
      // above, since that only runs for a brand-new table — the real table
      // already exists in production, so new columns need to be added to it
      // directly. Timestamp, not a plain boolean: proof of *when* consent
      // was given is what actually matters if this is ever questioned.
      .then(() => client`ALTER TABLE leads ADD COLUMN IF NOT EXISTS consented_at TIMESTAMPTZ`)
      .then(() => undefined);
  }
  return schemaReady;
}

export interface StoredLead {
  id: number;
  receivedAt: string;
  areaSlug: string;
  categorySlug: string;
  need: string | null;
  urgency: string | null;
  name: string;
  whatsapp: string;
  email: string;
  notes: string | null;
  pageUrl: string | null;
  status: string;
  consentedAt: string | null;
}

export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

export async function insertLead(lead: {
  areaSlug: string;
  categorySlug: string;
  need?: string;
  urgency?: string;
  name: string;
  whatsapp: string;
  email: string;
  notes?: string;
  pageUrl?: string;
  consentedAt: string;
}): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  await ensureSchema(client);
  await client`
    INSERT INTO leads (area_slug, category_slug, need, urgency, name, whatsapp, email, notes, page_url, consented_at)
    VALUES (${lead.areaSlug}, ${lead.categorySlug}, ${lead.need ?? null}, ${lead.urgency ?? null},
            ${lead.name}, ${lead.whatsapp}, ${lead.email}, ${lead.notes ?? null}, ${lead.pageUrl ?? null},
            ${lead.consentedAt})
  `;
  return true;
}

export async function listLeads(): Promise<StoredLead[]> {
  const client = getClient();
  if (!client) return [];
  await ensureSchema(client);
  const rows = await client`SELECT * FROM leads ORDER BY received_at DESC`;
  return rows.map((r) => ({
    id: r.id,
    receivedAt: r.received_at instanceof Date ? r.received_at.toISOString() : String(r.received_at),
    areaSlug: r.area_slug,
    categorySlug: r.category_slug,
    need: r.need,
    urgency: r.urgency,
    name: r.name,
    whatsapp: r.whatsapp,
    email: r.email,
    notes: r.notes,
    pageUrl: r.page_url,
    status: r.status,
    consentedAt: r.consented_at instanceof Date ? r.consented_at.toISOString() : r.consented_at,
  }));
}
