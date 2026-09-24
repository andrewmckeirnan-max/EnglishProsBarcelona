import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Languages, MapPinned, ShieldCheck } from "lucide-react";
import { areas, visibleCategories, getCategory } from "@/lib/data";
import { areaCounts, getCityProfessionals } from "@/lib/city";
import { getGuidesForCategory } from "@/lib/blog";
import { categoryTerms, humanList } from "@/lib/seoTerms";
import { ProfessionalsListSection } from "@/components/ProfessionalsListSection";
import { LeadForm } from "@/components/LeadForm";
import { UnlockProvider } from "@/components/UnlockContext";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedGuides } from "@/components/RelatedGuides";
import { sentenceLower } from "@/lib/text";
import { breadcrumbSchema, professionalListSchema, faqSchema, buildCityFaqs } from "@/lib/schema";
import { clipDescription, fitTitle, ogFor, titleMeta } from "@/lib/site";
import { AtAGlance } from "@/components/AtAGlance";
import { FREE_PREVIEW_LIMIT } from "@/lib/constants";

export function generateStaticParams() {
  return visibleCategories.map((c) => ({ category: c.slug }));
}

function titleFor(name: string) {
  return fitTitle(`English-Speaking ${name} in Barcelona`, `English ${name} in Barcelona`);
}

export async function generateMetadata(props: PageProps<"/barcelona/[category]">): Promise<Metadata> {
  const { category: slug } = await props.params;
  const category = getCategory(slug);
  if (!category || category.hidden) return {};
  const terms = categoryTerms[category.slug];
  const count = getCityProfessionals(category.slug).length;
  const title = titleFor(category.name);
  const description = clipDescription(
    `${count > 0 ? `${count} verified English-speaking ${sentenceLower(count === 1 ? category.name : category.pluralName)} in Barcelona` : `English-speaking ${sentenceLower(category.pluralName)} in Barcelona`}, by neighbourhood. Also searched as ${humanList(terms.synonyms.slice(0, 2))}. Free to use.`,
  );
  return {
    title: titleMeta(title),
    description,
    openGraph: ogFor(title, description, `/barcelona/${category.slug}`),
    ...(count === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function BarcelonaCategoryPage(props: PageProps<"/barcelona/[category]">) {
  const { category: slug } = await props.params;
  const category = getCategory(slug);
  if (!category || category.hidden) notFound();

  const professionals = getCityProfessionals(category.slug);
  const counts = areaCounts(category.slug);
  const terms = categoryTerms[category.slug];
  const lower = sentenceLower(category.name);
  const lowerPlural = sentenceLower(category.pluralName);
  const guides = getGuidesForCategory(category.slug);
  const otherCategories = visibleCategories.filter((c) => c.slug !== category.slug);
  const reasons = category.needOptions.filter((n) => !/^other$/i.test(n)).map((n) => n.toLowerCase());
  const faqs = buildCityFaqs(category, professionals.length, areas.map((a) => a.name));

  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: category.pluralName, url: `/barcelona/${category.slug}` },
    ]),
    ...(professionals.length > 0 ? [professionalListSchema(null, category, professionals, FREE_PREVIEW_LIMIT)] : []),
    faqSchema(faqs),
  ];

  return (
    <div>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <UnlockProvider>
        <section className="bg-gradient-to-b from-brand-light to-background border-b border-border">
          <div className="container-page pt-5">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: category.pluralName }]} />
          </div>
          <div className="container-page py-8 sm:py-16">
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-start">
              <div>
                <p className="text-sm font-semibold text-brand mb-2">Barcelona &middot; all neighbourhoods</p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                  English-speaking {lower} in Barcelona
                </h1>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    ["WHAT", lower],
                    ["WHERE", "Barcelona"],
                    ["MATCHES", String(professionals.length)],
                  ].map(([label, value]) => (
                    <span key={label} className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-3.5 py-1.5 text-sm">
                      <span className="text-[11px] font-bold tracking-wider text-foreground/50">{label}</span>
                      <span className="font-semibold">{value}</span>
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-foreground/70 max-w-xl">{category.shortPitch}</p>
                <p className="mt-3 text-sm text-foreground/60 max-w-xl">
                  {professionals.length > 0
                    ? `We've verified ${professionals.length} English-speaking ${professionals.length === 1 ? lower : lowerPlural} across Barcelona, each with a checkable sign that they work in English. Choose your neighbourhood below or tell us what you need.`
                    : `We're still verifying English-speaking ${lowerPlural} in Barcelona. Tell us what you need and we'll personally find one nearby.`}
                </p>
                <p className="mt-3 text-sm text-foreground/60 max-w-xl">
                  You may also be looking for a {humanList(terms.synonyms)}
                  {terms.es ? ` (in Spanish: ${terms.es})` : ""}.
                  {reasons.length > 0 ? ` People contact an English-speaking ${lower} in Barcelona for ${humanList(reasons)}.` : ""}
                </p>

                <div className="mt-8 grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="rounded-xl bg-white/60 border border-border p-4">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Languages className="h-4 w-4 text-brand" strokeWidth={2} />
                      English-first
                    </p>
                    <p className="text-foreground/60 mt-1">No language barrier, ever.</p>
                  </div>
                  <div className="rounded-xl bg-white/60 border border-border p-4">
                    <p className="font-semibold flex items-center gap-1.5">
                      <MapPinned className="h-4 w-4 text-brand" strokeWidth={2} />
                      Six neighbourhoods
                    </p>
                    <p className="text-foreground/60 mt-1">Matched near where you live or work.</p>
                  </div>
                  <div className="rounded-xl bg-white/60 border border-border p-4">
                    <p className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-brand" strokeWidth={2} />
                      Verified
                    </p>
                    <p className="text-foreground/60 mt-1">A checkable English signal for each.</p>
                  </div>
                </div>
              </div>

              <div id="get-matched" className="lg:sticky lg:top-24 scroll-mt-24">
                <LeadForm defaultCategorySlug={category.slug} />
              </div>
            </div>
          </div>
        </section>

        <section className="container-page py-14 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            {category.pluralName} by neighbourhood
          </h2>
          <p className="text-foreground/60 mb-8 max-w-xl">Pick the part of Barcelona you want to be seen in.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {counts.map(({ area, count }) => (
              <Link
                key={area.slug}
                href={`/${area.slug}/${category.slug}`}
                className="rounded-2xl border border-border bg-surface p-5 hover:border-brand/30 hover:shadow-soft transition-all"
              >
                <p className="font-semibold">English {lower} in {area.name}</p>
                <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{area.blurb}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand mt-3">
                  {count > 0 ? `${count} verified` : "Tell us what you need"} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {professionals.length > 0 && (
          <section id="professionals-list" className="container-page pb-14 sm:pb-20 scroll-mt-20">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
              {category.pluralName} in Barcelona
            </h2>
            <div className="mt-4">
              <AtAGlance professionals={professionals} categoryName={category.name} categoryPluralName={category.pluralName} />
            </div>
            <ProfessionalsListSection professionals={professionals} />
          </section>
        )}
      </UnlockProvider>

      <RelatedGuides posts={guides} heading={`Guides on ${lowerPlural} and related topics`} />

      <section className="container-page py-14 sm:py-20 max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Questions</h2>
        <div className="flex flex-col divide-y divide-border">
          {faqs.map((f) => (
            <div key={f.question} className="py-4">
              <h3 className="font-semibold">{f.question}</h3>
              <p className="text-sm text-foreground/60 mt-1">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted border-y border-border">
        <div className="container-page py-14 sm:py-20">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Other English-speaking professionals in Barcelona</h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/barcelona/${c.slug}`}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-brand hover:bg-brand-light hover:shadow-soft transition-all"
              >
                {c.icon} English {c.name} in Barcelona
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
