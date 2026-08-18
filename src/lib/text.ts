// Acronyms that must stay uppercase when a label is dropped into a lowercase
// sentence (plain `.toLowerCase()` would mangle "IVF" -> "ivf"). Add to this
// list rather than hand-writing a lowercase variant per category.
const PROTECTED_ACRONYMS = ["IVF", "LASIK", "TCM", "GP", "ADHD"];

/**
 * Lowercases a label for mid-sentence use while keeping known acronyms
 * uppercase, e.g. "Fertility & IVF Clinic" -> "fertility & IVF clinic".
 */
export function sentenceLower(label: string): string {
  return label
    .split(/\b/)
    .map((word) => (PROTECTED_ACRONYMS.includes(word) ? word : word.toLowerCase()))
    .join("");
}

/** Pulls "4.9 (36 reviews)" out of a ratingLabel string like
 * "4.9 (36 reviews) on Google Maps", for display purposes. Only ever
 * reflects a genuinely sourced rating string, never fabricated - returns
 * null (render nothing) if the label doesn't parse cleanly. Same pattern
 * used for the JSON-LD schema markup in schema.ts. */
export function parseRating(ratingLabel?: string): { value: string; count: string } | null {
  if (!ratingLabel) return null;
  const match = ratingLabel.match(/^(\d+(?:\.\d+)?)\s*\((\d[\d,]*)\s*reviews?\)/);
  if (!match) return null;
  return { value: match[1], count: match[2].replace(/,/g, "") };
}
