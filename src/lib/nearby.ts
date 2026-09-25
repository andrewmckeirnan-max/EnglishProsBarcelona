import type { Area, Professional } from "@/lib/types";
import { areas } from "@/lib/data";
import { getProfessionals } from "@/lib/professionals";

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export interface NearestResult {
  area: Area;
  /** Straight-line distance between the two area centres, rounded to 0.5 km. Approximate by design. */
  km: number;
  professionals: Professional[];
}

/**
 * For an area with no listing in a category, the closest other area that has some, so the visitor still gets
 * real options instead of an empty page. Distances are between area centres, not to the business itself.
 */
export function nearestProfessionals(area: Area, categorySlug: string, limit = 5): NearestResult | null {
  const candidates = areas
    .filter((a) => a.slug !== area.slug)
    .map((a) => ({ area: a, km: haversineKm(area.mapCenter, a.mapCenter) }))
    .sort((x, y) => x.km - y.km);
  for (const c of candidates) {
    const pros = getProfessionals(c.area.slug, categorySlug);
    if (pros.length > 0) {
      return { area: c.area, km: Math.max(0.5, Math.round(c.km * 2) / 2), professionals: pros.slice(0, limit) };
    }
  }
  return null;
}
