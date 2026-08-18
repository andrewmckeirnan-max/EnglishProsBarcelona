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
  | "veterinarian"
  | "lasik"
  | "fertility-clinic"
  | "plastic-surgeon";

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
}

export interface Area {
  slug: AreaSlug;
  name: string; // e.g. "Poblenou"
  district: string; // official district, e.g. "Sant Martí"
  blurb: string;
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
  phoneDisplay?: string; // only set once a real, verified partner is onboarded
  whatsappNumber?: string; // E.164 format, only set for verified partners
  bookingUrl?: string;
  ratingLabel?: string; // qualitative only until we have a verified review source
}

export interface LeadPayload {
  areaSlug: AreaSlug;
  categorySlug: CategorySlug;
  need: string;
  urgency: "asap" | "this-week" | "flexible";
  name: string;
  whatsapp: string;
  email?: string; // optional — WhatsApp is the required contact channel, email is a bonus paper trail
  notes?: string;
  pageUrl: string;
}
