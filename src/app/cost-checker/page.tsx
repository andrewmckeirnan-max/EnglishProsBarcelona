import type { Metadata } from "next";
import Link from "next/link";
import { CostChecker } from "@/components/CostChecker";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { categories } from "@/lib/data";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { SITE_URL, ogFor } from "@/lib/site";
import { costItems, costSources, distinctSourceCount, formatRange, COST_DATA_CHECKED } from "@/lib/costData";

const TITLE = "Barcelona Prices 2026: Free Cost Checker for Services";
const DESCRIPTION =
  "What dentists, doctors, therapists, physios, gestors, translators and more typically cost in Barcelona in 2026. Check any quote against published ranges.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/cost-checker" },
  openGraph: ogFor(TITLE, DESCRIPTION, "/cost-checker"),
};

const name = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
const find = (id: string) => costItems.find((c) => c.id === id)!;

const faqs = [
  {
    question: "How much does a dentist cost in Barcelona in 2026?",
    answer: `Published ranges put a check-up at ${formatRange(find("dental-checkup"))}, a filling at ${formatRange(find("dental-filling"))}, a crown at ${formatRange(find("dental-crown"))} and a single implant at ${formatRange(find("dental-implant"))}. Always ask for a written, itemised quote.`,
  },
  {
    question: "How much does therapy cost in Barcelona?",
    answer: `A private session with a psychologist typically costs ${formatRange(find("therapy-session"))} for 45 to 60 minutes in 2026, with English-speaking specialists often at the higher end.`,
  },
  {
    question: "How much is a private doctor in Barcelona?",
    answer: `A private GP appointment typically costs ${formatRange(find("gp-private"))}. Online consultations start at around €25 to €40.`,
  },
  {
    question: "How much does a physiotherapist cost in Barcelona?",
    answer: `Sessions are reported at ${formatRange(find("physio-session"))}, and most clinics that publish prices charge about €60 to €80 for 50 to 60 minutes.`,
  },
  {
    question: "How much does a gestor cost for a self-employed person in Spain?",
    answer: `Expect roughly ${formatRange(find("gestor-monthly"))} a month before VAT, with online services at the lower end and face-to-face offices at the higher end. Tax returns and registration are often extra.`,
  },
  {
    question: "How much does a sworn translation cost in Spain?",
    answer: `Roughly ${formatRange(find("sworn-translation"))} per page before VAT depending on the language, with one or two page documents usually €40 to €60 before VAT.`,
  },
  {
    question: "Are these exact prices?",
    answer: "No. They are ranges compiled from published price guides and clinic price lists, not quotes from any particular business. Prices change, so confirm the current figure with the professional.",
  },
];

export default function CostCheckerPage() {
  const grouped = new Map<string, typeof costItems>();
  for (const c of costItems) grouped.set(c.categorySlug, [...(grouped.get(c.categorySlug) ?? []), c]);
  const usedSources = [...new Set(costItems.flatMap((c) => c.sources))];
  const checked = new Date(COST_DATA_CHECKED).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const schemas = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Cost checker", url: "/cost-checker" },
    ]),
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Barcelona Cost Checker",
      url: `${SITE_URL}/cost-checker`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      description: DESCRIPTION,
    },
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <div className="container-page py-10 sm:py-14">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Cost checker" }]} />
        <p className="text-sm font-semibold text-brand mt-6 mb-2">Free tool</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance max-w-3xl">
          What does it cost in Barcelona? Check any price in seconds
        </h1>
        <p className="mt-4 text-foreground/70 max-w-2xl leading-relaxed">
          In 2026 a dental filling in Barcelona typically costs €50 to €150, a therapy session €50 to €100 and a private GP visit €60 to €120.
          Pick a service below to see the typical range, what moves the price and what to ask, then check a quote you have been given.
        </p>

        <div className="mt-8 grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <CostChecker />
          <aside className="rounded-2xl border border-border bg-surface-muted p-5 text-sm text-foreground/70 leading-relaxed">
            <p className="font-semibold text-foreground">How to read this</p>
            <ul className="mt-2 list-disc pl-5 space-y-2">
              <li>Ranges come from {distinctSourceCount()} published price guides and clinic price lists, checked {checked}.</li>
              <li>They are market ranges, not the fees of any professional listed on this site, and not quotes. Prices vary by clinic, neighbourhood and case.</li>
              <li>Where fewer sources exist we say so on the item.</li>
              <li>Central and English-speaking clinics often sit toward the top of a range.</li>
            </ul>
          </aside>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">All Barcelona price ranges, 2026</h2>
          <p className="text-foreground/70 mt-2 max-w-2xl">
            The full list, in one place. Each range links to the professionals who serve you in English.
          </p>
          <div className="mt-6 space-y-8">
            {[...grouped.entries()].map(([slug, items]) => (
              <div key={slug}>
                <h3 className="font-semibold text-lg">
                  <Link href={`/barcelona/${slug}`} className="hover:text-brand">
                    {name(slug)} prices
                  </Link>
                </h3>
                <div className="mt-3 overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <caption className="sr-only">{name(slug)} price ranges in Barcelona, 2026</caption>
                    <thead className="bg-surface-muted text-left">
                      <tr>
                        <th scope="col" className="px-4 py-2.5 font-semibold">Service</th>
                        <th scope="col" className="px-4 py-2.5 font-semibold">Typical range</th>
                        <th scope="col" className="px-4 py-2.5 font-semibold">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((c) => (
                        <tr key={c.id} className="border-t border-border">
                          <th scope="row" className="px-4 py-2.5 font-medium text-left">{c.service}</th>
                          <td className="px-4 py-2.5 whitespace-nowrap">{formatRange(c)}</td>
                          <td className="px-4 py-2.5 text-foreground/60">{c.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-border rounded-xl border border-border">
            {faqs.map((f) => (
              <details key={f.question} className="group p-4">
                <summary className="cursor-pointer font-semibold list-none flex justify-between gap-4">
                  {f.question}
                  <span aria-hidden="true" className="text-foreground/40 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">How we compiled these ranges</h2>
          <p className="mt-3 text-foreground/70 leading-relaxed">
            We read published price guides, clinic price lists and comparison sites, cross-checked each figure against at least two of them wherever
            they exist, and show the range that the sources agree on, rounded to whole euros. Where an official figure exists we use it and say so: the Catalan health service (ICS) public price order, the Spanish notary fee schedule in the BOE, the DGT licence-exchange fees and the Barcelona council animal census. Everything else comes from published clinic and guide prices. We do not use paid placements, and no listed business
            influences the numbers. Treat every figure as a starting point for a conversation, never as an offer, and confirm the current price and what
            is included before you book. Nothing here is medical, legal, tax or financial advice. Spot a price that looks out of date? Email{" "}
            <a href="mailto:hello@barcelonaenglishpros.com" className="text-brand underline">hello@barcelonaenglishpros.com</a>.
          </p>
          <h3 className="mt-6 font-semibold">Sources ({usedSources.length})</h3>
          <ul className="mt-2 text-sm text-foreground/70 space-y-1">
            {usedSources.map((s) => (
              <li key={s}>
                <a href={costSources[s].url} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-brand underline">
                  {costSources[s].name}
                </a>{" "}
                <span className="text-foreground/40">({costSources[s].year})</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
