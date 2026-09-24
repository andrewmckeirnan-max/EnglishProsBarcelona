import { C, EMAIL_SITE_URL, FONT, button, esc } from "@/lib/email/shortlist";

export interface LeadNotificationInput {
  categoryName: string;
  areaName: string;
  need: string;
  urgency: "asap" | "this-week" | "flexible";
  name: string;
  whatsapp: string;
  email: string;
  notes?: string;
  pageUrl: string;
  matchCount: number;
}

const URGENCY_LABEL = { asap: "As soon as possible", "this-week": "This week", flexible: "Flexible" } as const;

/** Branded internal "new lead" email, same look as the visitor shortlist. */
export function buildLeadNotificationEmail(lead: LeadNotificationInput) {
  const asap = lead.urgency === "asap";
  const waDigits = lead.whatsapp.replace(/[^0-9]/g, "");
  const waHref = waDigits.length >= 8
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(`Hi ${lead.name.split(/\s+/)[0]}, it's Barcelona English Pros. Thanks for your ${lead.categoryName.toLowerCase()} enquiry in ${lead.areaName}.`)}`
    : null;
  const mailHref = `mailto:${lead.email}?subject=${encodeURIComponent(`Your ${lead.categoryName.toLowerCase()} enquiry in ${lead.areaName}`)}`;

  const subject = `${asap ? "ASAP: " : ""}New lead: ${lead.categoryName} in ${lead.areaName}`;
  const preheader = `${lead.name} wants a ${lead.categoryName.toLowerCase()} in ${lead.areaName}. ${URGENCY_LABEL[lead.urgency]}.`;

  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:10px 0;border-bottom:1px solid ${C.border};width:120px;vertical-align:top;font-family:${FONT};font-size:11px;letter-spacing:0.08em;font-weight:bold;color:${C.muted};text-transform:uppercase;">${label}</td><td style="padding:10px 0;border-bottom:1px solid ${C.border};font-family:${FONT};font-size:16px;line-height:22px;color:${C.ink};">${value}</td></tr>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="en-GB" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title>
<style>@media only screen and (max-width:620px){.container{width:100%!important}.px{padding-left:16px!important;padding-right:16px!important}}</style></head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.page};opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="width:600px;max-width:600px;">
  <tr><td align="center" style="background:${C.brandDark};padding:22px 24px;">
    <a href="${EMAIL_SITE_URL}" target="_blank"><img src="${EMAIL_SITE_URL}/email/logo-white.png" width="180" height="42" alt="Barcelona English Pros" style="display:block;width:180px;height:42px;font-family:${FONT};font-size:16px;font-weight:bold;color:#ffffff;"></a>
  </td></tr>
  <tr><td class="px" style="background:${asap ? C.accent : C.brand};padding:34px 32px 36px 32px;">
    <span style="display:inline-block;background:${asap ? C.accentInk : C.accent};color:${asap ? C.accent : C.accentInk};font-family:${FONT};font-size:12px;line-height:14px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;padding:7px 12px;border-radius:999px;">${asap ? "ASAP lead" : "New lead"}</span>
    <h1 style="margin:16px 0 0 0;font-family:${FONT};font-size:32px;line-height:36px;font-weight:bold;letter-spacing:-0.5px;color:${asap ? C.accentInk : "#ffffff"};">${esc(lead.name)} wants a ${esc(lead.categoryName.toLowerCase())} in ${esc(lead.areaName)}.</h1>
    <p style="margin:10px 0 0 0;font-family:${FONT};font-size:17px;line-height:24px;color:${asap ? C.accentInk : C.lilac};">${esc(URGENCY_LABEL[lead.urgency])}. Reply fast, first response wins.</p>
  </td></tr>
  <tr><td class="px" style="padding:26px 32px 8px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.card};border:1px solid ${C.border};border-radius:18px;"><tr><td style="padding:10px 24px 14px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${row("Service", esc(lead.categoryName))}
        ${row("Area", esc(lead.areaName))}
        ${row("Need", esc(lead.need || "Not specified"))}
        ${row("Urgency", esc(URGENCY_LABEL[lead.urgency]))}
        ${row("WhatsApp", esc(lead.whatsapp))}
        ${row("Email", esc(lead.email))}
        ${row("Notes", esc(lead.notes ?? ""))}
        ${row("Matches shown", String(lead.matchCount))}
      </table>
    </td></tr></table>
  </td></tr>
  <tr><td class="px" style="padding:16px 32px 8px 32px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      ${waHref ? `<td style="padding:0 10px 10px 0;">${button({ href: waHref, label: "WhatsApp them", kind: "primary", width: 170 })}</td>` : ""}
      <td style="padding:0 0 10px 0;">${button({ href: mailHref, label: "Email them", kind: "ghost", width: 150 })}</td>
    </tr></table>
  </td></tr>
  <tr><td class="px" style="padding:12px 32px 40px 32px;font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted};">Submitted from <a href="${esc(lead.pageUrl)}" target="_blank" style="color:${C.brand};font-weight:bold;">${esc(lead.pageUrl)}</a></td></tr>
</table></td></tr></table>
</body></html>`;

  const text = [
    `${asap ? "ASAP lead" : "New lead"}: ${lead.name} wants a ${lead.categoryName.toLowerCase()} in ${lead.areaName}.`,
    "",
    `Service: ${lead.categoryName}`,
    `Area: ${lead.areaName}`,
    `Need: ${lead.need || "Not specified"}`,
    `Urgency: ${URGENCY_LABEL[lead.urgency]}`,
    `WhatsApp: ${lead.whatsapp}`,
    `Email: ${lead.email}`,
    lead.notes ? `Notes: ${lead.notes}` : "",
    `Matches shown: ${lead.matchCount}`,
    `Page: ${lead.pageUrl}`,
  ].filter(Boolean).join("\n");

  return { subject, html, text };
}
