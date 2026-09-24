// Single source of truth for the canonical site address. The bare domain
// 308-redirects to www (Vercel domain setting), so www is the canonical host:
// sitemap, robots, canonical tags and structured data must all use it.
export const SITE_URL = "https://www.barcelonaenglishpros.com";
export const SITE_NAME = "Barcelona English Pros";
export const INDEXNOW_KEY = "3ef5b6dcc1eb89a9632e4bf536a1e6dc";

/** OpenGraph block with the shared image, for pages that set their own title/description
 * (Next replaces, not merges, the layout's openGraph when a page defines one). */
export function ogFor(title: string, description: string, path = "") {
  return {
    title,
    description,
    url: `${SITE_URL}${path}`,
    siteName: SITE_NAME,
    locale: "en_GB",
    type: "website" as const,
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: SITE_NAME }],
  };
}
