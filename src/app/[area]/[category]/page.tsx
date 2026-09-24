import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Languages, MapPinned, MessageCircle } from "lucide-react";
import { areas, visibleCategories, getArea, getCategory } from "@/lib/data";
import { getProfessionals } from "@/lib/professionals";
import { ProfessionalsListSection } from "@/components/ProfessionalsListSection";
import { LeadForm } from "@/components/LeadForm";
import { UnlockProvider } from "@/components/UnlockContext";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { sentenceLower } from "@/lib/text";
import { WHATSAPP_CONFIGURED } from "@/lib/whatsapp";
import { breadcrumbSchema, professionalListSchema, faqSchema, buildCategoryFaqs } from "@/lib/schema";
import { clipDescription, fitTitle, ogFor, titleMeta } from "@/lib/site";
import { getProfessionals as getPros } from "@/lib/professionals";
import { getGuidesForCategory } from "@/lib/blog";
import { categoryTerms, areaAliases, humanList } from "@/lib/seoTerms";
import { RelatedGuides } from "@/components/RelatedGuides";
import { AtAGlance } from "@/components/AtAGlance";

export function generateStaticParams() {
  return areas.flatMap((a) => visibleCategories.map((c) => ({ area: a.slug, category: c.slug })));
}

export async function generateMetadata(props: PageProps<"/[area]/[category]">): Promise<Metadata> {
  const { area: areaSlug, category: categorySlug } = await props.params;
  const area = getArea(areaSlug);
  const category = getCategory(categorySlug);
  if (!area || !category || category.hidden) return {};
  const title = fitTitle(
    `English-Speaking ${category.name} in ${area.name}, Barcelona`,
    `English ${category.name} in ${area.name}, Barcelona`,
    `${category.name} in ${area.name}, Barcelona (English)`,
  );
  const count = getPros(area.slug, category.slug).length;
  const hasListings = count > 0;
  const lead = hasListings
    ? `${count} verified English-speaking ${(count === 1 ? category.name : category.pluralName).toLowerCase()} in ${area.name} (${area.district}), Barcelona.`
    : `English-speaking ${category.pluralName.toLowerCase()} in ${area.name} (${area.district}), Barcelona.`;
  const description = clipDescription(`${lead} ${category.shortPitch}`);
  return {
    title: titleMeta(title),
    description,
    openGraph: ogFor(title, description, `/${area.slug}/${category.slug}`),
    // A page with no verified listing yet is thin: keep it out of the index until one exists.
    robots: hasListings ? undefined : { index: false, follow: true },
  };
}

export default async function CategoryPage(props: PageProps<"/[area]/[category]">) {
  const { area: areaSlug, category: categorySlug } = await props.params;
  const area = getArea(areaSlug);
  const category = getCategory(categorySlug);
  if (!area || !category || category.hidden) notFound();

  const professionals = getProfessionals(area.slug, category.slug);
  const otherAreas = areas.filter((a) => a.slug !== area.slug);
  // Every other profession, not just a handful — each one is a distinct
  // "English-speaking X in {area}" search/AEO target worth linking.
  const otherCategories = visibleCategories.filter((c) => c.slug !== category.slug);

  const guides = getGuidesForCategory(category.slug);
  const terms = categoryTerms[category.slug];
  const aliases = areaAliases[area.slug];
  const reasons = category.needOptions.filter((n) => !/^other$/i.test(n)).map((n) => n.toLowerCase());
  const faqs = buildCategoryFaqs(area, category, professionals.length > 0);
  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: area.name, url: `/${area.slug}` },
      { name: category.pluralName, url: `/${area.slug}/${category.slug}` },
    ]),
    ...(professionals.length > 0 ? [professionalListSchema(area, category, professionals)] : []),
    faqSchema(faqs),
  ];

  return (
    <div>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <UnlockProvider>
        <section className="bg-gradient-to-b from-brand-light to-background border-b border-border">
          <div className="container-page pt-5">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: area.name, href: `/${area.slug}` },
                { name: category.pluralName },
              ]}
            />
          </div>
          <div className="container-page py-8 sm:py-16">
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-start">
              <div>
                <p className="text-sm font-semibold text-brand mb-2">
                  {area.name} &middot; {area.district}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                  English-speaking {sentenceLower(category.name)} in {area.name}, Barcelona
                </h1>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    ["WHAT", sentenceLower(category.name)],
                    ["WHERE", area.name],
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
                    ? `We've verified ${professionals.length} English-speaking ${professionals.length === 1 ? sentenceLower(category.name) : sentenceLower(category.pluralName)} in ${area.name}, listed below with what they specialize in and what languages they speak.`
                    : `We don't have a verified English-speaking ${sentenceLower(category.name)} listed in ${area.name} yet. Tell us what you need and we'll personally find one nearby.`}
                </p>

                <p className="mt-3 text-sm text-foreground/60 max-w-xl">
                  Also searched as {humanList(terms.synonyms)} (in Spanish: {terms.es}). {area.name} is also known as {humanList(aliases)}.
                  {reasons.length > 0 ? ` People contact an English-speaking ${sentenceLower(category.name)} in ${area.name} for ${humanList(reasons)}.` : ""}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {category.seoKeywords.map((k) => (
                    <li key={k} className="text-xs rounded-full bg-white/70 border border-border px-3 py-1 text-foreground/60 capitalize">
                      {k}
                    </li>
                  ))}
                </ul>

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
                      Local to {area.name}
                    </p>
                    <p className="text-foreground/60 mt-1">Matched near where you live or work.</p>
                  </div>
                  <div className="rounded-xl bg-white/60 border border-border p-4">
                    <p className="font-semibold flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4 text-brand" strokeWidth={2} />
                      {WHATSAPP_CONFIGURED ? "WhatsApp friendly" : "Real human help"}
                    </p>
                    <p className="text-foreground/60 mt-1">{WHATSAPP_CONFIGURED ? "Fast replies, no phone-call anxiety." : "Stuck? Reply to your email and we'll help you choose."}</p>
                  </div>
                </div>
              </div>

              <div id="get-matched" className="lg:sticky lg:top-24 scroll-mt-24">
                <LeadForm defaultAreaSlug={area.slug} defaultCategorySlug={category.slug} />
              </div>
            </div>
          </div>
        </section>

        <section id="professionals-list" className="container-page py-14 sm:py-20 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            {category.pluralName} in {area.name}
          </h2>

          {professionals.length > 0 ? (
            <>
              <div className="mt-4">
                <AtAGlance professionals={professionals} categoryName={category.name} categoryPluralName={category.pluralName} area={area} />
              </div>
              <ProfessionalsListSection professionals={professionals} area={area} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-surface-muted">
              <p className="font-semibold">We don&apos;t have a featured partner in {area.name} yet.</p>
              <p className="text-sm text-foreground/60 mt-1 max-w-md mx-auto">
                Tell us what you need using the form above and we&apos;ll hand-match you with a
                vetted English-speaking {sentenceLower(category.name)} nearby.
              </p>
            </div>
          )}
        </section>
      </UnlockProvider>

      <RelatedGuides posts={guides} heading={`Guides on ${sentenceLower(category.pluralName)} and related topics`} />

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
          <h2 className="text-2xl font-bold tracking-tight mb-6">Other English-speaking professionals in {area.name}</h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/${area.slug}/${c.slug}`}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-brand hover:bg-brand-light hover:shadow-soft transition-all"
              >
                {c.icon} English {c.name} in {area.name}
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-bold tracking-tight mt-10 mb-6">{category.name} in other areas</h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/barcelona/${category.slug}`}
              className="rounded-full border border-brand/40 bg-brand-light px-4 py-2 text-sm font-semibold text-brand hover:bg-white transition-all"
            >
              English {category.name} across all of Barcelona
            </Link>
            {otherAreas.map((a) => (
              <Link
                key={a.slug}
                href={`/${a.slug}/${category.slug}`}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-brand hover:bg-brand-light hover:shadow-soft transition-all"
              >
                English {category.name} in {a.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
