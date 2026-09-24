// The business's own WhatsApp number that receives lead notifications and
// handles the initial "we're finding you a match" reply. Set via env var —
// unset until a real number is chosen, deliberately not defaulted to a fake
// placeholder, so WHATSAPP_CONFIGURED below can tell the two cases apart
// and every WhatsApp CTA site-wide can fall back to email instead.
export const BUSINESS_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? "";
export const WHATSAPP_CONFIGURED = BUSINESS_WHATSAPP_NUMBER.length > 0;

export function waLink(number: string, message: string): string {
  const digits = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function businessWaLink(message: string): string {
  return waLink(BUSINESS_WHATSAPP_NUMBER, message);
}

// Fallback contact channel for every spot that would otherwise show a
// WhatsApp CTA, until NEXT_PUBLIC_BUSINESS_WHATSAPP is set and
// WHATSAPP_CONFIGURED flips true — same "skip straight to us" intent,
// over email instead. Swap this back to a WhatsApp link (no other code
// changes needed) once a real number is ready.
export const SUPPORT_EMAIL = "hello@barcelonaenglishpros.com";

export function supportMailtoLink(subject: string, body: string): string {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
