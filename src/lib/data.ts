import type { Area, Category } from "./types";

// ---------------------------------------------------------------------------
// AREAS
// Ranked by commercial opportunity (foreign population, purchasing power,
// English-speaking demand, professional-service density). Start with these
// four, expand the matrix once the first partners are onboarded.
// ---------------------------------------------------------------------------
export const areas: Area[] = [
  {
    slug: "eixample",
    name: "Eixample",
    district: "Eixample",
    blurb:
      "Barcelona's largest international population and highest concentration of English-speaking professionals — the anchor territory.",
  },
  {
    slug: "poblenou",
    name: "Poblenou",
    district: "Sant Martí",
    blurb:
      "Barcelona's tech and international-professional hub, with a fast-growing base of English-speaking residents.",
  },
  {
    slug: "sarria-sant-gervasi",
    name: "Sarrià-Sant Gervasi",
    district: "Sarrià-Sant Gervasi",
    blurb:
      "The city's highest-income district and the deepest concentration of established English-speaking private clinics.",
  },
  {
    slug: "les-corts",
    name: "Les Corts",
    district: "Les Corts",
    blurb:
      "A quieter, family-oriented district popular with international residents who want private healthcare and schooling nearby.",
  },
];

// ---------------------------------------------------------------------------
// CATEGORIES
// Ranked (roughly) by lead value: dentistry, legal/tax and property carry the
// highest lifetime value per referral, so they lead the list and the homepage.
// ---------------------------------------------------------------------------
export const categories: Category[] = [
  {
    slug: "dentist",
    name: "Dentist",
    pluralName: "Dentists",
    icon: "🦷",
    shortPitch: "Compare English-speaking dentists — implants, Invisalign, cosmetic dentistry and check-ups.",
    needOptions: ["Check-up / cleaning", "Invisalign / orthodontics", "Dental implants", "Cosmetic dentistry", "Emergency", "Other"],
    seoKeywords: ["dental implants", "Invisalign", "cosmetic dentist", "emergency dentist", "veneers"],
  },
  {
    slug: "lawyer",
    name: "Lawyer",
    pluralName: "Lawyers",
    icon: "⚖️",
    shortPitch: "Find an English-speaking lawyer for immigration, property, tax or family law in Barcelona.",
    needOptions: ["Immigration / visa", "Property purchase", "Tax law", "Family / divorce", "Employment", "Business setup", "Other"],
    seoKeywords: ["immigration lawyer", "property lawyer", "NIE", "TIE", "golden visa", "digital nomad visa"],
  },
  {
    slug: "property-advisor",
    name: "Property & Mortgage Advisor",
    pluralName: "Property & Mortgage Advisors",
    icon: "🏠",
    shortPitch: "English-speaking buyer's agents, mortgage brokers and property managers for Barcelona.",
    needOptions: ["Buying a property", "Mortgage advice", "Renting", "Property management", "Investment advice", "Other"],
    seoKeywords: ["buyer's agent", "mortgage broker", "relocation", "property investment", "rental agency"],
  },
  {
    slug: "tax-advisor",
    name: "Tax Advisor",
    pluralName: "Tax Advisors",
    icon: "💶",
    shortPitch: "English-speaking gestors, accountants and tax advisors for residents and non-residents.",
    needOptions: ["Annual tax return", "Non-resident tax", "Self-employed / autónomo", "Company accounting", "Golden Visa tax planning", "Other"],
    seoKeywords: ["gestor", "non-resident tax", "autónomo", "expat tax advisor", "accountant"],
  },
  {
    slug: "dermatologist",
    name: "Dermatologist & Aesthetic Clinic",
    pluralName: "Dermatologists & Aesthetic Clinics",
    icon: "🧴",
    shortPitch: "English-speaking dermatologists and aesthetic clinics — skin checks, acne, Botox and laser treatments.",
    needOptions: ["Skin check / mole", "Acne", "Botox / fillers", "Laser hair removal", "Anti-ageing", "Other"],
    seoKeywords: ["skin check", "mole check", "Botox", "laser hair removal", "acne clinic"],
  },
  {
    slug: "doctor",
    name: "Private Doctor",
    pluralName: "Private Doctors",
    icon: "🩺",
    shortPitch: "English-speaking private GPs and specialists for residents and visitors in Barcelona.",
    needOptions: ["General check-up", "Same-day appointment", "Specialist referral", "Women's health", "Paediatrics", "Other"],
    seoKeywords: ["private GP", "family doctor", "same-day appointment", "gynaecologist", "paediatrician"],
  },
  {
    slug: "physiotherapist",
    name: "Physiotherapist",
    pluralName: "Physiotherapists",
    icon: "💪",
    shortPitch: "English-speaking physiotherapists for sports injuries, rehab and chronic pain.",
    needOptions: ["Sports injury", "Post-surgery rehab", "Back / neck pain", "Chronic pain", "Women's health physio", "Other"],
    seoKeywords: ["sports physio", "injury rehabilitation", "back pain specialist", "pelvic floor physio"],
  },
  {
    slug: "psychologist",
    name: "Psychologist & Therapist",
    pluralName: "Psychologists & Therapists",
    icon: "🧠",
    shortPitch: "English-speaking psychologists and therapists for individuals, couples and families.",
    needOptions: ["Anxiety / stress", "Couples therapy", "Family therapy", "ADHD assessment", "Trauma", "Other"],
    seoKeywords: ["anxiety therapist", "couples therapist", "ADHD assessment", "trauma therapist"],
  },
  {
    slug: "chiropractor",
    name: "Chiropractor",
    pluralName: "Chiropractors",
    icon: "🦴",
    shortPitch: "English-speaking chiropractors for back, neck and joint pain in Barcelona.",
    needOptions: ["Back pain", "Neck pain", "Sports injury", "Posture / general wellness", "Other"],
    seoKeywords: ["back pain specialist", "spinal adjustment", "sports chiropractor", "posture correction"],
  },
  {
    slug: "acupuncturist",
    name: "Acupuncturist",
    pluralName: "Acupuncturists",
    icon: "🪡",
    shortPitch: "English-speaking acupuncturists and traditional Chinese medicine practitioners in Barcelona.",
    needOptions: ["Pain relief", "Stress / anxiety", "Fertility support", "General wellness", "Other"],
    seoKeywords: ["traditional Chinese medicine", "acupuncture clinic", "fertility acupuncture", "cupping therapy"],
  },
];

export function getArea(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
