import { readFile } from "node:fs/promises";
import path from "node:path";
import { getArea, getCategory } from "@/lib/data";
import { isDatabaseConfigured, listLeads } from "@/lib/db";
import type { LeadPayload } from "@/lib/types";

type ViewLead = LeadPayload & { receivedAt: string; consentedAt?: string | null };

// Internal leads viewer. Reads from the real database when DATABASE_URL is
// set (see src/lib/db.ts); otherwise falls back to the local JSONL file,
// which only ever has data in local dev. Gated by a shared secret query
// param — replace with real auth before this is a production admin tool.
export default async function AdminLeadsPage(props: PageProps<"/admin/leads">) {
  const searchParams = await props.searchParams;
  const secret = process.env.ADMIN_SECRET;
  const provided = typeof searchParams.key === "string" ? searchParams.key : undefined;

  if (secret && provided !== secret) {
    return (
      <div className="container-page py-16 max-w-md mx-auto text-center">
        <h1 className="text-xl font-semibold mb-2">Restricted</h1>
        <p className="text-sm text-foreground/60">
          Add <code>?key=YOUR_ADMIN_SECRET</code> to the URL to view leads.
        </p>
      </div>
    );
  }

  const usingDatabase = isDatabaseConfigured();
  let leads: ViewLead[] = [];

  if (usingDatabase) {
    const rows = await listLeads();
    leads = rows.map((r) => ({
      areaSlug: r.areaSlug as ViewLead["areaSlug"],
      categorySlug: r.categorySlug as ViewLead["categorySlug"],
      need: r.need ?? "",
      urgency: (r.urgency ?? "flexible") as ViewLead["urgency"],
      name: r.name,
      whatsapp: r.whatsapp,
      email: r.email,
      notes: r.notes ?? undefined,
      pageUrl: r.pageUrl ?? "",
      receivedAt: r.receivedAt,
      consent: !!r.consentedAt,
      consentedAt: r.consentedAt,
    }));
  } else {
    try {
      const raw = await readFile(path.join(process.cwd(), "data", "leads.jsonl"), "utf8");
      leads = raw
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line))
        .reverse();
    } catch {
      leads = [];
    }
  }

  return (
    <div className="container-page py-12">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold">Leads ({leads.length})</h1>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            usingDatabase ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          {usingDatabase ? "Live database" : "Local file only (not production-durable)"}
        </span>
      </div>
      {leads.length === 0 ? (
        <p className="text-foreground/60">No leads yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted text-left">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Need</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Consent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(lead.receivedAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{getCategory(lead.categorySlug)?.name ?? lead.categorySlug}</td>
                  <td className="px-4 py-3">{getArea(lead.areaSlug)?.name ?? lead.areaSlug}</td>
                  <td className="px-4 py-3">{lead.need}</td>
                  <td className="px-4 py-3">
                    {lead.urgency === "asap" ? (
                      <span className="text-red-600 font-semibold">🔥 ASAP</span>
                    ) : (
                      lead.urgency
                    )}
                  </td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">
                    <div>{lead.whatsapp}</div>
                    <div className="text-foreground/50">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {lead.consentedAt ? (
                      <span className="text-green-700" title={new Date(lead.consentedAt).toLocaleString()}>
                        ✓ {new Date(lead.consentedAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-foreground/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
