// Sends the sample shortlist email (rendered by /admin/email-preview) to the
// addresses given, using RESEND_API_KEY / ADMIN_SECRET from .env.local.
// Usage: node scripts/send-test-email.mjs <baseUrl> <case: full|edge|testname> to1@x.com [to2@x.com ...]
import { readFileSync } from "node:fs";

const [baseUrl, sampleCase = "full", ...recipients] = process.argv.slice(2);
if (!baseUrl || recipients.length === 0) {
  console.error("Usage: node scripts/send-test-email.mjs <baseUrl> <case> <to...>");
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split(/\r?\n/).filter((l) => l.includes("=")).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const res = await fetch(`${baseUrl}/admin/email-preview?key=${encodeURIComponent(env.ADMIN_SECRET)}&case=${sampleCase}&format=json`);
if (!res.ok) throw new Error(`preview failed: ${res.status}`);
const email = await res.json();
const from = env.LEAD_FROM_EMAIL.includes("<") ? env.LEAD_FROM_EMAIL : `Barcelona English Pros <${env.LEAD_FROM_EMAIL}>`;
for (const to of recipients) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, reply_to: env.LEAD_FROM_EMAIL, subject: `[TEST] ${email.subject}`, html: email.html, text: email.text }),
  });
  console.log(to, r.status, await r.text());
}
