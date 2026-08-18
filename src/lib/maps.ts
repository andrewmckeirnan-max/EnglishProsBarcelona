import type { Professional } from "./types";

/**
 * Google Maps search link for a professional. Built from name + our
 * neighbourhood-level addressArea text (we don't store precise addresses,
 * see the sourcing note in professionals.ts), no API key or stored
 * coordinates required, Maps resolves the text search itself.
 */
export function googleMapsSearchUrl(professional: Professional): string {
  const query = `${professional.name}, ${professional.addressArea}, Barcelona`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
