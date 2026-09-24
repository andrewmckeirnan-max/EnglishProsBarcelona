import type { AreaSlug, CategorySlug } from "./types";

// How people actually search each profession (from Google autocomplete, see
// scripts/seo-queries.mjs): the everyday English synonyms, plus the Spanish
// term for people who search in Spanish. Used to widen the wording on category
// pages, FAQs and structured data so one page can match every variant.
export const categoryTerms: Record<CategorySlug, { synonyms: string[]; es: string }> = {
  dentist: { synonyms: ["dental clinic", "emergency dentist", "dentist for expats"], es: "dentista" },
  dermatologist: { synonyms: ["skin doctor", "skin specialist", "aesthetic clinic"], es: "dermatólogo" },
  doctor: { synonyms: ["GP", "family doctor", "private doctor", "private clinic"], es: "médico" },
  physiotherapist: { synonyms: ["physio", "physical therapist", "physiotherapy clinic"], es: "fisioterapeuta" },
  lawyer: { synonyms: ["solicitor", "attorney", "immigration lawyer"], es: "abogado" },
  psychologist: { synonyms: ["therapist", "psychotherapist", "counsellor"], es: "psicólogo" },
  "tax-advisor": { synonyms: ["tax accountant", "tax consultant", "expat tax adviser"], es: "asesor fiscal" },
  "property-advisor": { synonyms: ["real estate agent", "estate agent", "property lawyer"], es: "asesor inmobiliario" },
  chiropractor: { synonyms: ["chiropractic clinic", "back pain specialist"], es: "quiropráctico" },
  acupuncturist: { synonyms: ["acupuncture clinic", "traditional Chinese medicine"], es: "acupuntor" },
  nutritionist: { synonyms: ["dietitian", "nutrition coach"], es: "nutricionista" },
  naturopath: { synonyms: ["naturopathy", "natural medicine practitioner"], es: "naturópata" },
  "holistic-doctor": { synonyms: ["integrative medicine doctor", "holistic medicine"], es: "médico integrativo" },
  veterinarian: { synonyms: ["vet", "animal clinic", "pet doctor"], es: "veterinario" },
  lasik: { synonyms: ["laser eye surgery", "eye laser clinic"], es: "cirugía ocular láser" },
  "fertility-clinic": { synonyms: ["IVF clinic", "fertility specialist"], es: "clínica de fertilidad" },
  "plastic-surgeon": { synonyms: ["cosmetic surgeon", "aesthetic surgery"], es: "cirujano plástico" },
  "obgyn-midwife": { synonyms: ["gynaecologist", "OB-GYN", "midwife", "obstetrician"], es: "ginecólogo" },
  pediatrician: { synonyms: ["children's doctor", "kids doctor", "paediatrician"], es: "pediatra" },
  osteopath: { synonyms: ["osteopathy clinic", "osteopathic treatment"], es: "osteópata" },
  "autonomo-accountant": { synonyms: ["freelance accountant", "self-employed accountant", "gestor for autónomos"], es: "gestor para autónomos" },
  "business-lawyer": { synonyms: ["company lawyer", "corporate lawyer", "business setup lawyer"], es: "abogado mercantil" },
  "sworn-translator": { synonyms: ["certified translator", "official translation", "traductor jurado"], es: "traductor jurado" },
  orthodontist: { synonyms: ["braces", "Invisalign specialist"], es: "ortodoncista" },
  podiatrist: { synonyms: ["chiropodist", "foot doctor"], es: "podólogo" },
  "eye-care": { synonyms: ["optician", "optometrist", "eye doctor"], es: "óptica" },
  "occupational-therapist": { synonyms: ["OT", "occupational therapy"], es: "terapeuta ocupacional" },
  "speech-therapist": { synonyms: ["speech and language therapist", "speech therapy"], es: "logopeda" },
  "insurance-broker": { synonyms: ["health insurance broker", "expat insurance adviser"], es: "corredor de seguros" },
  "wealth-manager": { synonyms: ["financial adviser", "investment adviser", "financial planner"], es: "asesor financiero" },
  notary: { synonyms: ["notary public", "notario"], es: "notario" },
  "personal-trainer": { synonyms: ["PT", "fitness coach", "gym trainer"], es: "entrenador personal" },
  "driving-school": { synonyms: ["driving lessons", "driving licence exchange", "autoescuela"], es: "autoescuela" },
  "family-therapist": { synonyms: ["couples therapist", "family counsellor", "marriage counselling"], es: "terapeuta familiar" },
  "private-chauffeur": { synonyms: ["private driver", "airport transfer", "chauffeur service"], es: "chófer privado" },
  "storage-service": { synonyms: ["self storage", "storage unit", "luggage storage"], es: "trastero" },
  "house-clearance": { synonyms: ["apartment clearance", "flat clearance", "junk removal"], es: "vaciado de pisos" },
  "air-conditioning": { synonyms: ["AC repair", "aircon installation", "air conditioning installer"], es: "aire acondicionado" },
  locksmith: { synonyms: ["emergency locksmith", "lockout service"], es: "cerrajero" },
  "appliance-repair": { synonyms: ["washing machine repair", "appliance technician"], es: "reparación de electrodomésticos" },
  "pest-control": { synonyms: ["exterminator", "cockroach control", "bed bug treatment"], es: "control de plagas" },
  "balcony-terrace-design": { synonyms: ["terrace design", "balcony garden", "outdoor space design"], es: "diseño de terrazas" },
  "wedding-planner": { synonyms: ["destination wedding planner", "elopement planner"], es: "wedding planner" },
  recruiter: { synonyms: ["headhunter", "recruitment agency", "recruitment consultant"], es: "reclutador" },
  "private-chef": { synonyms: ["personal chef", "home chef", "villa chef"], es: "chef privado" },
};

// Other names people use for each neighbourhood we cover (spellings without
// accents or spaces, and well-known sub-areas that sit inside it).
export const areaAliases: Record<AreaSlug, string[]> = {
  eixample: ["Eixample Dreta", "Eixample Esquerra", "Sagrada Família"],
  poblenou: ["Poble Nou", "22@"],
  "sarria-sant-gervasi": ["Sarrià", "Sarria", "Sant Gervasi"],
  "les-corts": ["Pedralbes", "Camp Nou area"],
  "diagonal-mar": ["Vila Olímpica", "Front Marítim"],
  gracia: ["Gracia", "Vila de Gràcia"],
};

/** "physio, physical therapist or physiotherapy clinic" style list. */
export function humanList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} or ${items[items.length - 1]}`;
}
