import { readFile } from "node:fs/promises";
import path from "node:path";
import { getArea, getCategory } from "@/lib/data";
import type { LeadPayload } from "@/lib/types";

// Minimal internal viewer for locally-stored leads (dev use only, see the
// storage note in src/app/api/lead/route.ts). Gated by a shared secret query
// param so it isn't wide open; replace with real auth before deploying.
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

  let leads: (LeadPayload & { receivedAt: string })[] = [];
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

  return (
    <div className="container-page py-12">
      <h1 className="text-2xl font-semibold mb-6">Leads ({leads.length})</h1>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(lead.receivedAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{getCategory(lead.categorySlug)?.name ?? lead.categorySlug}</td>
                  <td className="px-4 py-3">{getArea(lead.areaSlug)?.name ?? lead.areaSlug}</td>
                  <td className="px-4 py-3">{lead.need}</td>
                  <td className="px-4 py-3">{lead.urgency}</td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">
                    <div>{lead.whatsapp}</div>
                    <div className="text-foreground/50">{lead.email}</div>
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
