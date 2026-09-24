import type { Professional } from "./types";

/**
 * Google Maps search link for a professional. Built from name + our
 * neighbourhood-level addressArea text (we don't store precise addresses,
 * see the sourcing note in professionals.ts), no API key or stored
 * coordinates required, Maps resolves the text search itself.
 */
export function googleMapsSearchUrl(professional: Professional, areaName?: string): string {
  // addressArea is a free-text note ("Barcelona-wide · based in Les Corts"),
  // fine for display but noisy as a search query. When the caller knows the
  // clean neighbourhood, search on name + neighbourhood instead.
  const where = areaName ?? professional.addressArea;
  const query = `${professional.name}, ${where}, Barcelona`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Static map thumbnail centred on a professional's geocoded location, with
 * a pin marker — used as the card photo fallback when we don't have a real
 * business photo. Yandex's static maps endpoint needs no API key/billing
 * (unlike Google Static Maps) and renders a clean single PNG. This is map
 * tile data, not a scraped business/review photo, so it carries none of the
 * copyright risk those do (see the photoUrl note in types.ts).
 */
export function staticMapThumbnailUrl(lat: number, lng: number): string {
  return `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&z=16&size=200,200&l=map&pt=${lng},${lat},pm2rdm`;
}
