// The business's own WhatsApp number that receives lead notifications and
// handles the initial "we're finding you a match" reply. Set via env var so
// it's not hardcoded — falls back to a placeholder that's obviously not real.
export const BUSINESS_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || "34600000000";

export function waLink(number: string, message: string): string {
  const digits = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function businessWaLink(message: string): string {
  return waLink(BUSINESS_WHATSAPP_NUMBER, message);
}
