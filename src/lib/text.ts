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
