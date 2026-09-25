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
  ics: { name: "Institut Català de la Salut: public price order (Generalitat de Catalunya)", url: "https://ics.gencat.cat/ca/lics/transparencia/economia-i-finances/preus-publics/", year: 2025 },
  boe: { name: "BOE: Real Decreto 1426/1989, official notary fee schedule", url: "https://www.boe.es/buscar/act.php?id=BOE-A-1989-28111", year: 2011 },
  dgt: { name: "DGT (Spanish traffic authority): foreign licence exchange fees", url: "https://www.dgt.es/nuestros-servicios/permisos-de-conducir/permisos-extranjeros-y-de-fuerzas-y-cuerpos-de-seguridad/canjes-de-permisos/paises-con-convenio-de-canjes/", year: 2026 },
  bcnCensus: { name: "Ajuntament de Barcelona: animal census registration", url: "https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/ca/tramit/20230001613", year: 2026 },
  ebylife: { name: "Ebylife: personal training prices in Barcelona", url: "https://www.ebylife.com/prices", year: 2026 },
  operarmeLasik: { name: "Operarme: LASIK price in Barcelona", url: "https://www.operarme.com/ophthalmology-and-oculoplasty/myopia-laser-surgery-cost/barcelona/", year: 2026 },
  verte: { name: "VERTE Ophthalmology Barcelona: LASIK", url: "https://www.verte.es/en/treatments/lasik-surgery/", year: 2026 },
  bookimedLasik: { name: "Bookimed: LASIK clinics and costs in Barcelona", url: "https://us-uk.bookimed.com/clinics/country=spain/city=barcelona/procedure=ilasik/", year: 2026 },
  clinic123: { name: "123.clinic: Invisalign in Spain, cost and clinics", url: "https://www.123.clinic/en/clinic-search/invisalign-full/spain", year: 2026 },
  turoInvisalign: { name: "Turó Park Clinics: Invisalign in Barcelona", url: "https://turoparkmedical.com/dental-clinic-barcelona/the-invisalign-method-invisible-orthodontics-in-barcelona/", year: 2026 },
  operarmeDerm: { name: "Operarme: dermatology consultation in Barcelona", url: "https://www.operarme.com/private-consultations/dermatology-consultation-cost/barcelona/", year: 2026 },
  bookimedDerm: { name: "Bookimed: dermatologist consultation in Barcelona", url: "https://us-uk.bookimed.com/clinics/country=spain/city=barcelona/procedure=consultation-of-dermatologist/", year: 2026 },
  badal: { name: "Centro Médico Badal: gynaecological service prices", url: "https://centromedicobadal.es/en/prices-gynecological-services/", year: 2026 },
  operarmeGyn: { name: "Operarme: gynaecology consultation in Barcelona", url: "https://www.operarme.com/private-consultations/consultation-with-gynecologist-cost/barcelona/", year: 2026 },
  dribo: { name: "Dribo: cost of a driving licence in Barcelona", url: "https://dribo.es/blog/cuanto-cuesta-carnet-conducir-barcelona", year: 2026 },
  agape: { name: "Agape Weddings: wedding planner cost in Barcelona", url: "https://www.agapeweddings.love/post/how-much-does-a-wedding-planner-cost-in-barcelona-a-comprehensive-guide/", year: 2023 },
  mynatural: { name: "My Natural Wedding: wedding planner cost in Spain", url: "https://mynaturalwedding.com/en/how-much-does-a-wedding-planner-cost-spain/", year: 2025 },
  osteoBcn: { name: "OsteopatiaBCN: prices", url: "https://osteopatiabcn.cat/en/prices/", year: 2026 },
  logopeda: { name: "Logopeda Barcelona: speech therapy FAQs and prices", url: "https://logopeda.barcelona/en/frequently-asked-questions/", year: 2026 },
  privaclinic: { name: "Privaclinic: acupuncture sessions in Barcelona", url: "https://privaclinic.com/en/catalonia/barcelona/acupuncture-session-barcelona/", year: 2026 },
  insuranceCost: { name: "Health Insurance for Spanish Visas: cost in 2026", url: "https://healthinsuranceforspanishvisas.com/health-insurance-spain-cost/", year: 2026 },
  trustin: { name: "Trustin: real estate agent fees in Spain", url: "https://trustin.es/en/blog/real-estate-agent-fees-spain", year: 2026 },
  bitaclim: { name: "Bitaclim: air conditioning installation cost in Spain", url: "https://bitaclim.es/en/blog/air-conditioning-installation-cost-spain", year: 2026 },
  jagAircon: { name: "JAG Alcaide: air conditioning installation price in Barcelona", url: "https://www.jagalcaide.com/precio-instalacion-aire-acondicionado/", year: 2026 },
  box2box: { name: "Box2Box: storage unit prices in Barcelona", url: "https://www.box2boxstorage.com/es-en/blog/storage-unit-rental-barcelona", year: 2026 },
  spainPest: { name: "Spain Pest Guide: pest control costs in Spain", url: "https://spainpestguide.com/blog/hidden-costs-pests-spain-property/", year: 2026 },
  transfers: { name: "GetYourGuide: Barcelona airport transfers", url: "https://www.getyourguide.com/barcelona-l45/airport-transfers-tc153/", year: 2026 },
  allardGolay: { name: "Allard & Golay chiropractors: prices", url: "https://www.quiropracticoallardgolay.com", year: 2026 },
  locallistaNutri: { name: "Locallista: English-speaking nutritionists in Barcelona", url: "https://www.locallista.com/en/bcn/nutritionists", year: 2026 },
  englishDoctor: { name: "English Doctor Barcelona: services and fees", url: "https://www.englishdoctorbarcelona.com", year: 2026 },
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
  { id: "gp-private", categorySlug: "doctor", service: "Private GP appointment", unit: "per visit", low: 60, high: 120, note: "Clinics that serve patients entirely in English tend to sit toward the top of the range. Home visits and specialists cost more.", ask: ["Will the doctor conduct the whole visit in English?", "Are tests charged separately?"], sources: ["traveldoctores", "englishDoctor"], confidence: "good" },
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
  { id: "notary-purchase", categorySlug: "notary", service: "Notary fee for a home purchase", unit: "per deed, before VAT", low: 500, high: 1200, note: "Notary fees are set by regulation and are the same at every notary. They come to about 0.1 to 0.5 per cent of the price, which is roughly €850 for a €100,000 home and €1,000 for €250,000.", ask: ["Which extras (copies, translations) are billed on top?"], sources: ["boe", "wiseNotary", "idealistaBuying"], confidence: "good" },
  { id: "buying-costs", categorySlug: "property-advisor", service: "Total buying costs on top of the price", unit: "of the purchase price", low: 10, high: 12, currency: "pct", note: "Transfer tax, notary, land registry and valuation together. The transfer tax rate depends on the region and is the biggest part, so check the current Catalan rate.", ask: ["Which taxes apply to this specific property?"], sources: ["idealistaBuying", "wiseNotary"], confidence: "limited" },

  { id: "locksmith-change", categorySlug: "locksmith", service: "Locksmith: change a simple lock", unit: "per job", low: 80, high: 200, note: "Labour is roughly €40 to €70 an hour. Out-of-hours callouts can be far higher, and published figures vary widely, so always agree the price before work starts.", ask: ["What is the total price including the call-out and any night surcharge?"], sources: ["rightcasa"], confidence: "limited" },

  // Private chef
  { id: "private-chef", categorySlug: "private-chef", service: "Private chef at home", unit: "per guest", low: 44, high: 73, note: "Platform entry prices fall as group size grows, from around €73 a guest for two to €44 for thirteen or more. Menu, season and neighbourhood move the final figure, and premium chefs charge much more.", ask: ["Are ingredients, service and cleaning included?"], sources: ["takeachef"], confidence: "limited" },

  // Official public-sector prices
  { id: "gp-public-rate", categorySlug: "doctor", service: "Public health centre GP visit, billed rate", unit: "per visit (non-urgent to urgent)", low: 65, high: 90, typical: 65, note: "This is what the Catalan public health service (ICS) bills people who are not covered by the public system, from its 2025 official price order. Residents registered with the public system do not pay it. It is a useful ceiling check for private GP prices.", ask: ["Am I covered by the public system, or will I be billed?"], sources: ["ics"], confidence: "good" },

  // Dermatologist
  { id: "derm-consult", categorySlug: "dermatologist", service: "Private dermatologist consultation", unit: "per consultation", low: 69, high: 150, note: "Prices start near €70 to €80 at hospital-linked clinics that sell fixed-price consultations. Established specialists and top-end private dermatologists commonly charge about €120 to €150 for a first consultation. Procedures and tests are extra.", ask: ["Is a skin check or dermoscopy included?", "Are any tests charged separately?"], sources: ["operarmeDerm", "bookimedDerm"], confidence: "limited" },

  // Gynaecologist
  { id: "gyn-consult", categorySlug: "obgyn-midwife", service: "Private gynaecology consultation", unit: "per visit", low: 50, high: 140, note: "A simple examination is around €50 to €60, with cytology about €70, and a full visit with ultrasound about €130 to €140. Contraceptive procedures and tests are priced separately.", ask: ["Is an ultrasound or smear test included?"], sources: ["badal", "operarmeGyn"], confidence: "good" },

  // LASIK
  { id: "lasik", categorySlug: "lasik", service: "LASIK laser eye surgery", unit: "per eye", low: 990, high: 2500, note: "Some clinics advertise from about €1,000 per eye all-inclusive, while premium technology and surgeons can reach €2,500 or more. Check that the pre-operative assessment, aftercare visits and any retreatment are included, and budget for eye drops.", ask: ["What is included, and for how long?", "Is retreatment included, and for how many months?"], sources: ["operarmeLasik", "verte", "bookimedLasik"], confidence: "good" },

  // Orthodontist
  { id: "invisalign", categorySlug: "orthodontist", service: "Invisalign clear aligners", unit: "per treatment", low: 2950, high: 5460, note: "Barcelona clinics advertise from about €2,950, while the Spanish average is closer to €4,700. Treatment length, the number of aligners and whether retainers and follow-up visits are included move the price. Many clinics offer interest-free instalments.", ask: ["Are retainers and follow-up visits included?", "What if treatment takes longer than planned?"], sources: ["clinic123", "turoInvisalign"], confidence: "limited" },

  // Personal trainer
  { id: "personal-trainer", categorySlug: "personal-trainer", service: "One-to-one personal training", unit: "per session", low: 40, high: 90, typical: 60, note: "Freelance trainers commonly charge about €40 to €70 a session, and premium private studios about €70 to €90 with packs. Buying a pack of 5, 10 or 20 sessions usually lowers the price per session.", ask: ["What does a pack cost and how long is it valid?", "What is the cancellation policy?"], sources: ["ebylife"], confidence: "limited" },

  // Driving school
  { id: "driving-lesson", categorySlug: "driving-school", service: "Practical driving lesson", unit: "per lesson", low: 29, high: 45, note: "Traditional Barcelona driving schools charge about €29 to €45 a lesson. Many learners need 20 to 40 lessons before the test.", ask: ["Is the lesson a full hour?", "What are the registration and theory fees?"], sources: ["dribo"], confidence: "limited" },
  { id: "driving-licence-total", categorySlug: "driving-school", service: "Full car licence (category B) in Barcelona", unit: "total, all fees", low: 800, high: 1500, note: "Includes registration, theory, the fixed DGT exam fees (about €94 for two attempts), a medical certificate (about €30 to €60) and practical lessons. The number of lessons you need is the biggest variable.", ask: ["Is the DGT fee included?", "How many lessons does the pack include?"], sources: ["dribo"], confidence: "limited" },
  { id: "dgt-exchange", categorySlug: "driving-school", service: "DGT fee to exchange a foreign car licence", unit: "official fee", low: 28, high: 29, note: "Set by the DGT and the same nationwide: €28.87 for a car or motorcycle licence with no exam, €94.05 if exams are required (for example trucks and buses). You also need a medical certificate, priced separately.", ask: ["Does my country have an exchange agreement with Spain?"], sources: ["dgt"], confidence: "good" },

  // Wedding planner
  { id: "wedding-planner", categorySlug: "wedding-planner", service: "Full wedding planning", unit: "planner fee", low: 2000, high: 5000, note: "Barcelona and Madrid sit at the top of Spanish planner prices. Some planners charge 10 to 20 per cent of the wedding budget instead of a flat fee, and day-of coordination costs less. Venue, catering and other costs come on top.", ask: ["Flat fee or percentage of budget?", "What is included: venue search, vendors, day-of coordination?"], sources: ["agape", "mynatural"], confidence: "limited" },

  // Official pet census
  { id: "bcn-pet-census", categorySlug: "veterinarian", service: "Registering a pet in the Barcelona animal census", unit: "council fee", low: 0, high: 38, note: "Barcelona's council lists registration as free for animals identified with a microchip, and a €38 fee for those who do not qualify for the exemption. You need a microchip and a health certificate from a vet, and must register within 30 days of moving or acquiring the animal.", ask: ["Which vet certificate does the council require?"], sources: ["bcnCensus"], confidence: "limited" },

  // More professions
  { id: "osteopath-session", categorySlug: "osteopath", service: "Osteopathy session", unit: "per session", low: 45, high: 70, note: "A first session is often around €60 for an hour, with follow-ups around €50. Home visits cost about €70. Some physiotherapy clinics that also offer osteopathy charge around €69.", ask: ["Is the first session longer and priced differently?", "Is a home visit possible and what does it cost?"], sources: ["osteoBcn", "bwell"], confidence: "good" },
  { id: "acupuncture-session", categorySlug: "acupuncturist", service: "Acupuncture session", unit: "per session", low: 30, high: 90, typical: 65, note: "Short 30-minute sessions start near €30. Full-length treatments with an experienced practitioner more commonly cost about €60 to €70, and a first consultation with treatment can reach about €90. Specialist treatments such as facial acupuncture are priced separately.", ask: ["How long is the session?", "Is the first consultation priced differently?"], sources: ["privaclinic"], confidence: "limited" },
  { id: "speech-therapy", categorySlug: "speech-therapist", service: "Speech therapy session", unit: "per 45 minute session", low: 50, high: 55, note: "One Barcelona practice lists €55 in person and €50 online. Improvement is often reported after 4 to 10 sessions, depending on the case. Prices elsewhere may differ.", ask: ["Is an initial assessment charged separately?", "Are online sessions available?"], sources: ["logopeda"], confidence: "limited" },
  { id: "health-insurance", categorySlug: "insurance-broker", service: "Private health insurance, adult under 40", unit: "per month", low: 55, high: 85, note: "For a 35-year-old in Barcelona, published comparisons put the main insurers at roughly €55 to €85 a month for no-copay plans. Premiums rise steeply with age, and many visa applications require annual payment upfront.", ask: ["Is it a copay or no-copay plan?", "Does it meet the requirements for my visa?"], sources: ["insuranceCost"], confidence: "limited" },
  { id: "tax-return", categorySlug: "tax-advisor", service: "Gestor to file a personal tax return", unit: "per filing, before VAT", low: 80, high: 200, note: "Simple Spanish resident returns sit at the low end and non-resident or multi-income returns at the high end. Some gestors include it in a monthly plan.", ask: ["What income types does the price cover?", "Is VAT included?"], sources: ["conta", "movingtospain"], confidence: "good" },
  { id: "agent-commission", categorySlug: "property-advisor", service: "Estate agent commission on a sale", unit: "of the sale price, plus 21% VAT", low: 3, high: 5, currency: "pct", note: "Commissions are unregulated and negotiable, and in Barcelona and Madrid they typically run 3 to 5 per cent, against 5 to 7 per cent in coastal markets. The seller normally pays. For rentals, the landlord pays the agency fee under the 2023 housing law.", ask: ["Is VAT included in the quoted percentage?", "Is the contract exclusive?"], sources: ["trustin"], confidence: "limited", },
  { id: "aircon-install", categorySlug: "air-conditioning", service: "Air conditioning split unit, installed", unit: "1 unit, equipment and installation", low: 600, high: 1650, note: "National guides quote about €600 to €1,500 for a single split. Barcelona providers quote roughly €1,150 to €1,650 for a mid-to-high range unit fully installed, with labour alone about €300 to €500. Multi-split and ducted systems cost much more.", ask: ["Does the price include the unit, VAT and the wall work?", "What is the warranty?"], sources: ["bitaclim", "jagAircon"], confidence: "good" },
  { id: "storage-1m2", categorySlug: "storage-service", service: "Storage unit, 1 m²", unit: "per month", low: 41, high: 70, note: "Traditional operators charge about €50 to €70 a month for a 1 m² unit, and door-to-door pickup models start near €41. Prices in central areas like Eixample and Gràcia run 15 to 20 per cent above average. The source is itself a storage provider.", ask: ["What is the minimum term and the deposit?", "Is insurance included?"], sources: ["box2box"], confidence: "limited" },
  { id: "storage-3m2", categorySlug: "storage-service", service: "Storage unit, 3 m²", unit: "per month", low: 79, high: 150, note: "Roughly €100 to €150 at traditional operators and around €80 at lower-priced providers. Compare what is included, such as pickup, insurance and access hours.", ask: ["Is insurance included?", "Can I access it whenever I like?"], sources: ["box2box"], confidence: "limited" },
  { id: "pest-control", categorySlug: "pest-control", service: "Pest control treatment for a flat", unit: "per visit", low: 80, high: 200, note: "A standard cockroach or insect treatment is about €80 to €150, and annual contracts for an apartment run about €200 to €350. Termite inspections in risk areas cost around €150 to €300.", ask: ["Is a follow-up visit included?", "Is there a warranty period?"], sources: ["spainPest"], confidence: "limited" },
  { id: "airport-transfer", categorySlug: "private-chauffeur", service: "Private airport transfer", unit: "one way", low: 70, high: 95, note: "Private chauffeur transfers from Barcelona airport start at roughly €70 to €95, against about €32 for a taxi to the city centre. The private price includes meet and greet and a vehicle sized to your group. Hourly chauffeur rates are usually quoted on request.", ask: ["Is meet and greet and waiting time included?", "Is the price fixed or metered?"], sources: ["transfers"], confidence: "limited" },

  { id: "chiropractor-session", categorySlug: "chiropractor", service: "Chiropractic session", unit: "first visit to follow-up", low: 40, high: 100, note: "First visits are typically about €60 to €90 and follow-up adjustments about €40 to €65. One Barcelona practice lists €80 for a first visit, €55 for a regular adjustment and €40 for children. Some clinics charge the adjustment separately from the first-visit assessment.", ask: ["Does the first-visit price include an adjustment?", "Are packs of sessions available?"], sources: ["allardGolay"], confidence: "limited" },
  { id: "nutritionist-consult", categorySlug: "nutritionist", service: "Nutritionist consultation", unit: "per consultation", low: 25, high: 150, note: "Published sources disagree. One expat directory puts a consultation at €25 to €70 with packages of €210 to €295, while other price guides put a first assessment at €70 to €150 and follow-ups at €40 to €90. Nutritionists and dietitians are different from endocrinologists, who are medical doctors and charge more.", ask: ["Is the meal plan included?", "What do follow-up visits cost?"], sources: ["locallistaNutri"], confidence: "limited" },
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
