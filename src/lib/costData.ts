import type { CategorySlug } from "@/lib/types";

// Price data for the free cost checker. Every figure is a range taken from published sources checked in
// September 2026, never a quote from a particular business. To update: edit the numbers, keep at least two
// sources per item where possible, and bump COST_DATA_CHECKED.

export const COST_DATA_CHECKED = "2026-09-25";

export interface CostSource {
  name: string;
  url: string;
  year: number;
}

export const costSources: Record<string, CostSource> = {
  cityclinic: { name: "City Clinic Marbella: average dental prices in Spain", url: "https://cityclinic.io/average-prices-for-common-dental-procedures-in-spain/", year: 2025 },
  umt: { name: "Universal Medical Travel: dental prices in Spain", url: "https://universalmedicaltravel.com/dental-prices-in-spain-cost-with-clinics/", year: 2026 },
  corona: { name: "Clínica Corona: dental implant prices in Barcelona", url: "https://clinicacorona.com/en/article/222.html", year: 2026 },
  bookimedDental: { name: "Bookimed: dental treatment clinics in Spain, prices", url: "https://us-uk.bookimed.com/clinics/country=spain/direction=dentistry/", year: 2026 },
  traveldoctores: { name: "TravelDoctores: how much a doctor costs in Spain", url: "https://traveldoctores.com/how-much-does-it-cost-to-see-a-doctor-in-spain/", year: 2026 },
  myexpatmind: { name: "My Expat Mind: how much therapy costs in Spain", url: "https://myexpatmind.com/how-much-does-therapy-cost-in-spain-in-2025/", year: 2026 },
  bookimedPsych: { name: "Bookimed: psychotherapy clinics in Spain, prices", url: "https://us-uk.bookimed.com/clinics/country=spain/procedure=psychotherapy/", year: 2026 },
  therapyBcn: { name: "Therapy in Barcelona: fees", url: "https://www.therapyinbarcelona.com/fees/", year: 2026 },
  bwell: { name: "Bwell Clinic: physiotherapy prices in Barcelona", url: "https://www.bwellclinic.es/en/complete-guide-to-physiotherapy-prices-in-barcelona-everything-you-need-to-know/", year: 2026 },
  myfisio: { name: "Myfisio Barcelona: rates", url: "https://myfisiobcn.com/en/rates/", year: 2026 },
  traduccionoficial: { name: "Traducción Oficial: sworn translation price guide", url: "https://traduccionoficial.es/en/sworn-translations/price.html", year: 2026 },
  conta: { name: "Conta.es: gestoría prices for autónomos", url: "https://conta.es/en/blog/gestoria-precios-2026-autonomo", year: 2026 },
  renn: { name: "renn: autónomo costs in Spain", url: "https://getrenn.com/blog/autonomo-costs", year: 2026 },
  legalfournier: { name: "Legal Fournier: autónomo contributions 2026", url: "https://legalfournier.com/en/tax-finance/cuota-autonomo-2026/", year: 2026 },
  eresidence: { name: "e-residence: NIE application cost breakdown", url: "https://e-residence.com/nie-application-cost-everything-you-need-to-know/", year: 2026 },
  wiseNotary: { name: "Wise: notary fees for property purchase in Spain", url: "https://wise.com/gb/blog/notary-fees-in-spain", year: 2026 },
  idealistaBuying: { name: "idealista: costs and taxes of buying a home in Spain", url: "https://www.idealista.com/en/news/financial-advice-in-spain/2026/01/12/7875-the-costs-and-taxes-associated-with-buying-a-home-in-spain", year: 2026 },
  rightcasa: { name: "Right Casa Estates: calling a locksmith in Spain", url: "https://rightcasa.com/everything-you-need-to-know-about-calling-a-locksmith-in-spain/", year: 2026 },
  takeachef: { name: "Take a Chef: private chef in Barcelona", url: "https://www.takeachef.com/en-es/private-chef/barcelona", year: 2026 },
  movingtospain: { name: "Moving to Spain: dogs and pets guide", url: "https://movingtospain.com/dogs-pets-spain/", year: 2026 },
  idealistaPets: { name: "idealista: moving to Spain with pets", url: "https://www.idealista.com/en/news/lifestyle-in-spain/2026/04/20/848628-moving-to-spain-with-pets-complete-guide-for-2026", year: 2026 },
};

export interface CostItem {
  id: string;
  categorySlug: CategorySlug;
  /** Short service name as people search for it, e.g. "Dental filling". */
  service: string;
  /** What the range measures, e.g. "per tooth" or "per session". */
  unit: string;
  low: number;
  high: number;
  /** Optional common price point inside the range. Only set when sources agree on one. */
  typical?: number;
  /** "%" for percentages, otherwise euros. */
  currency?: "eur" | "pct";
  /** Plain-English caveat: what moves the price, what is often excluded. */
  note: string;
  /** Questions worth asking before you agree a price. */
  ask: string[];
  sources: string[];
  /** "limited" when few sources exist or figures vary widely, shown honestly on the page. */
  confidence: "good" | "limited";
}

export const costItems: CostItem[] = [
  // Dentist
  { id: "dental-checkup", categorySlug: "dentist", service: "Dental check-up", unit: "per visit", low: 50, high: 100, note: "Many clinics offer a free or reduced first visit. X-rays are sometimes charged separately.", ask: ["Is the first visit free?", "Are X-rays included?"], sources: ["umt", "bookimedDental"], confidence: "good" },
  { id: "dental-cleaning", categorySlug: "dentist", service: "Professional teeth cleaning", unit: "per session", low: 60, high: 120, note: "Deep cleaning for gum disease costs more than a routine hygiene visit.", ask: ["Is this a routine clean or a deep clean?"], sources: ["umt", "bookimedDental"], confidence: "good" },
  { id: "dental-filling", categorySlug: "dentist", service: "Dental filling", unit: "per tooth", low: 50, high: 150, note: "Size, material and how many surfaces are involved move the price.", ask: ["Which material is being used?", "Is anaesthetic included?"], sources: ["cityclinic", "umt"], confidence: "good" },
  { id: "dental-extraction", categorySlug: "dentist", service: "Tooth extraction", unit: "per tooth", low: 80, high: 200, note: "Surgical removal and wisdom teeth cost more than a simple extraction.", ask: ["Is this a simple or a surgical extraction?"], sources: ["cityclinic"], confidence: "limited" },
  { id: "dental-root-canal", categorySlug: "dentist", service: "Root canal (endodontics)", unit: "per tooth", low: 200, high: 400, note: "Molars have more canals and cost more than front teeth. A crown is usually needed afterwards and is priced separately.", ask: ["Is the crown included?", "Who performs it, a general dentist or an endodontist?"], sources: ["umt"], confidence: "limited" },
  { id: "dental-crown", categorySlug: "dentist", service: "Dental crown", unit: "per tooth", low: 300, high: 900, note: "Metal-ceramic sits at the low end, zirconia and ceramic at the high end. Barcelona clinics report prices above the national averages.", ask: ["Which material?", "What is the warranty?"], sources: ["cityclinic", "umt", "corona"], confidence: "good" },
  { id: "dental-implant", categorySlug: "dentist", service: "Single dental implant", unit: "per tooth, with crown", low: 800, high: 1800, note: "Advertised prices often cover only the post. Bone grafts, sinus lifts and scans add to the total, and premium front-tooth work can reach around €2,500.", ask: ["Is this the all-in price for the finished tooth?", "What happens if I need bone grafting?", "What is the implant brand and warranty?"], sources: ["cityclinic", "umt", "corona"], confidence: "good" },
  { id: "dental-whitening", categorySlug: "dentist", service: "Teeth whitening", unit: "per treatment", low: 200, high: 500, note: "In-clinic whitening costs more than take-home trays.", ask: ["In-clinic or take-home?"], sources: ["cityclinic", "umt"], confidence: "good" },

  // Doctor
  { id: "gp-private", categorySlug: "doctor", service: "Private GP appointment", unit: "per visit", low: 60, high: 120, note: "Clinics that serve patients entirely in English tend to sit toward the top of the range. Home visits and specialists cost more.", ask: ["Will the doctor conduct the whole visit in English?", "Are tests charged separately?"], sources: ["traveldoctores"], confidence: "limited" },
  { id: "gp-online", categorySlug: "doctor", service: "Online doctor consultation", unit: "per consultation", low: 25, high: 40, note: "Quick telemedicine calls, often with a digital prescription. Not suitable for anything needing an examination.", ask: ["Is the prescription valid at Spanish pharmacies?"], sources: ["traveldoctores"], confidence: "limited" },

  // Psychologist
  { id: "therapy-session", categorySlug: "psychologist", service: "Therapy session with a psychologist", unit: "per 45 to 60 minutes", low: 50, high: 100, note: "English-speaking practitioners in Barcelona tend to charge more than Spanish-language ones. Psychiatrists cost more, and couples sessions often cost more too.", ask: ["Are you a registered psychologist?", "What is your cancellation policy?", "Do online sessions cost the same?"], sources: ["myexpatmind", "bookimedPsych", "therapyBcn"], confidence: "good" },

  // Physio
  { id: "physio-session", categorySlug: "physiotherapist", service: "Physiotherapy session", unit: "per session", low: 35, high: 120, typical: 65, note: "Most Barcelona clinics that publish prices charge around €60 to €80 for a 50 to 60 minute session. Packs of 5 or 10 lower the price per session, and some insurers reimburse part of it.", ask: ["How long is a session?", "Is there a pack discount?", "Does my insurer reimburse it?"], sources: ["bwell", "myfisio"], confidence: "good" },

  // Vet
  { id: "vet-consult", categorySlug: "veterinarian", service: "Routine vet consultation", unit: "per visit", low: 25, high: 40, note: "Vet care is entirely private in Spain. Vaccines, tests and medication are extra, and city emergency hospitals can charge well over €300 for an overnight stay.", ask: ["What is the consultation fee before any treatment?"], sources: ["movingtospain"], confidence: "limited" },
  { id: "vet-microchip", categorySlug: "veterinarian", service: "Pet microchip", unit: "per animal", low: 30, high: 70, note: "Required for dogs in Spain. Registration on the database may be charged separately.", ask: ["Is database registration included?"], sources: ["idealistaPets"], confidence: "limited" },

  // Sworn translator
  { id: "sworn-translation", categorySlug: "sworn-translator", service: "Sworn translation", unit: "per page, before VAT", low: 25, high: 80, typical: 35, note: "Common language pairs like English to Spanish sit at the low end, rare languages at the high end. A short document of one or two pages usually costs €40 to €60 before VAT, and urgent jobs cost more.", ask: ["Is the price per page or per document?", "Are stamps, delivery and VAT included?", "Do I get a paper copy, a digital copy, or both?"], sources: ["traduccionoficial", "eresidence"], confidence: "good" },

  // Autonomo accountant / gestor
  { id: "gestor-monthly", categorySlug: "autonomo-accountant", service: "Gestor for a self-employed person", unit: "per month, before VAT", low: 30, high: 120, note: "Online services start around €30 to €60. Face-to-face offices charge roughly €60 to €120. Specialist international work is higher. Income tax returns and registration are often extra.", ask: ["What forms are included?", "What is charged extra?", "Will I get answers in English?"], sources: ["conta", "renn"], confidence: "good" },
  { id: "nie-help", categorySlug: "tax-advisor", service: "Professional help with an NIE", unit: "service fee", low: 100, high: 500, note: "The official government fee is €9.84. The rest is the service fee plus any apostille, sworn translation and notary costs, depending on the route.", ask: ["Is the government fee included?", "Do you handle the appointment and the paperwork?"], sources: ["eresidence"], confidence: "limited" },

  // Property / notary
  { id: "notary-purchase", categorySlug: "notary", service: "Notary fee for a home purchase", unit: "per deed, before VAT", low: 500, high: 1200, note: "Notary fees are set by regulation and are the same at every notary. They come to about 0.1 to 0.5 per cent of the price, which is roughly €850 for a €100,000 home and €1,000 for €250,000.", ask: ["Which extras (copies, translations) are billed on top?"], sources: ["wiseNotary", "idealistaBuying"], confidence: "good" },
  { id: "buying-costs", categorySlug: "property-advisor", service: "Total buying costs on top of the price", unit: "of the purchase price", low: 10, high: 12, currency: "pct", note: "Transfer tax, notary, land registry and valuation together. The transfer tax rate depends on the region and is the biggest part, so check the current Catalan rate.", ask: ["Which taxes apply to this specific property?"], sources: ["idealistaBuying", "wiseNotary"], confidence: "limited" },

  { id: "locksmith-change", categorySlug: "locksmith", service: "Locksmith: change a simple lock", unit: "per job", low: 80, high: 200, note: "Labour is roughly €40 to €70 an hour. Out-of-hours callouts can be far higher, and published figures vary widely, so always agree the price before work starts.", ask: ["What is the total price including the call-out and any night surcharge?"], sources: ["rightcasa"], confidence: "limited" },

  // Private chef
  { id: "private-chef", categorySlug: "private-chef", service: "Private chef at home", unit: "per guest", low: 44, high: 73, note: "Platform entry prices fall as group size grows, from around €73 a guest for two to €44 for thirteen or more. Menu, season and neighbourhood move the final figure, and premium chefs charge much more.", ask: ["Are ingredients, service and cleaning included?"], sources: ["takeachef"], confidence: "limited" },
];

export function costsForCategory(slug: CategorySlug) {
  return costItems.filter((c) => c.categorySlug === slug);
}

export function formatRange(item: CostItem): string {
  if (item.currency === "pct") return `${item.low} to ${item.high}%`;
  return `€${item.low.toLocaleString("en-GB")} to €${item.high.toLocaleString("en-GB")}`;
}

/** Where a quote sits against the published range. */
export function judgeQuote(item: CostItem, quote: number): "below" | "within" | "above" {
  if (quote < item.low) return "below";
  if (quote > item.high) return "above";
  return "within";
}

export function distinctSourceCount(): number {
  return new Set(costItems.flatMap((c) => c.sources)).size;
}
