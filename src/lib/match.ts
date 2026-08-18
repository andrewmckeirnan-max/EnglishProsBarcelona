import { areas, visibleCategories } from "./data";
import type { Area, Category } from "./types";

export interface EnquiryMatch {
  category?: Category;
  area?: Area;
  need?: string;
}

/**
 * Lightweight keyword matcher for the "describe what you need" free-text
 * box, no external AI API required. Scores each category by how many of
 * its own words (name, plural, SEO keywords, need options) appear in the
 * enquiry text, and separately looks for an area name mentioned anywhere.
 * Good enough for a fixed taxonomy this small (16 categories x 6 areas);
 * swap in a real LLM call later if free-text enquiries get more varied
 * than this can handle.
 */
export function matchEnquiry(text: string): EnquiryMatch {
  const lower = text.toLowerCase();

  let bestCategory: Category | undefined;
  let bestScore = 0;
  for (const c of visibleCategories) {
    const words = [c.name, c.pluralName, ...c.seoKeywords, ...c.needOptions]
      .join(" ")
      .toLowerCase()
      .split(/[^a-zà-ú]+/)
      .filter((w) => w.length > 3);
    const score = words.reduce((sum, w) => sum + (lower.includes(w) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = c;
    }
  }

  const area = areas.find(
    (a) => lower.includes(a.name.toLowerCase()) || lower.includes(a.slug.replace(/-/g, " "))
  );

  let need: string | undefined;
  if (bestCategory) {
    need = bestCategory.needOptions.find((n) => lower.includes(n.toLowerCase()));
  }

  return { category: bestScore > 0 ? bestCategory : undefined, area, need };
}
