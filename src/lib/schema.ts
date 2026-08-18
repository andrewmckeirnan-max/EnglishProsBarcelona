import type { Area, Category } from "./types";
import type { Professional } from "./types";
import { googleMapsSearchUrl } from "./maps";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

/** Pulls "4.9 (36 reviews)" out of a ratingLabel string like
 * "4.9 (36 reviews) on Google Maps", for genuine schema markup only,
 * never fabricated. Returns null if the label doesn't parse cleanly. */
function parseRating(ratingLabel?: string): { value: string; count: string } | null {
  if (!ratingLabel) return null;
  const match = ratingLabel.match(/^(\d+(?:\.\d+)?)\s*\((\d[\d,]*)\s*reviews?\)/);
  if (!match) return null;
  return { value: match[1], count: match[2].replace(/,/g, "") };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function professionalListSchema(area: Area, category: Category, professionals: Professional[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `English-speaking ${category.pluralName} in ${area.name}, Barcelona`,
    itemListElement: professionals.map((p, i) => {
      const rating = parseRating(p.ratingLabel);
      const entry: Record<string, unknown> = {
        "@type": "ProfessionalService",
        name: p.name,
        areaServed: {
          "@type": "Place",
          name: `${area.name}, Barcelona`,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: p.addressArea,
          addressRegion: "Barcelona",
          addressCountry: "ES",
        },
        knowsLanguage: p.languages,
        hasMap: googleMapsSearchUrl(p),
        ...(p.bookingUrl ? { url: p.bookingUrl } : {}),
        ...(rating
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: rating.value,
                reviewCount: rating.count,
              },
            }
          : {}),
      };
      return {
        "@type": "ListItem",
        position: i + 1,
        item: entry,
      };
    }),
  };
}

/**
 * Genuine, honest FAQ content for a category page — no fabricated prices
 * or availability claims, answers reflect how the site actually works.
 * Rendered visibly on the page (Google requires FAQPage schema to match
 * visible content) and also emitted as FAQPage JSON-LD.
 */
export function buildCategoryFaqs(
  area: Area,
  category: Category,
  hasListings: boolean
): { question: string; answer: string }[] {
  const lower = category.name.toLowerCase();
  return [
    {
      question: `Do I need to be a resident of ${area.name} to use this?`,
      answer: `No. Most of the professionals we list also see visitors, tourists and short-term residents, not just people who live in ${area.name}. We match you by where you'd like to be seen, not where you're registered.`,
    },
    {
      question: `How do you confirm a ${lower} actually speaks English?`,
      answer: `We only add a listing after finding an explicit, checkable signal that they offer service in English, such as a review, their own business name, or their website, cross-checked against their real address on Google Maps. We don't guess.`,
    },
    {
      question: "Is this free to use?",
      answer: "Yes, always. We're paid by professionals who want to be found by you, never by you.",
    },
    hasListings
      ? {
          question: `Can I compare more than one ${lower} in ${area.name}?`,
          answer: `Yes. We show every English-speaking option we've verified for ${area.name} on this page, and submitting your details gets you the full ranked list by email with contact details and a Google Maps link for each.`,
        }
      : {
          question: `What happens if no one is listed yet for ${lower} in ${area.name}?`,
          answer: `We personally check real availability with an English-speaking ${lower} nearby and follow up on WhatsApp, usually the same day, rather than showing you an empty page.`,
        },
  ];
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
