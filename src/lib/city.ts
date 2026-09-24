import { areas } from "@/lib/data";
import { getProfessionals } from "@/lib/professionals";
import type { CategorySlug, Professional } from "@/lib/types";

/** Every English-speaking professional in a category across all areas, one entry per business
 * (service-area businesses are listed once per neighbourhood, so dedupe on name), partners first. */
export function getCityProfessionals(categorySlug: CategorySlug): Professional[] {
  const seen = new Set<string>();
  const out: Professional[] = [];
  for (const a of areas) {
    for (const p of getProfessionals(a.slug, categorySlug)) {
      const key = p.name.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(p);
    }
  }
  const tier = (p: Professional) => (p.partnerTier === "top" ? 0 : p.partnerTier === "recommended" ? 1 : 2);
  return out.sort((a, b) => tier(a) - tier(b));
}

export function areaCounts(categorySlug: CategorySlug) {
  return areas.map((a) => ({ area: a, count: getProfessionals(a.slug, categorySlug).length }));
}
