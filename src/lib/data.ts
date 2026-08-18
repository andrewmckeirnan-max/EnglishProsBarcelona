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
      "Barcelona's grand 19th-century grid: wide boulevards, Gaudí landmarks like Casa Batlló and La Pedrera, and the city's business and shopping core. Home to the largest international community in Barcelona.",
  },
  {
    slug: "poblenou",
    name: "Poblenou",
    district: "Sant Martí",
    blurb:
      "A former industrial district turned tech and creative hub, loft-style buildings, beachfront promenade, and a young international crowd. Right on the coast in Sant Martí.",
  },
  {
    slug: "sarria-sant-gervasi",
    name: "Sarrià-Sant Gervasi",
    district: "Sarrià-Sant Gervasi",
    blurb:
      "Leafy, upscale and quiet, Barcelona's most established residential district for international families, close to several of the city's international schools.",
  },
  {
    slug: "les-corts",
    name: "Les Corts",
    district: "Les Corts",
    blurb:
      "A calm, residential district best known as home to Camp Nou, popular with international families who want good schools and private healthcare close by.",
  },
  {
    slug: "diagonal-mar",
    name: "Diagonal Mar & Vila Olímpica",
    district: "Sant Martí",
    blurb:
      "Barcelona's modern beachfront district: marina views, high-rise apartments and the 1992 Olympic waterfront. One of the city's most international, sea-view neighbourhoods.",
  },
  {
    slug: "gracia",
    name: "Gràcia",
    district: "Gràcia",
    blurb:
      "A bohemian, village-like neighbourhood of small squares, independent shops and a strong café culture, home to one of Barcelona's largest European communities.",
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
    shortPitch: "Compare English-speaking dentists: implants, Invisalign, cosmetic dentistry and check-ups.",
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
    hidden: true, // paused, not pursuing property/mortgage for now
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
    shortPitch: "English-speaking dermatologists and aesthetic clinics: skin checks, acne, Botox and laser treatments.",
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
  {
    slug: "fertility-clinic",
    name: "Fertility & IVF Clinic",
    pluralName: "Fertility & IVF Clinics",
    icon: "👶",
    shortPitch: "English-speaking fertility and IVF clinics for individuals and couples in Barcelona.",
    needOptions: ["IVF", "Egg freezing", "Fertility assessment", "Donor programs", "Other"],
    seoKeywords: ["IVF clinic", "egg freezing", "fertility treatment", "reproductive medicine"],
  },
  {
    slug: "plastic-surgeon",
    name: "Plastic & Cosmetic Surgeon",
    pluralName: "Plastic & Cosmetic Surgeons",
    icon: "💎",
    shortPitch: "English-speaking plastic and cosmetic surgeons for aesthetic procedures in Barcelona.",
    needOptions: ["Rhinoplasty", "Breast surgery", "Liposuction / body contouring", "Facial procedures", "Consultation only", "Other"],
    seoKeywords: ["rhinoplasty", "breast augmentation", "liposuction", "cosmetic surgery clinic"],
  },
  {
    slug: "lasik",
    name: "LASIK & Eye Surgery Clinic",
    pluralName: "LASIK & Eye Surgery Clinics",
    icon: "👁️",
    shortPitch: "English-speaking LASIK and laser eye surgery clinics for vision correction in Barcelona.",
    needOptions: ["LASIK consultation", "Vision correction", "Cataract surgery", "General ophthalmology", "Other"],
    seoKeywords: ["laser eye surgery", "vision correction", "cataract surgery", "ophthalmologist"],
  },
  {
    slug: "nutritionist",
    name: "Nutritionist & Dietitian",
    pluralName: "Nutritionists & Dietitians",
    icon: "🥗",
    shortPitch: "English-speaking nutritionists and dietitians for weight management, sports and clinical nutrition.",
    needOptions: ["Weight management", "Sports nutrition", "Clinical / medical diet", "General healthy eating", "Other"],
    seoKeywords: ["sports nutritionist", "weight loss", "clinical dietitian", "meal planning"],
  },
  {
    slug: "naturopath",
    name: "Naturopath",
    pluralName: "Naturopaths",
    icon: "🌿",
    shortPitch: "English-speaking naturopaths offering holistic and natural health treatments in Barcelona.",
    needOptions: ["General wellness", "Digestive health", "Hormonal balance", "Stress / fatigue", "Other"],
    seoKeywords: ["holistic medicine", "natural health", "herbal medicine", "naturopathy clinic"],
  },
  {
    slug: "orthodontist",
    name: "Orthodontist",
    pluralName: "Orthodontists",
    icon: "😬",
    shortPitch: "English-speaking orthodontists for Invisalign, braces and bite correction in Barcelona.",
    needOptions: ["Invisalign", "Traditional braces", "Bite correction", "Consultation only", "Other"],
    seoKeywords: ["Invisalign", "braces", "bite correction", "clear aligners"],
  },
  {
    slug: "podiatrist",
    name: "Podiatrist",
    pluralName: "Podiatrists",
    icon: "🦶",
    shortPitch: "English-speaking podiatrists for foot and ankle care in Barcelona.",
    needOptions: ["General foot care", "Ingrown toenail", "Sports injury", "Orthotics", "Other"],
    seoKeywords: ["foot doctor", "ankle specialist", "orthotics", "ingrown toenail"],
  },
  {
    slug: "eye-care",
    name: "Eye Care Specialist",
    pluralName: "Eye Care Specialists",
    icon: "👓",
    shortPitch: "English-speaking optometrists and ophthalmologists for eye exams, glasses and contact lenses in Barcelona.",
    needOptions: ["Eye exam", "Glasses / contact lenses", "Eye health concern", "Second opinion", "Other"],
    seoKeywords: ["optometrist", "ophthalmologist", "eye exam", "glasses", "contact lenses"],
  },
  {
    slug: "occupational-therapist",
    name: "Occupational Therapist",
    pluralName: "Occupational Therapists",
    icon: "🧩",
    shortPitch: "English-speaking occupational therapists for rehabilitation and daily-function support in Barcelona.",
    needOptions: ["Injury rehabilitation", "Developmental support", "Post-surgery recovery", "Workplace assessment", "Other"],
    seoKeywords: ["occupational therapy", "rehabilitation", "sensory processing", "daily living skills"],
  },
  {
    slug: "speech-therapist",
    name: "Speech Therapist",
    pluralName: "Speech Therapists",
    icon: "🗨️",
    shortPitch: "English-speaking speech and language therapists for children and adults in Barcelona.",
    needOptions: ["Child speech delay", "Bilingual development", "Adult speech therapy", "Stuttering", "Other"],
    seoKeywords: ["speech delay", "bilingual children", "language therapy", "stuttering"],
  },
  {
    slug: "insurance-broker",
    name: "Insurance Broker",
    pluralName: "Insurance Brokers",
    icon: "🛡️",
    shortPitch: "English-speaking insurance brokers for private health, home and life insurance in Barcelona.",
    needOptions: ["Private health insurance", "Home insurance", "Life insurance", "Business insurance", "Other"],
    seoKeywords: ["private health insurance", "expat insurance", "home insurance", "life insurance"],
  },
  {
    slug: "wealth-manager",
    name: "Wealth Manager & Investment Consultant",
    pluralName: "Wealth Managers & Investment Consultants",
    icon: "📈",
    shortPitch: "English-speaking wealth managers and investment consultants for expats and residents in Barcelona.",
    needOptions: ["Investment planning", "Retirement planning", "Cross-border tax planning", "Portfolio review", "Other"],
    seoKeywords: ["wealth manager", "financial advisor", "investment consultant", "pension planning"],
  },
  {
    slug: "notary",
    name: "Notary",
    pluralName: "Notaries",
    icon: "🖋️",
    shortPitch: "English-speaking notaries for property purchases and official document signings in Barcelona.",
    needOptions: ["Property purchase signing", "Power of attorney", "Document certification", "Other"],
    seoKeywords: ["notario", "property closing", "power of attorney", "document certification"],
  },
  {
    slug: "veterinarian",
    name: "Veterinarian",
    pluralName: "Veterinarians",
    icon: "🐾",
    shortPitch: "English-speaking vets for check-ups, vaccinations and emergency pet care in Barcelona.",
    needOptions: ["Check-up / vaccination", "Emergency", "Surgery", "Dental (pet)", "Other"],
    seoKeywords: ["emergency vet", "pet vaccination", "vet clinic", "animal hospital"],
  },
  {
    slug: "obgyn-midwife",
    name: "Ob-Gyn & Midwife",
    pluralName: "Ob-Gyns & Midwives",
    icon: "🤰",
    shortPitch: "English-speaking obstetricians, gynaecologists and midwives for pregnancy, birth and women's health in Barcelona.",
    needOptions: ["Pregnancy care", "Birth / delivery", "Gynaecology check-up", "Postpartum care", "Fertility support", "Other"],
    seoKeywords: ["obstetrician", "gynaecologist", "midwife", "pregnancy doctor", "prenatal care"],
  },
  {
    slug: "pediatrician",
    name: "Pediatrician",
    pluralName: "Pediatricians",
    icon: "🧸",
    shortPitch: "English-speaking pediatricians for check-ups, vaccinations and children's health in Barcelona.",
    needOptions: ["General check-up", "Vaccinations", "Newborn care", "Urgent / sick visit", "Other"],
    seoKeywords: ["children's doctor", "newborn check-up", "vaccination schedule", "kids doctor"],
  },
  {
    slug: "osteopath",
    name: "Osteopath",
    pluralName: "Osteopaths",
    icon: "🤸",
    shortPitch: "English-speaking osteopaths for musculoskeletal pain, mobility and manual therapy in Barcelona.",
    needOptions: ["Back / neck pain", "Joint pain", "Post-injury mobility", "Pregnancy-related pain", "General wellness", "Other"],
    seoKeywords: ["osteopathy clinic", "manual therapy", "musculoskeletal pain", "cranial osteopathy"],
  },
  {
    slug: "autonomo-accountant",
    name: "Freelancer & Autónomo Accountant",
    pluralName: "Freelancer & Autónomo Accountants",
    icon: "🧾",
    shortPitch: "English-speaking accountants specifically for freelancers and autónomos: quarterly filings, invoicing and social security.",
    needOptions: ["Becoming autónomo", "Quarterly tax filings", "Invoicing setup", "Social security questions", "Annual accounts", "Other"],
    seoKeywords: ["autonomo accountant", "freelancer accounting", "quarterly VAT", "self-employed Spain"],
  },
  {
    slug: "business-lawyer",
    name: "Business Lawyer",
    pluralName: "Business Lawyers",
    icon: "🏢",
    shortPitch: "English-speaking business lawyers for company formation, contracts and corporate law in Barcelona.",
    needOptions: ["Company formation", "Contracts", "Corporate structuring", "Shareholder agreements", "Other"],
    seoKeywords: ["company formation lawyer", "SL company Spain", "corporate lawyer", "business setup"],
  },
  {
    slug: "sworn-translator",
    name: "Translator & Sworn Translator",
    pluralName: "Translators & Sworn Translators",
    icon: "📜",
    shortPitch: "English-speaking sworn (certified) translators for official documents, contracts and legal paperwork.",
    needOptions: ["Sworn/certified translation", "Document translation", "Contract translation", "Interpreting", "Other"],
    seoKeywords: ["sworn translator", "certified translation", "traductor jurado", "official document translation"],
  },
];

// Use this everywhere a category is listed for a visitor to pick from (nav,
// grids, the lead form, the sitemap). `categories` and `getCategory` stay
// unfiltered so already-hidden categories' data (e.g. existing verified
// listings) keeps working the moment `hidden` is flipped back off.
export const visibleCategories: Category[] = categories.filter((c) => !c.hidden);

export function getArea(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
