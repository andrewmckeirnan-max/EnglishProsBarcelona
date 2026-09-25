import type { CategorySlug, Professional } from "@/lib/types";
import { costsForCategory, formatRange } from "@/lib/costData";
import { googleMapsSearchUrl } from "@/lib/maps";
import { sentenceLower } from "@/lib/text";
import { BUSINESS_WHATSAPP_NUMBER, SUPPORT_EMAIL, WHATSAPP_CONFIGURED, waLink } from "@/lib/whatsapp";

// Absolute www URLs on purpose: the apex domain 308-redirects to www, and
// some mail clients' image proxies don't follow redirects.
export const EMAIL_SITE_URL = "https://www.barcelonaenglishpros.com";
const LOGO_WHITE_URL = `${EMAIL_SITE_URL}/email/logo-white.png`;

// Brand palette, from src/app/globals.css, plus one warm accent used only in
// emails (badges, the "small favour" block).
export const C = {
  brand: "#5b21b6",
  brandDark: "#3f1671",
  lilac: "#f3ecff",
  ink: "#1a1523",
  muted: "#6b6480",
  border: "#e8e3f2",
  page: "#faf6ef",
  card: "#ffffff",
  accent: "#ffb020",
  accentInk: "#2a1a00",
};

export const FONT = "Helvetica, Arial, sans-serif";

export interface ShortlistInput {
  name?: string;
  /** Used to add typical Barcelona prices for the profession, when we have them. */
  categorySlug?: CategorySlug;
  categoryName: string;
  categoryPluralName: string;
  areaName: string;
  matches: Professional[];
  /** Optional profession-flavoured intro line (used when there are 3+ matches). */
  intro?: string;
}

export interface ShortlistEmail {
  subject: string;
  subjectOptions: { straight: string[]; playful: string[]; curiosity: string[] };
  preheader: string;
  html: string;
  text: string;
}

// ---------------------------------------------------------------- helpers

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

const PLACEHOLDER_NAMES = new Set([
  "test", "tester", "testing", "asdf", "qwerty", "name", "na", "none", "null", "anonymous", "user", "guest", "hello", "hi", "lead", "demo", "sample", "xxx",
]);

/** First name if it looks like a real one, otherwise null (caller says "Hi there"). */
export function usableFirstName(name?: string): string | null {
  const first = (name ?? "").trim().split(/\s+/)[0] ?? "";
  if (first.length < 2 || first.length > 30) return null;
  if (/[0-9@_/\\]/.test(first)) return null;
  if (!/\p{L}/u.test(first)) return null;
  if (PLACEHOLDER_NAMES.has(first.toLowerCase())) return null;
  // Any token of the full name being a placeholder ("Test Lead", "Lead Two") is a test entry.
  const tokens = (name ?? "").toLowerCase().split(/\s+/);
  if (tokens.some((t) => t === "test" || t === "tester" || t === "testing")) return null;
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function withUtm(url: string, content: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "barcelonaenglishpros");
    u.searchParams.set("utm_medium", "email");
    u.searchParams.set("utm_campaign", "shortlist");
    u.searchParams.set("utm_content", content);
    return u.toString();
  } catch {
    return url;
  }
}

function splitList(items: string[], max: number): string[] {
  return items.map((s) => s.trim()).filter(Boolean).slice(0, max);
}

function languagesEnglishFirst(langs: string[]): string[] {
  const clean = Array.from(new Set(langs.map((l) => l.trim()).filter(Boolean)));
  return [...clean.filter((l) => /^english$/i.test(l)), ...clean.filter((l) => !/^english$/i.test(l))];
}

function pillsHtml(items: string[], kind: "topic" | "lang"): string {
  const bg = kind === "lang" ? C.brand : C.lilac;
  const fg = kind === "lang" ? "#ffffff" : C.brandDark;
  const cls = kind === "lang" ? "pill-lang" : "pill";
  return items
    .map(
      (t) =>
        `<span class="${cls}" style="display:inline-block;background:${bg};color:${fg};font-family:${FONT};font-size:12px;line-height:16px;font-weight:bold;padding:5px 11px;border-radius:999px;margin:0 6px 6px 0;">${esc(t)}</span>`,
    )
    .join("");
}

/** Bulletproof button: real link for modern clients, VML roundrect for Outlook desktop. */
export function button(opts: { href: string; label: string; kind: "primary" | "ghost" | "accent"; width: number }): string {
  const { href, label, kind, width } = opts;
  const fill = kind === "primary" ? C.brand : kind === "accent" ? C.ink : "#ffffff";
  const stroke = kind === "ghost" ? C.brand : fill;
  const color = kind === "ghost" ? C.brand : "#ffffff";
  const cls = kind === "ghost" ? "btn-a btn-ghost" : "btn-a";
  const h = esc(href);
  const l = esc(label);
  return `<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${h}" style="height:46px;v-text-anchor:middle;width:${width}px;" arcsize="50%" strokecolor="${stroke}" strokeweight="2px" fillcolor="${fill}"><w:anchorlock/><center style="color:${color};font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${l}</center></v:roundrect><![endif]--><!--[if !mso]><!--><a class="${cls}" href="${h}" target="_blank" style="display:inline-block;background:${fill};border:2px solid ${stroke};color:${color};font-family:${FONT};font-size:15px;line-height:20px;font-weight:bold;text-decoration:none;text-align:center;padding:11px 24px;border-radius:999px;mso-hide:all;">${l}</a><!--<![endif]-->`;
}

function noun(input: ShortlistInput, n: number): string {
  return sentenceLower(n === 1 ? input.categoryName : input.categoryPluralName);
}

// --------------------------------------------------------------- subjects

function buildSubjects(input: ShortlistInput) {
  const n = input.matches.length;
  const a = input.areaName;
  const many = noun(input, n);
  const one = sentenceLower(input.categoryName);
  const count = n === 1 ? "1 English-speaking " + one : `${n} English-speaking ${many}`;
  return {
    straight: [
      `Your ${count} in ${a}`,
      `Your English-speaking ${one} shortlist for ${a}`,
      `${a}: your ${one} shortlist is ready`,
    ],
    playful: [
      `${a}, sorted. Meet your ${n} ${many}`,
      `We did the legwork: ${n} ${many} in ${a}`,
      `${n} ${many} who actually speak English (${a})`,
    ],
    curiosity: [
      `Who should you call first in ${a}?`,
      `${n} names for your ${a} ${one} search. One stands out`,
      `The ${one} shortlist we wish we'd had`,
    ],
  };
}

// ------------------------------------------------------------------- html

export function buildShortlistEmail(input: ShortlistInput): ShortlistEmail {
  const { matches, areaName } = input;
  const n = matches.length;
  const first = usableFirstName(input.name);
  const greeting = first ? `Hi ${first}.` : "Hi there.";
  const a = areaName;
  const many = noun(input, n);
  const one = sentenceLower(input.categoryName);
  const subjectOptions = buildSubjects(input);
  const subject = subjectOptions.straight[0];

  const countLine = n === 1 ? "1 English-speaking " + one : `${n} English-speaking ${many}`;
  const preheader = `${countLine} in ${a}, picked for you.`;
  const heroHeadline = `Your ${a} ${one} shortlist is ready.`;
  const heroSub =
    n >= 3
      ? `${n} pros who speak your language. Literally.`
      : n === 2
        ? "We found 2 great options. Both speak your language. Literally."
        : "We found 1 standout. They speak your language. Literally.";
  const intro =
    n >= 3
      ? (input.intro ?? "Here they are. Every one checked by us, every one happy to help in English.")
      : "Fewer than usual, but they're good ones. Checked by us, happy to help in English.";

  const homeUrl = withUtm(EMAIL_SITE_URL, "header");
  const shareUrl = withUtm(EMAIL_SITE_URL, "share");

  // Help block: WhatsApp when a number is configured, otherwise reply-by-email.
  const helpHref = WHATSAPP_CONFIGURED
    ? waLink(BUSINESS_WHATSAPP_NUMBER, `Hi! I got my ${one} shortlist for ${a} and need a hand choosing.`)
    : `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Help choosing a ${one} in ${a}`)}`;
  const helpLabel = WHATSAPP_CONFIGURED ? "Message us on WhatsApp" : "Email us";
  const helpCopy = WHATSAPP_CONFIGURED
    ? "Reply to this email or message us on WhatsApp."
    : n < 3
      ? "Reply to this email and we'll look further for you."
      : "Reply to this email and we'll help you choose.";

  // Typical prices block: sourced ranges from the cost checker data, when the profession has any.
  const priceItems = input.categorySlug ? costsForCategory(input.categorySlug).slice(0, 4) : [];
  const costUrl = withUtm(`${EMAIL_SITE_URL}/cost-checker`, "prices");
  const priceBlock = priceItems.length
    ? `
  <tr><td class="px" style="padding:0 32px 16px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-card" style="background:${C.card};border:1px solid ${C.border};border-radius:18px;"><tr><td style="padding:22px 24px;">
      <div class="t-ink" style="font-family:${FONT};font-size:20px;line-height:24px;font-weight:bold;color:${C.ink};">What it typically costs in Barcelona</div>
      ${priceItems.map((c) => `<div class="t-ink" style="margin-top:10px;font-family:${FONT};font-size:15px;line-height:22px;color:${C.ink};">${esc(c.service)}: <b>${esc(formatRange(c))}</b> <span class="t-muted" style="color:${C.muted};">${esc(c.unit)}</span></div>`).join("")}
      <div class="t-muted" style="margin:12px 0 14px 0;font-family:${FONT};font-size:13px;line-height:19px;color:${C.muted};">Published ranges from sources checked in 2026, not quotes. Prices vary by clinic.</div>
      ${button({ href: costUrl, label: "Check a quote", kind: "ghost", width: 170 })}
    </td></tr></table>
  </td></tr>`
    : "";
  const textPrices = priceItems.length
    ? [
        "WHAT IT TYPICALLY COSTS IN BARCELONA",
        ...priceItems.map((c) => `- ${c.service}: ${formatRange(c)} (${c.unit})`),
        "Published ranges, not quotes. Check a quote: " + costUrl,
        "",
      ].join("\n")
    : "";

  const cards = matches
    .map((p, i) => {
      const topics = splitList(p.specialties, 3);
      const langs = languagesEnglishFirst(p.languages);
      const site = p.bookingUrl ? withUtm(p.bookingUrl, p.id) : null;
      const map = googleMapsSearchUrl(p, a);
      const why = p.bio ? esc(p.bio) : "";
      const meta = [p.priceRange ? `Price: ${esc(p.priceRange)}` : "", p.phoneDisplay ? `Phone: ${esc(p.phoneDisplay)}` : ""]
        .filter(Boolean)
        .join(" &nbsp;&middot;&nbsp; ");
      const buttons = [
        site ? `<td class="btn-cell" style="padding:0 10px 10px 0;">${button({ href: site, label: "Visit website", kind: "primary", width: 170 })}</td>` : "",
        `<td class="btn-cell" style="padding:0 0 10px 0;">${button({ href: map, label: "View on map", kind: "ghost", width: 150 })}</td>`,
      ].join("");
      return `
<tr><td class="px" style="padding:0 32px 16px 32px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-card" style="background:${C.card};border:1px solid ${C.border};border-radius:18px;">
    <tr><td style="padding:22px 22px 8px 22px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td width="40" height="40" align="center" valign="middle" style="width:40px;height:40px;background:${C.accent};border-radius:20px;font-family:${FONT};font-size:18px;font-weight:bold;color:${C.accentInk};">${i + 1}</td>
        <td class="t-ink" style="padding-left:14px;font-family:${FONT};font-size:20px;line-height:24px;font-weight:bold;color:${C.ink};">${esc(p.name)}</td>
      </tr></table>
    </td></tr>
    ${topics.length ? `<tr><td style="padding:8px 22px 0 22px;">${pillsHtml(topics, "topic")}</td></tr>` : ""}
    ${langs.length ? `<tr><td style="padding:2px 22px 0 22px;">${pillsHtml(langs, "lang")}</td></tr>` : ""}
    ${why ? `<tr><td class="t-muted" style="padding:6px 22px 0 22px;font-family:${FONT};font-size:14px;line-height:21px;color:${C.muted};">${why}</td></tr>` : ""}
    ${meta ? `<tr><td class="t-muted" style="padding:6px 22px 0 22px;font-family:${FONT};font-size:13px;line-height:19px;color:${C.muted};">${meta}</td></tr>` : ""}
    <tr><td style="padding:14px 22px 12px 22px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn-row"><tr>${buttons}</tr></table></td></tr>
  </table>
</td></tr>`;
    })
    .join("\n");

  const chip = (label: string, value: string) =>
    `<span class="chip" style="display:inline-block;background:${C.card};border:1px solid ${C.border};border-radius:999px;padding:8px 14px;margin:0 8px 8px 0;font-family:${FONT};font-size:14px;line-height:18px;"><span class="t-muted" style="color:${C.muted};font-size:11px;letter-spacing:0.08em;font-weight:bold;">${label}</span>&nbsp;&nbsp;<b class="t-ink" style="color:${C.ink};">${esc(value)}</b></span>`;

  const html = `<!DOCTYPE html>
<html lang="en-GB" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(subject)}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style>
  body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table{border-collapse:collapse;}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
  a{text-decoration:none;}
  @media only screen and (max-width:620px){
    .container{width:100%!important;}
    .px{padding-left:16px!important;padding-right:16px!important;}
    .hero-px{padding-left:22px!important;padding-right:22px!important;}
    .h1{font-size:34px!important;line-height:38px!important;}
    .btn-row{width:100%!important;}
    .btn-cell{display:block!important;width:100%!important;padding:0 0 10px 0!important;}
    .btn-a{display:block!important;width:auto!important;}
  }
  @media (prefers-color-scheme:dark){
    .bg-page{background:#120e1b!important;}
    .bg-card{background:#1e1830!important;border-color:#3a2f55!important;}
    .t-ink{color:#f5f0ff!important;}
    .t-muted{color:#c9bfe0!important;}
    .pill{background:#2d2350!important;color:#e6dcff!important;}
    .chip{background:#1e1830!important;border-color:#3a2f55!important;}
    .btn-ghost{background:transparent!important;color:#d9c2ff!important;border-color:#d9c2ff!important;}
  }
  [data-ogsc] .t-ink{color:#f5f0ff!important;}
  [data-ogsc] .t-muted{color:#c9bfe0!important;}
  [data-ogsb] .bg-page{background:#120e1b!important;}
  [data-ogsb] .bg-card{background:#1e1830!important;}
</style>
</head>
<body class="bg-page" style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.page};opacity:0;">${esc(preheader)}${"&nbsp;&zwnj;".repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-page" style="background:${C.page};"><tr><td align="center">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="width:600px;max-width:600px;">

  <tr><td align="center" style="background:${C.brandDark};padding:22px 24px;">
    <a href="${esc(homeUrl)}" target="_blank"><img src="${LOGO_WHITE_URL}" width="180" height="42" alt="Barcelona English Pros" style="display:block;width:180px;height:42px;font-family:${FONT};font-size:16px;font-weight:bold;color:#ffffff;"></a>
  </td></tr>

  <tr><td class="hero-px" style="background:${C.brand};padding:44px 32px 46px 32px;">
    <span style="display:inline-block;background:${C.accent};color:${C.accentInk};font-family:${FONT};font-size:12px;line-height:14px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;padding:7px 12px;border-radius:999px;">Made for you</span>
    <h1 class="h1" style="margin:18px 0 0 0;font-family:${FONT};font-size:44px;line-height:48px;font-weight:bold;letter-spacing:-1px;color:#ffffff;">${esc(heroHeadline)}</h1>
    <p style="margin:16px 0 0 0;font-family:${FONT};font-size:19px;line-height:27px;color:${C.lilac};">${esc(heroSub)}</p>
  </td></tr>

  <tr><td class="px" style="padding:26px 32px 6px 32px;">
    ${chip("WHAT", sentenceLower(input.categoryName))}${chip("WHERE", a)}${chip("MATCHES", String(n))}
  </td></tr>

  <tr><td class="px t-ink" style="padding:14px 32px 20px 32px;font-family:${FONT};font-size:17px;line-height:26px;color:${C.ink};">
    <b>${esc(greeting)}</b> ${esc(intro)}
  </td></tr>
${priceBlock}
${cards}

  <tr><td class="px" style="padding:12px 32px 16px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.accent};border-radius:18px;"><tr><td style="padding:24px 24px 26px 24px;">
      <div style="font-family:${FONT};font-size:22px;line-height:26px;font-weight:bold;color:${C.accentInk};">One small favour.</div>
      <div style="margin-top:8px;font-family:${FONT};font-size:16px;line-height:24px;color:${C.accentInk};">Mention Barcelona English Pros when you get in touch. It costs you nothing, keeps this service free, and tells the good ones we sent you.</div>
    </td></tr></table>
  </td></tr>

  <tr><td class="px" style="padding:0 32px 16px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-card" style="background:${C.card};border:1px solid ${C.border};border-radius:18px;"><tr><td style="padding:24px;">
      <div class="t-ink" style="font-family:${FONT};font-size:20px;line-height:24px;font-weight:bold;color:${C.ink};">Stuck choosing?</div>
      <div class="t-muted" style="margin:6px 0 16px 0;font-family:${FONT};font-size:15px;line-height:23px;color:${C.muted};">${esc(helpCopy)}</div>
      ${button({ href: helpHref, label: helpLabel, kind: "primary", width: 220 })}
    </td></tr></table>
  </td></tr>

  <tr><td class="px" style="padding:0 32px 8px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-card" style="background:${C.card};border:1px solid ${C.border};border-radius:18px;"><tr><td style="padding:24px;">
      <div class="t-ink" style="font-family:${FONT};font-size:20px;line-height:24px;font-weight:bold;color:${C.ink};">Know someone who needs an English speaker?</div>
      <div class="t-muted" style="margin:6px 0 16px 0;font-family:${FONT};font-size:15px;line-height:23px;color:${C.muted};">Forward this, or send them to barcelonaenglishpros.com. Free for them too.</div>
      ${button({ href: shareUrl, label: "Share the site", kind: "ghost", width: 190 })}
    </td></tr></table>
  </td></tr>

  <tr><td class="px" style="padding:24px 32px 8px 32px;">
    <div class="t-ink" style="font-family:${FONT};font-size:22px;line-height:28px;font-weight:bold;color:${C.ink};">¡Suerte!</div>
    <div class="t-muted" style="margin-top:2px;font-family:${FONT};font-size:15px;line-height:22px;color:${C.muted};">The Barcelona English Pros team</div>
  </td></tr>

  <tr><td class="px t-muted" style="padding:28px 32px 40px 32px;font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted};border-top:1px solid ${C.border};">
    <a href="${esc(withUtm(EMAIL_SITE_URL, "footer"))}" target="_blank" style="color:${C.brand};font-weight:bold;">barcelonaenglishpros.com</a><br>
    You are getting this one email because you asked for a ${esc(one)} shortlist in ${esc(a)} on our site. It is not a mailing list, so there is nothing to unsubscribe from. Want your details removed? Reply to this email and tell us.
  </td></tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body>
</html>`;

  const textCards = matches
    .map((p, i) => {
      const lines = [
        `${i + 1}. ${p.name}`,
        splitList(p.specialties, 3).length ? `   ${splitList(p.specialties, 3).join(", ")}` : "",
        `   Speaks: ${languagesEnglishFirst(p.languages).join(", ")}`,
        p.bio ? `   ${p.bio}` : "",
        p.priceRange ? `   Price: ${p.priceRange}` : "",
        p.phoneDisplay ? `   Phone: ${p.phoneDisplay}` : "",
        p.bookingUrl ? `   Website: ${withUtm(p.bookingUrl, p.id)}` : "",
        `   Map: ${googleMapsSearchUrl(p, a)}`,
      ];
      return lines.filter(Boolean).join("\n");
    })
    .join("\n\n");

  const text = [
    heroHeadline,
    heroSub,
    "",
    `${greeting} ${intro}`,
    "",
    textPrices,
    textCards,
    "",
    "ONE SMALL FAVOUR",
    "Mention Barcelona English Pros when you get in touch. It costs you nothing, keeps this service free, and tells the good ones we sent you.",
    "",
    "STUCK CHOOSING?",
    WHATSAPP_CONFIGURED ? `${helpCopy} ${helpHref}` : helpCopy,
    "",
    "KNOW SOMEONE WHO NEEDS AN ENGLISH SPEAKER?",
    `Forward this, or send them to ${shareUrl}. Free for them too.`,
    "",
    "¡Suerte!",
    "The Barcelona English Pros team",
    "",
    "--",
    `You are getting this one email because you asked for a ${one} shortlist in ${a} on our site. It is not a mailing list, so there is nothing to unsubscribe from. Want your details removed? Reply and tell us.`,
  ].join("\n");

  return { subject, subjectOptions, preheader, html, text };
}
