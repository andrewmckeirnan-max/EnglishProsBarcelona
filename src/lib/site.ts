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

/** First candidate that fits Google's ~60 character title display, else the last one trimmed at a word. */
export function fitTitle(...candidates: string[]): string {
  for (const c of candidates) if (c.length <= 60) return c;
  const last = candidates[candidates.length - 1];
  const cut = last.slice(0, 60);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,&|-]\s*$/, "");
}

/** Next.js title value: brand suffix only when the whole thing still fits, otherwise the title stands alone. */
export function titleMeta(title: string): string | { absolute: string } {
  return title.length + " | Barcelona English Pros".length <= 62 ? title : { absolute: title };
}

/** Trim a meta description to fit search snippets without cutting mid-word. */
export function clipDescription(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const stop = cut.lastIndexOf(". ");
  if (stop > max * 0.6) return cut.slice(0, stop + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:-]\s*$/, "") + ".";
}
