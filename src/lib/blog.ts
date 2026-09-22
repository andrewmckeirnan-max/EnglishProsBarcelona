import type { AreaSlug, CategorySlug } from "./types";

export interface BlogSegment {
  text: string;
  href?: string; // internal link only, e.g. "/eixample/dentist"
}

export type BlogBlock =
  | { type: "p"; segments: BlogSegment[] }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export interface BlogSource {
  name: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string; // meta description
  excerpt: string; // shown on /blog index card
  publishedDate: string; // ISO yyyy-mm-dd
  updatedDate?: string;
  readingMinutes: number;
  /** Shown as a "Related" strip at the end of the post, on top of whatever
   * inline links appear in the body. */
  relatedCategorySlugs?: CategorySlug[];
  relatedAreaSlugs?: AreaSlug[];
  content: BlogBlock[];
  /** Real sources consulted while researching this post, shown openly at
   * the bottom. Nothing here is quoted verbatim from these sources, only
   * facts, paraphrased and re-verified against our own category/area data
   * where they overlap (e.g. dentist coverage per area). */
  sources: BlogSource[];
}

const p = (segments: BlogSegment[]): BlogBlock => ({ type: "p", segments });
const h2 = (text: string): BlogBlock => ({ type: "h2", text });
const h3 = (text: string): BlogBlock => ({ type: "h3", text });
const ul = (items: string[]): BlogBlock => ({ type: "ul", items });

export const blogPosts: BlogPost[] = [
  {
    slug: "best-barcelona-neighbourhoods-for-english-speakers",
    title: "Which Barcelona Neighbourhood Is Actually Right for English Speakers?",
    description:
      "A practical, honest breakdown of Eixample, Gràcia, Poblenou, Sarrià-Sant Gervasi, Les Corts and Diagonal Mar for English-speaking residents moving to Barcelona.",
    excerpt:
      "Eixample, Gràcia, Poblenou, Sarrià-Sant Gervasi, Les Corts or Diagonal Mar? What each one actually feels like to live in as an English speaker, not just the postcard version.",
    publishedDate: "2026-09-22",
    readingMinutes: 6,
    relatedAreaSlugs: ["eixample", "gracia", "poblenou", "sarria-sant-gervasi", "les-corts", "diagonal-mar"],
    content: [
      p([
        {
          text: "Every \"best neighbourhood in Barcelona\" list reads the same: pretty photos, a line about tapas, and no actual answer. The honest version depends on something much more boring: what your daily life looks like once the novelty wears off. Here's what each of the six areas we cover is genuinely like to live in as an English speaker, not a tourist.",
        },
      ]),
      h2("Eixample: the default, for a reason"),
      p([
        {
          text: "Eixample has the largest concentration of foreign residents in the city, and it shows in the everyday stuff: more English-speaking clinics, more co-working spaces, more staff at the pharmacy who'll switch languages without you asking. The grid layout means almost everything is a flat, short walk, and transport connections are the best in the city. The trade-off is that you're paying for the convenience, and \"Eixample\" covers a lot of ground, so the block matters more than the neighbourhood name.",
          href: "/eixample",
        },
      ]),
      h2("Gràcia: village life inside a big city"),
      p([
        {
          text: "Gràcia was its own town before Barcelona absorbed it, and it still feels that way: small squares, independent shops, a slower pace than Eixample ten minutes away. It has one of the city's larger European resident communities, which makes it a genuinely social option rather than just a scenic one. The narrow streets and older buildings mean fewer lifts and tighter parking, worth knowing before you fall for a listing.",
          href: "/gracia",
        },
      ]),
      h2("Poblenou: the tech-and-beach option"),
      p([
        {
          text: "A former industrial district that's become the city's closest thing to a tech hub, Poblenou pairs loft-style ex-factory buildings with direct beach access, which is a genuinely rare combination in Barcelona. It skews younger and more remote-work-friendly than the other five areas. It's also the newest of the six to develop, so the English-speaking service network here is real but thinner in a few categories than in Eixample or Sarrià.",
          href: "/poblenou",
        },
      ]),
      h2("Sarrià-Sant Gervasi: where the international families are"),
      p([
        {
          text: "Leafy, quiet and residential, this is Barcelona's established base for international families, largely because several of the city's international schools sit in or near it. It's the furthest of the six from the beach and the old city centre, which is precisely the appeal for people prioritising space and calm over nightlife.",
          href: "/sarria-sant-gervasi",
        },
      ]),
      h2("Les Corts: calm, residential, well-connected"),
      p([
        {
          text: "Best known outside Barcelona as Camp Nou's neighbourhood, Les Corts is otherwise a quiet, family-oriented district with good private healthcare access and less tourist traffic than almost anywhere else on this list. It's a sensible, slightly under-discussed option if Sarrià's prices don't work but you want the same calm.",
          href: "/les-corts",
        },
      ]),
      h2("Diagonal Mar & Vila Olímpica: the modern waterfront"),
      p([
        {
          text: "Built for the 1992 Olympics and expanded since, this is Barcelona's high-rise, marina-view district, genuinely international but also the newest and most self-contained of the six. Because it's smaller and more residential-only than the others, it's also the one area where we consistently find the fewest independent English-speaking professionals, worth factoring in if you'll want in-person appointments rather than someone who comes to you.",
          href: "/diagonal-mar",
        },
      ]),
      h2("How to actually decide"),
      p([
        { text: "Skip the ranked lists and ask three questions instead: how far are you willing to be from the centre, do you need an international school nearby, and would you rather have more English-speaking options within walking distance or more space for less money. Those three answers point at a district faster than any \"top 10\" ever will." },
      ]),
    ],
    sources: [
      { name: "idealista/news: 6 best neighbourhoods in Barcelona to live in", url: "https://www.idealista.com/en/news/lifestyle-in-spain/2026/03/23/154158-barcelonas-best-neighbourhoods-to-live-in" },
      { name: "Expatica: Barcelona's neighbourhoods: where to live in Barcelona", url: "https://www.expatica.com/es/moving/location/where-to-live-in-barcelona-101435/" },
      { name: "HousingAnywhere: Barcelona neighbourhood guide", url: "https://housinganywhere.com/Barcelona--Spain/barcelona-neighborhood-guide" },
      { name: "Migaku: Best Barcelona Neighborhoods for Foreigners", url: "https://migaku.com/blog/language-fun/best-neighborhoods-in-barcelona-for-foreigners-el-born-gracia-eixample-and-beyon" },
    ],
  },
  {
    slug: "nie-empadronamiento-barcelona-guide",
    title: "NIE and Empadronamiento: The Paperwork Nobody Warns You About",
    description:
      "What the NIE and empadronamiento actually are, why Barcelona wants both before you can do almost anything else, and the mistakes that cost people weeks.",
    excerpt:
      "Two acronyms, one town hall queue, and almost nothing else works until you've got both. Here's what NIE and empadronamiento actually mean and where people lose the most time.",
    publishedDate: "2026-09-22",
    readingMinutes: 5,
    relatedCategorySlugs: ["lawyer", "sworn-translator", "autonomo-accountant"],
    content: [
      p([
        {
          text: "Almost everything else on this site assumes you've already cleared two pieces of paperwork most people have never heard of before landing in Spain: the NIE and the empadronamiento. Neither is optional, both are confusing on purpose to nobody in particular, and mixing them up is the single most common way people waste their first month in Barcelona.",
        },
      ]),
      h2("NIE: your Spanish ID number, not a residency permit"),
      p([
        { text: "The NIE (Número de Identidad de Extranjero) is simply a fixed identification number the Spanish state assigns to any foreigner it needs to track for legal or financial purposes, opening a bank account, signing a lease, registering a business, paying tax. It is not, by itself, permission to live or work in Spain. People confuse this constantly: having an NIE means Spain can identify you on paper, it doesn't mean you have a visa or residency status. Those are separate processes entirely, usually handled by an " },
        { text: "immigration lawyer", href: "/eixample/lawyer" },
        { text: " if your situation isn't a straightforward EU-citizen case." },
      ]),
      h2("Empadronamiento: proving where you actually live"),
      p([
        {
          text: "The empadronamiento is your registration with the local town hall (ayuntamiento) confirming your address, functionally closer to a census entry than an ID document. It's mandatory for everyone living in Spain, Spanish citizens included, and it's what unlocks the things people actually move for: enrolling in public healthcare, registering children for school, and later, if relevant, applying for residency or nationality. Barcelona, like Madrid, offers online booking for the appointment, which helps, but slots at busy town hall offices still routinely run weeks out.",
        },
      ]),
      h3("What you'll typically need to bring"),
      ul([
        "Valid ID: passport, and your NIE certificate if you already have one",
        "Proof of address: a rental contract, property deed, or a recent utility bill in your name",
        "The completed Solicitud de Empadronamiento form, available at the town hall or often online first",
      ]),
      h2("The order people get wrong"),
      p([
        {
          text: "The empadronamiento doesn't strictly require an NIE to register in most cases, but nearly everything you'll want to do afterwards, healthcare enrolment, certain bank processes, longer-term residency steps, does. The practical fix is to treat them as a pair to sort in the same stretch of time rather than assuming one unlocks the other automatically. And a detail that catches people out specifically: empadronamiento is proof of address, not proof of legal residency or the right to work, it's easy to assume registering with the town hall means your immigration status is sorted. It doesn't.",
        },
      ]),
      h2("Documents from abroad need to actually be usable here"),
      p([
        { text: "If any of your supporting paperwork, a marriage certificate, a foreign degree, a previous address history, was issued outside Spain, a town hall or immigration office will often want it translated by a " },
        { text: "certified sworn translator", href: "/eixample/sworn-translator" },
        { text: ", not just translated. A fluent friend's translation, however accurate, generally won't be accepted for anything official." },
      ]),
      h2("If you're arriving to work for yourself"),
      p([
        { text: "Freelancers and the newly self-employed have an extra layer on top of NIE and empadronamiento, registering as autónomo, which has its own tax and social security mechanics that genuinely benefit from someone who does this daily. An " },
        { text: "English-speaking autónomo accountant", href: "/eixample/autonomo-accountant" },
        { text: " will usually save you more in avoided mistakes than the consultation costs." },
      ]),
    ],
    sources: [
      { name: "idealista/news: Empadronamiento in Spain: what it is and how to get it", url: "https://www.idealista.com/en/news/legal-advice-spain/2026/01/21/7358-empadronamiento-spain-what-it-and-how-do-i-get-it" },
      { name: "Jobbatical: Empadronamiento Spain: Municipal Registration Guide", url: "https://www.jobbatical.com/blog/spain-empadronamiento-guide" },
      { name: "JURO Spain: Empadronamiento in Spain: Complete Registration Guide", url: "https://jurospain.com/guides/empadronamiento-spain-2026/" },
      { name: "Waypoint Sur: NIE Spain Requirements: Complete Document Checklist", url: "https://guides.waypointsur.com/nie-spain-requirements-documents/" },
    ],
  },
  {
    slug: "find-english-speaking-dentist-barcelona",
    title: "How to Actually Find an English-Speaking Dentist in Barcelona",
    description:
      "Why Barcelona has genuinely deep English-speaking dental coverage, why public healthcare won't help, and how to verify a clinic actually speaks English before you book.",
    excerpt:
      "Spain's public healthcare barely touches dental care, so almost everyone pays privately anyway, which is exactly why English-speaking options here are deeper than you'd expect.",
    publishedDate: "2026-09-22",
    readingMinutes: 5,
    relatedCategorySlugs: ["dentist", "orthodontist"],
    relatedAreaSlugs: ["eixample", "poblenou", "sarria-sant-gervasi", "les-corts", "gracia", "diagonal-mar"],
    content: [
      p([
        {
          text: "Barcelona's dental scene has a quirk that actually works in an English speaker's favour: the public healthcare system (Seguridad Social) covers almost none of it, extractions and some paediatric care aside. That means the overwhelming majority of residents, Spanish and foreign alike, already pay privately and shop around, which has pushed private clinics to compete hard on service, including language. Between that and Barcelona's growing reputation as a dental-tourism destination on price and quality, English-speaking dentistry here is deeper than in most European capitals.",
        },
      ]),
      h2("Why \"a bit of English\" isn't the same as fluent"),
      p([
        {
          text: "The gap that actually matters isn't whether a clinic can point at a tooth in English, it's whether they can explain a treatment plan, talk you through the pricing breakdown, and handle a genuinely urgent problem without you both reaching for a translation app mid-appointment. Reception staff who speak conversational English don't guarantee the dentist does, and vice versa. It's worth confirming before you book, not after.",
        },
      ]),
      h2("Where the confirmation actually needs to come from"),
      p([
        {
          text: "General search and directory sites will surface plenty of dental listings, but very few actually verify the English claim against something checkable. A clinic's own site being in English is a start, but the stronger signals are a named English-speaking dentist (not just \"our team speaks English\"), genuine patient reviews mentioning the language explicitly, or a clinic built specifically around an international clientele rather than one that happens to have a bilingual receptionist.",
        },
      ]),
      h2("Emergencies change the calculation"),
      p([
        {
          text: "A cracked tooth at 9pm on a Saturday isn't the moment to discover your usual dentist's English-speaking associate is off that weekend. If you're prone to dental issues or simply want the peace of mind, it's worth knowing your area's emergency options before you need one, rather than searching in pain.",
        },
      ]),
      h2("Find one you've actually verified, not just found"),
      p([
        { text: "This is exactly the gap we built the directory to close: every dentist we list has an explicit, checkable English signal behind it, cross-referenced against their real address, not just a Google Maps pin that happens to be near you. See who's verified in " },
        { text: "Eixample", href: "/eixample/dentist" },
        { text: ", " },
        { text: "Gràcia", href: "/gracia/dentist" },
        { text: ", " },
        { text: "Poblenou", href: "/poblenou/dentist" },
        { text: ", " },
        { text: "Sarrià-Sant Gervasi", href: "/sarria-sant-gervasi/dentist" },
        { text: ", " },
        { text: "Les Corts", href: "/les-corts/dentist" },
        { text: " or " },
        { text: "Diagonal Mar", href: "/diagonal-mar/dentist" },
        { text: "." },
      ]),
    ],
    sources: [
      { name: "Expatica: Dentistry in Spain: public and private dental care", url: "https://www.expatica.com/es/healthcare/healthcare-services/dental-care-in-spain-582615/" },
      { name: "ExpatDen: How to Find a Dentist in Barcelona: Clinics, Quality, Prices, and More", url: "https://www.expatden.com/spain/dental-clinic-barcelona/" },
      { name: "Barcelona Expat Life: English speaking dentists in Barcelona", url: "https://barcelonaexpatlife.com/english-speaking-dentists-in-barcelona/" },
    ],
  },
  {
    slug: "spanish-notary-explained",
    title: "What a Spanish Notary Actually Does (and Why You Want One Who Speaks English)",
    description:
      "A Spanish notario is nothing like a US or UK notary public. Here's what they actually do, when you'll need one, and why the language barrier matters more than people expect.",
    excerpt:
      "If you're picturing someone who just stamps a signature, recalibrate: a Spanish notario is closer to a judge than a notary public, and you'll meet one whether you're buying a flat or just getting married here.",
    publishedDate: "2026-09-22",
    readingMinutes: 5,
    relatedCategorySlugs: ["notary", "business-lawyer"],
    relatedAreaSlugs: ["eixample", "poblenou", "sarria-sant-gervasi", "les-corts", "gracia", "diagonal-mar"],
    content: [
      p([
        {
          text: "In the US or UK, a notary public mostly witnesses a signature and charges a small fee for the privilege. In Spain, that word means something else entirely, and the difference catches a lot of newcomers off guard.",
        },
      ]),
      h2("Not a witness, a public-trust legal officer"),
      p([
        {
          text: "A Spanish notario trains to roughly the same level as a judge and holds a public-trust role regulated directly by the Ministry of Justice. They're neutral by law, meaning they don't represent either side of a transaction, their job is making sure the document is legally sound and that everyone involved genuinely understands what they're signing, including reading the deed aloud at the signing itself.",
        },
      ]),
      h2("When you'll actually need one"),
      ul([
        "Buying property: the notario drafts and authorises the escritura pública (the public title deed), and checks the Land Registry beforehand for outstanding mortgages, charges or liens on the property",
        "Getting married in Spain, in certain circumstances",
        "Setting up a company or making major changes to one",
        "Wills, inheritance and power of attorney",
        "Any document that needs to be legally binding and publicly recorded, not just signed",
      ]),
      h2("Notary vs. lawyer: a distinction worth knowing"),
      p([
        { text: "A notario is impartial and doesn't advise either party on whether a deal is a good idea, that's what a " },
        { text: "business lawyer", href: "/eixample/business-lawyer" },
        { text: " is for. Think of the notary as confirming the paperwork is legally sound and everyone understood it, and your own advisor as the one actually looking out for your interests before you get to that appointment." },
      ]),
      h2("Why the English-speaking part matters more here than it sounds"),
      p([
        {
          text: "Because the notario's entire function centres on confirming you genuinely understood what you signed, a language barrier at that specific meeting isn't a minor inconvenience, it's close to the whole point of the appointment. Signing a property deed or a company formation document through a translation app, or worse, nodding along, is a real risk for something this consequential. It's worth confirming a notary's English fluency directly rather than assuming \"most people in this office speak some.\"",
        },
      ]),
      h2("Finding one"),
      p([
        { text: "We list English-speaking notaries by area, verified individually rather than assumed from a general listing: " },
        { text: "Eixample", href: "/eixample/notary" },
        { text: ", " },
        { text: "Gràcia", href: "/gracia/notary" },
        { text: ", " },
        { text: "Poblenou", href: "/poblenou/notary" },
        { text: ", " },
        { text: "Sarrià-Sant Gervasi", href: "/sarria-sant-gervasi/notary" },
        { text: ", " },
        { text: "Les Corts", href: "/les-corts/notary" },
        { text: " and " },
        { text: "Diagonal Mar", href: "/diagonal-mar/notary" },
        { text: "." },
      ]),
    ],
    sources: [
      { name: "idealista/news: What is a notary in Spain? A complete guide for buyers", url: "https://www.idealista.com/en/news/legal-advice-in-spain/2026/01/20/879274-what-is-a-notary-in-spain-a-complete-guide-for-buyers" },
      { name: "Notariado.org: Who is the notary (official body of Spanish notaries)", url: "https://www.notariado.org/portal/en/who-is-the-notary" },
      { name: "Ábaco Advisers: The Spanish Notary: What it is, role and fees", url: "https://blog.abacoadvisers.com/the-spanish-notary/" },
      { name: "Franke de la Fuente: The Role of the Public Notary in Spain", url: "https://frankedelafuente.com/blog/the-role-of-the-public-notary-in-spain/" },
    ],
  },
  {
    slug: "acupuncture-barcelona-what-to-know",
    title: "Acupuncture in Barcelona: What to Know Before You Book",
    description:
      "The one legal quirk about acupuncture in Spain almost nobody mentions, what a first session actually involves, and how to find an English-speaking practitioner in Barcelona.",
    excerpt:
      "Spain regulates who's allowed to call themselves an acupuncturist differently to the UK or Netherlands, which changes what's actually worth checking before you book.",
    publishedDate: "2026-09-23",
    readingMinutes: 5,
    relatedCategorySlugs: ["acupuncturist", "fertility-clinic"],
    relatedAreaSlugs: ["eixample", "poblenou", "sarria-sant-gervasi", "les-corts", "gracia", "diagonal-mar"],
    content: [
      p([
        {
          text: "Acupuncture is genuinely popular in Barcelona, but Spain treats it differently to a lot of the countries English speakers move here from, and that difference is worth understanding before you pick someone.",
        },
      ]),
      h2("The legal quirk: Spain restricts this more than the UK or Netherlands"),
      p([
        {
          text: "In several European countries, non-medically qualified practitioners can offer acupuncture relatively freely. Spain's position is stricter and, honestly, a bit murkier: acupuncture sits in a grey zone where it's most clearly permitted when performed by a licensed medical doctor, and Chinese medicine and acupuncture training itself isn't officially recognised as regulated education by Spain's Ministry of Education. In practice, this doesn't mean untrained people are running clinics, most established practitioners in Barcelona have serious training behind them, but it does mean the usual \"are they licensed\" question doesn't have the same clean answer it would for a dentist. Checking someone's specific training background and clinical experience directly matters more here than it would elsewhere.",
        },
      ]),
      h2("What actually happens at a first session"),
      p([
        {
          text: "Most Barcelona clinics structure a first visit the same basic way: a full traditional Chinese medicine diagnosis (pulse, tongue, a detailed history of what's actually going on), the treatment itself, and a personalised plan for what comes next, rather than just launching straight into needles. Depending on the diagnosis, that first session might combine acupuncture with cupping, moxibustion, or herbal medicine, not every visit looks identical.",
        },
      ]),
      h2("What people in Barcelona are actually booking it for"),
      p([
        {
          text: "The single most common profile in the city's central clinics is what practitioners themselves describe as stress, anxiety, and insomnia, unsurprising in a city with a large population of professionals working demanding, often remote-first jobs. Right behind that: computer-related pain, migraines, neck and shoulder tension from long screen hours, plus a smaller but steady stream of people using it as fertility support, either trying to conceive naturally or alongside IVF treatment.",
        },
      ]),
      h2("If fertility is why you're looking"),
      p([
        { text: "This is one of the more evidence-discussed uses of acupuncture in Barcelona specifically, often recommended alongside, not instead of, reproductive medicine. If that's your situation, it's worth coordinating with an " },
        { text: "English-speaking fertility clinic", href: "/eixample/fertility-clinic" },
        { text: " directly rather than treating the two as separate tracks." },
      ]),
      h2("Finding an English-speaking acupuncturist"),
      p([
        { text: "We verify English fluency the same way for this category as every other: a specific, checkable signal, not a guess. See who's verified in " },
        { text: "Eixample", href: "/eixample/acupuncturist" },
        { text: ", " },
        { text: "Gràcia", href: "/gracia/acupuncturist" },
        { text: ", " },
        { text: "Poblenou", href: "/poblenou/acupuncturist" },
        { text: ", " },
        { text: "Sarrià-Sant Gervasi", href: "/sarria-sant-gervasi/acupuncturist" },
        { text: ", " },
        { text: "Les Corts", href: "/les-corts/acupuncturist" },
        { text: " or " },
        { text: "Diagonal Mar", href: "/diagonal-mar/acupuncturist" },
        { text: "." },
      ]),
    ],
    sources: [
      { name: "Expat Focus: Spain: Complementary and Alternative Medicine", url: "https://www.expatfocus.com/spain/guide/spain-complementary-and-alternative-medicine" },
      { name: "Longhua Chinese Medicine: The regulation of Chinese medicine in Spain", url: "https://lcm.amegroups.org/article/view/6827/html" },
      { name: "ETCMA: European Traditional Chinese Medicine Association, Find a Member", url: "https://etcma.org/find-a-member/" },
      { name: "Escuela Superior de Medicina Tradicional China (Barcelona TCM school)", url: "https://www.esmtc.es/biblioteca/?cat=88&sort=date" },
    ],
  },
  {
    slug: "dermatologist-barcelona-guide",
    title: "Skin Checks and Dermatologists in Barcelona: What's Actually Covered, and What Isn't",
    description:
      "Spain has no nationwide skin cancer screening programme, so self-checks and choosing the right dermatologist matter more than expats usually expect, especially in a city this sunny.",
    excerpt:
      "Skin cancer diagnoses in Spain are up 40% in four years, there's no nationwide screening programme, and the public system needs a GP referral first. Here's what that actually means for you.",
    publishedDate: "2026-09-23",
    readingMinutes: 5,
    relatedCategorySlugs: ["dermatologist", "plastic-surgeon"],
    relatedAreaSlugs: ["eixample", "poblenou", "sarria-sant-gervasi", "les-corts", "gracia", "diagonal-mar"],
    content: [
      p([
        {
          text: "Barcelona's sun is part of the appeal of living here, and part of the reason dermatology is worth taking seriously rather than putting off. The numbers are blunter than most people expect: skin cancer diagnoses in Spain are up around 40% over the last four years, with roughly 8,000–9,000 new melanomas and over 78,000 non-melanoma skin cancers diagnosed annually.",
        },
      ]),
      h2("There's no nationwide screening programme, so self-checks are on you"),
      p([
        {
          text: "Unlike some countries with routine population-wide skin screening, Spain doesn't run one nationally. Dermatology associations do run a free-checks campaign each June (Euromelanoma), which is worth knowing about, but outside that window, catching something early is genuinely down to you noticing a change and booking someone, not a system flagging it for you.",
        },
      ]),
      h2("Public healthcare works, but there's a queue built into it"),
      p([
        {
          text: "On the public system (Seguridad Social), you generally can't book a dermatologist directly, you see your GP first, and they refer you if something looks concerning. That referral step adds real time. Private clinics, by contrast, offer direct booking and noticeably faster scheduling for follow-up scans, which is the main reason so many residents, not just expats, carry private cover or pay out of pocket for dermatology specifically, the same pattern you'll see with dentistry here.",
        },
      ]),
      h2("Medical dermatology and aesthetic dermatology aren't the same visit"),
      p([
        {
          text: "Worth being clear-eyed about: a mole check and a Botox consultation are different specialities that happen to share a job title. Some Barcelona clinics genuinely do both well, and a few take an integrative approach, combining dermatology with a broader look at stress, immune function and skin health rather than treating skin issues in isolation. Others are essentially aesthetic-first with medical dermatology as a secondary offering. If a skin check or a biopsy is why you're going, it's worth confirming that's a core part of what the clinic actually does, not just something they can technically arrange.",
        },
      ]),
      h2("If it's aesthetic work you're after"),
      p([
        { text: "For anything more involved than Botox or fillers, reconstructive or surgical procedures, that generally moves into " },
        { text: "plastic and cosmetic surgery", href: "/eixample/plastic-surgeon" },
        { text: " territory rather than dermatology proper, worth knowing which category actually fits what you want before you start calling around." },
      ]),
      h2("Finding an English-speaking dermatologist"),
      p([
        { text: "Verified by area, not just pulled from a generic map search: " },
        { text: "Eixample", href: "/eixample/dermatologist" },
        { text: ", " },
        { text: "Gràcia", href: "/gracia/dermatologist" },
        { text: ", " },
        { text: "Poblenou", href: "/poblenou/dermatologist" },
        { text: ", " },
        { text: "Sarrià-Sant Gervasi", href: "/sarria-sant-gervasi/dermatologist" },
        { text: ", " },
        { text: "Les Corts", href: "/les-corts/dermatologist" },
        { text: " and " },
        { text: "Diagonal Mar", href: "/diagonal-mar/dermatologist" },
        { text: "." },
      ]),
    ],
    sources: [
      { name: "The Local Spain: What you need to know about skin cancer treatment in Spain", url: "https://www.thelocal.es/20260730/what-you-need-to-know-about-skin-cancer-treatment-in-spain" },
      { name: "IRBLleida: Dermatologists take part in the Euromelanoma 2026 campaign", url: "https://www.irblleida.org/en/news/2105/dermatologists-from-lleida-are-taking-part-in-the-euromelanoma-2026-campaign-by-offering-free-skin-checks" },
      { name: "ScanSkinAI: Skin Cancer in Spain: 8,000+ Melanomas a Year", url: "https://www.scanskinai.com/blog/skin-cancer-in-spain" },
      { name: "Tailor Made Healthcare Spain: Shortage of Spanish Dermatologists", url: "https://www.tailormadehealthcarespain.org/post/shortage-of-spanish-dermatologists" },
    ],
  },
  {
    slug: "chiropractor-barcelona-guide",
    title: "Chiropractic Care in Barcelona: Why Verifying Your Chiropractor Matters More Here",
    description:
      "Chiropractic still isn't formally regulated as a profession in Spain, which makes checking qualifications part of the job when you're choosing one, not an optional extra.",
    excerpt:
      "There's no national licence or protected title for chiropractors in Spain, and no public insurance covers it. Here's what that actually means when you're picking one.",
    publishedDate: "2026-09-23",
    readingMinutes: 5,
    relatedCategorySlugs: ["chiropractor", "physiotherapist"],
    relatedAreaSlugs: ["eixample", "poblenou", "sarria-sant-gervasi", "les-corts", "gracia", "diagonal-mar"],
    content: [
      p([
        {
          text: "If you're used to chiropractic being a formally licensed, regulated profession, Spain will catch you off guard. It still isn't one here, and that changes what you should actually check before booking, not just who you pick.",
        },
      ]),
      h2("No national licence, no protected title, not yet"),
      p([
        {
          text: "As things stand, Spain doesn't formally recognise chiropractic as a regulated healthcare profession. There's no national licence and no protected title, which means a \"Doctor of Chiropractic\" qualification earned abroad, even after five or six years of accredited university training, isn't automatically recognised as an official qualification here. It also means there's no public insurance coverage for chiropractic care, so you're either paying privately or through private insurance regardless.",
        },
      ]),
      h2("What that means practically: verification is your job"),
      p([
        {
          text: "The lack of formal regulation doesn't mean Barcelona's chiropractors are unqualified, most have genuine, accredited international training behind them, but it does mean the burden of checking shifts to the patient rather than a licensing body doing it for you. The most useful concrete check is membership of the Spanish Chiropractic Association (AEQ), which requires graduation from a recognised chiropractic programme and, for US-trained practitioners, passing the National Board exams. If a clinic doesn't mention AEQ membership anywhere, it's a fair, ordinary question to ask directly.",
        },
      ]),
      h2("What a first visit typically involves"),
      p([
        {
          text: "Most established Barcelona clinics follow a fairly consistent structure: a detailed history and discussion of your symptoms, a physical and often computerised assessment of how your spine and posture are actually functioning, a review of any X-rays or MRIs you already have, and a full exam. The findings and a specific care plan, including how often you'd need adjustments, typically come at a second visit rather than the first, with a re-assessment roughly a month in to measure whether it's actually working, not just continuing on assumption.",
        },
      ]),
      h2("What people usually come in for"),
      p([
        { text: "Back and neck pain lead by a wide margin, alongside sports injuries and general posture complaints from desk-based work, much like the pattern in " },
        { text: "physiotherapy", href: "/eixample/physiotherapist" },
        { text: ", the two fields overlap more than people expect, and some patients end up using both depending on what's actually going on." },
      ]),
      h2("Finding an English-speaking chiropractor"),
      p([
        { text: "Each listing is checked individually, not assumed from a general directory: " },
        { text: "Eixample", href: "/eixample/chiropractor" },
        { text: ", " },
        { text: "Gràcia", href: "/gracia/chiropractor" },
        { text: ", " },
        { text: "Poblenou", href: "/poblenou/chiropractor" },
        { text: ", " },
        { text: "Sarrià-Sant Gervasi", href: "/sarria-sant-gervasi/chiropractor" },
        { text: ", " },
        { text: "Les Corts", href: "/les-corts/chiropractor" },
        { text: " and " },
        { text: "Diagonal Mar", href: "/diagonal-mar/chiropractor" },
        { text: "." },
      ]),
    ],
    sources: [
      { name: "Chiro Recruit: Working in Spain as an Overseas Chiropractor", url: "https://chirorecruit.com/blog/working-in-spain-as-an-overseas-chiropractor/" },
      { name: "CCED Seminars: Spain Chiropractic Continuing Education Requirements", url: "https://ccedseminars.com/international-guidelines/Spain" },
      { name: "Barcelona College of Chiropractic: Frequently Asked Questions", url: "https://bcchiropractic.es/en/faq/" },
    ],
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
