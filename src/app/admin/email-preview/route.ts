import { NextResponse, type NextRequest } from "next/server";
import { getArea, getCategory } from "@/lib/data";
import { getProfessionals } from "@/lib/professionals";
import { buildLeadNotificationEmail } from "@/lib/email/leadNotification";
import { EMAIL_SITE_URL, buildShortlistEmail } from "@/lib/email/shortlist";

// Renders the visitor shortlist email with sample data so it can be eyeballed
// in a browser (or fetched as JSON by scripts/send-test-email.mjs). Never
// sends anything. Gated by ADMIN_SECRET like /admin/leads.
//   /admin/email-preview?key=...&case=full|edge|testname&format=html|json|text
export async function GET(request: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  const url = new URL(request.url);
  if (secret && url.searchParams.get("key") !== secret) {
    return new NextResponse("Restricted", { status: 401 });
  }

  const sample = url.searchParams.get("case") ?? "full";
  const area = getArea("poblenou")!;
  const category = getCategory("wedding-planner")!;
  const all = getProfessionals("poblenou", "wedding-planner");

  const email = url.searchParams.get("type") === "lead"
    ? buildLeadNotificationEmail({
        categoryName: category.name,
        areaName: area.name,
        need: "Elopement / small ceremony",
        urgency: sample === "edge" ? "asap" : "this-week",
        name: "Sam Carter",
        whatsapp: "+34 600 123 456",
        email: "sam@example.com",
        notes: "Planning for October, about 20 guests.",
        pageUrl: "https://www.barcelonaenglishpros.com/poblenou/wedding-planner",
        matchCount: all.length,
      }) as ReturnType<typeof buildShortlistEmail>
    : buildShortlistEmail({
    name: sample === "full" ? "Sam Carter" : sample === "testname" ? "Test Lead" : undefined,
    categorySlug: category.slug,
    categoryName: category.name,
    categoryPluralName: category.pluralName,
    areaName: area.name,
    matches: sample === "edge" ? all.slice(0, 2) : all.slice(0, 5),
  });

  // ?local=1 points logo assets at this server, for previewing before they are deployed.
  if (url.searchParams.get("local") === "1") {
    email.html = email.html.replaceAll(`${EMAIL_SITE_URL}/email/`, `${url.origin}/email/`);
  }

  const format = url.searchParams.get("format") ?? "html";
  if (format === "json") return NextResponse.json(email);
  if (format === "text") return new NextResponse(email.text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new NextResponse(email.html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
