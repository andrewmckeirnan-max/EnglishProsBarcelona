export type CategorySlug =
  | "dentist"
  | "dermatologist"
  | "doctor"
  | "physiotherapist"
  | "lawyer"
  | "psychologist"
  | "tax-advisor"
  | "property-advisor"
  | "chiropractor"
  | "acupuncturist"
  | "nutritionist"
  | "naturopath"
  | "holistic-doctor"
  | "veterinarian"
  | "lasik"
  | "fertility-clinic"
  | "plastic-surgeon"
  | "obgyn-midwife"
  | "pediatrician"
  | "osteopath"
  | "autonomo-accountant"
  | "business-lawyer"
  | "sworn-translator"
  | "orthodontist"
  | "podiatrist"
  | "eye-care"
  | "occupational-therapist"
  | "speech-therapist"
  | "insurance-broker"
  | "wealth-manager"
  | "notary"
  | "personal-trainer"
  | "driving-school"
  | "family-therapist"
  | "dog-services";

export type AreaSlug =
  | "poblenou"
  | "eixample"
  | "sarria-sant-gervasi"
  | "les-corts"
  | "diagonal-mar"
  | "gracia";

export interface Category {
  slug: CategorySlug;
  name: string; // e.g. "Dentist"
  pluralName: string; // e.g. "Dentists"
  icon: string; // emoji used as a lightweight icon (no external assets needed)
  shortPitch: string; // used in hero / meta description
  needOptions: string[]; // options shown in the lead form "what do you need?" step
  seoKeywords: string[]; // long-tail terms this category targets, e.g. "Invisalign"
  /** Paused, not deleted: true removes this category from every nav, grid,
   * lead-form step and generated page (visiting the URL 404s), without
   * losing the underlying data. Flip back to false/omit to relaunch it. */
  hidden?: boolean;
}

export interface Area {
  slug: AreaSlug;
  name: string; // e.g. "Poblenou"
  district: string; // official district, e.g. "Sant Martí"
  blurb: string;
  image: string; // path under /public, e.g. "/images/areas/poblenou.jpg"
  imageCredit: {
    photographer: string;
    license: string; // e.g. "CC BY-SA 4.0", "Public domain"
    sourceUrl: string; // Wikimedia Commons file page
  };
  mapCenter: { lat: number; lng: number }; // default view for the embedded map
}

export interface Professional {
  id: string;
  name: string;
  categorySlug: CategorySlug;
  areaSlug: AreaSlug;
  isPartner: boolean; // paying partner gets top/featured placement
  isPlaceholder: boolean; // TRUE = demo data, must be replaced with a verified real business before this page goes live
  specialties: string[];
  languages: string[];
  addressArea: string; // human-readable area description, not a precise street address
  lat?: number; // geocoded from addressArea via scripts/geocode.mjs (OpenStreetMap Nominatim), for the map view
  lng?: number;
  phoneDisplay?: string; // only set once a real, verified partner is onboarded
  whatsappNumber?: string; // E.164 format, only set for verified partners
  bookingUrl?: string;
  /** Pulled from the business's own official website (never scraped from
   * Google Maps/reviews — see src/lib/professionals.ts header for why).
   * Omit rather than guess when no official photo is findable. */
  photoUrl?: string;
  ratingLabel?: string; // qualitative only until we have a verified review source
  /** €-€€€€€ price tier, only when we've actually verified pricing, e.g. from
   * the professional's own published rates. Left unset otherwise, an
   * unverified guess is worse than no price shown at all. */
  priceRange?: string;
}

export interface LeadPayload {
  areaSlug: AreaSlug;
  categorySlug: CategorySlug;
  need: string;
  urgency: "asap" | "this-week" | "flexible";
  name: string;
  whatsapp: string;
  email: string; // required: email is the fallback channel when WhatsApp isn't available/reachable
  notes?: string;
  pageUrl: string;
  consent: boolean; // must be true: ticked agreement to the Privacy Policy / Terms before submit
}
