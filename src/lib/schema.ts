import type { Area, Category } from "./types";
import type { Professional } from "./types";
import { googleMapsSearchUrl } from "./maps";

import { SITE_URL } from "@/lib/site";
import { categoryTerms, humanList } from "@/lib/seoTerms";

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

export function professionalListSchema(area: Area | null, category: Category, professionals: Professional[], linkLimit = professionals.length) {
  const where = area ? area.name : "Barcelona";
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: area ? `English-speaking ${category.pluralName} in ${area.name}, Barcelona` : `English-speaking ${category.pluralName} in Barcelona`,
    itemListElement: professionals.map((p, i) => {
      const rating = parseRating(p.ratingLabel);
      const entry: Record<string, unknown> = {
        "@type": "ProfessionalService",
        name: p.name,
        areaServed: {
          "@type": "Place",
          name: area ? `${area.name}, Barcelona` : "Barcelona",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: p.addressArea,
          addressRegion: "Barcelona",
          addressCountry: "ES",
        },
        knowsLanguage: p.languages,
        ...(i < linkLimit ? { hasMap: googleMapsSearchUrl(p, where) } : {}),
        ...(p.bookingUrl && i < linkLimit ? { url: p.bookingUrl } : {}),
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
  const terms = categoryTerms[category.slug];
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
      question: `Can I find a ${terms.synonyms[0]} or ${terms.es} in ${area.name}?`,
      answer: `Yes. This page lists English-speaking ${category.pluralName.toLowerCase()} in ${area.name}, which covers what people often search for as ${humanList(terms.synonyms)}, or in Spanish, ${terms.es}. If you need something more specific, tell us and we'll match you.`,
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
          answer: `We personally check real availability with an English-speaking ${lower} nearby and follow up with you directly, usually the same day, rather than showing you an empty page.`,
        },
  ];
}

export function buildCityFaqs(
  category: Category,
  count: number,
  areaNames: string[]
): { question: string; answer: string }[] {
  const lower = category.name.toLowerCase();
  const terms = categoryTerms[category.slug];
  return [
    {
      question: `How do I find an English-speaking ${lower} in Barcelona?`,
      answer: `Pick your neighbourhood below or tell us what you need, and you'll see the English-speaking ${category.pluralName.toLowerCase()} we've verified in Barcelona${count > 0 ? `, ${count} at the moment` : ""}. Submitting your details unlocks the full ranked list by email with contact details and a map link for each.`,
    },
    {
      question: `How do you know a ${lower} really speaks English?`,
      answer: "We only list a professional after finding an explicit, checkable signal that they work in English, such as a review, their business name or their website, cross-checked against their real address on Google Maps. We don't guess.",
    },
    {
      question: `Which parts of Barcelona do you cover for ${lower} searches?`,
      answer: `${humanList(areaNames)}. Each has its own page with the English-speaking ${category.pluralName.toLowerCase()} we've verified there.`,
    },
    {
      question: `I'm looking for a ${terms.synonyms[0]} or ${terms.es} in Barcelona, is this the right place?`,
      answer: `Yes. This page covers English-speaking ${category.pluralName.toLowerCase()}, which includes what people often search for as ${humanList(terms.synonyms)}, or in Spanish, ${terms.es}.`,
    },
    {
      question: "Is it free to use?",
      answer: "Yes, always. We're paid by professionals who want to be found by you, never by you.",
    },
  ];
}

export function blogPostingSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedDate: string;
  updatedDate?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate || post.publishedDate,
    author: {
      "@type": "Organization",
      name: "Barcelona English Pros",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Barcelona English Pros",
      url: SITE_URL,
    },
  };
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
