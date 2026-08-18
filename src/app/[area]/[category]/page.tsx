import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { areas, visibleCategories, getArea, getCategory } from "@/lib/data";
import { getProfessionals } from "@/lib/professionals";
import { ProfessionalCard, LockedProfessionalCard } from "@/components/ProfessionalCard";
import { ProfessionalsMap } from "@/components/ProfessionalsMap";
import { LeadForm } from "@/components/LeadForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { sentenceLower } from "@/lib/text";
import { breadcrumbSchema, professionalListSchema, faqSchema, buildCategoryFaqs } from "@/lib/schema";
import { FREE_PREVIEW_LIMIT } from "@/lib/constants";

export function generateStaticParams() {
  return areas.flatMap((a) => visibleCategories.map((c) => ({ area: a.slug, category: c.slug })));
}

export async function generateMetadata(props: PageProps<"/[area]/[category]">): Promise<Metadata> {
  const { area: areaSlug, category: categorySlug } = await props.params;
  const area = getArea(areaSlug);
  const category = getCategory(categorySlug);
  if (!area || !category || category.hidden) return {};
  return {
    title: `English-Speaking ${category.name} in ${area.name}, Barcelona`,
    description: `${category.shortPitch} Serving ${area.name} (${area.district}), Barcelona.`,
  };
}

export default async function CategoryPage(props: PageProps<"/[area]/[category]">) {
  const { area: areaSlug, category: categorySlug } = await props.params;
  const area = getArea(areaSlug);
  const category = getCategory(categorySlug);
  if (!area || !category || category.hidden) notFound();

  const professionals = getProfessionals(area.slug, category.slug);
  // Show the first 3 openly; anything beyond that is a locked teaser until
  // the visitor submits contact info via the lead form (which then shows
  // the full, unfiltered list in its own success state).
  const visibleProfessionals = professionals.slice(0, FREE_PREVIEW_LIMIT);
  const lockedCount = Math.max(professionals.length - FREE_PREVIEW_LIMIT, 0);
  const otherAreas = areas.filter((a) => a.slug !== area.slug);
  // Every other profession, not just a handful — each one is a distinct
  // "English-speaking X in {area}" search/AEO target worth linking.
  const otherCategories = visibleCategories.filter((c) => c.slug !== category.slug);

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
              <p className="mt-4 text-foreground/70 max-w-xl">{category.shortPitch}</p>
              <p className="mt-3 text-sm text-foreground/60 max-w-xl">
                {professionals.length > 0
                  ? `We've verified ${professionals.length} English-speaking ${professionals.length === 1 ? sentenceLower(category.name) : sentenceLower(category.pluralName)} in ${area.name}, listed below with what they specialize in and what languages they speak.`
                  : `We don't have a verified English-speaking ${sentenceLower(category.name)} listed in ${area.name} yet. Tell us what you need and we'll personally find one nearby.`}
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
                  <p className="font-semibold">🗣️ English-first</p>
                  <p className="text-foreground/60 mt-1">No language barrier, ever.</p>
                </div>
                <div className="rounded-xl bg-white/60 border border-border p-4">
                  <p className="font-semibold">📍 Local to {area.name}</p>
                  <p className="text-foreground/60 mt-1">Matched near where you live or work.</p>
                </div>
                <div className="rounded-xl bg-white/60 border border-border p-4">
                  <p className="font-semibold">💬 WhatsApp friendly</p>
                  <p className="text-foreground/60 mt-1">Fast replies, no phone-call anxiety.</p>
                </div>
              </div>
            </div>

            <div id="get-matched" className="lg:sticky lg:top-24 scroll-mt-24">
              <LeadForm defaultAreaSlug={area.slug} defaultCategorySlug={category.slug} />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl font-semibold mb-1">
          {category.pluralName} in {area.name}
        </h2>

        {professionals.length > 0 ? (
          <>
            <p className="text-sm text-foreground/60 mb-6">
              {lockedCount > 0
                ? `Showing ${visibleProfessionals.length} of ${professionals.length}. Tell us what you need to unlock the full ranked list.`
                : professionals.some((p) => p.isPartner)
                  ? "Our featured partner, plus other English-speaking options we found nearby."
                  : "English-speaking options we found nearby. None of these are paying partners yet, this is an independent, informational list."}
            </p>
            <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-start">
              <div className="flex flex-col gap-4">
                {visibleProfessionals.map((p) => (
                  <ProfessionalCard key={p.id} professional={p} />
                ))}
                {Array.from({ length: lockedCount }).map((_, i) => (
                  <LockedProfessionalCard key={`locked-${i}`} />
                ))}
              </div>
              <div className="hidden lg:block h-[520px] sticky top-24">
                <ProfessionalsMap professionals={professionals} area={area} />
              </div>
            </div>
            <p className="text-xs text-foreground/40 mt-4">
              <Link href="/about#how-we-verify" className="underline hover:text-foreground/60">
                How we verify listings
              </Link>
            </p>
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

      <section className="container-page py-14 max-w-3xl">
        <h2 className="text-xl font-semibold mb-6">Questions</h2>
        <div className="flex flex-col divide-y divide-border">
          {faqs.map((f) => (
            <div key={f.question} className="py-4">
              <p className="font-semibold">{f.question}</p>
              <p className="text-sm text-foreground/60 mt-1">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted border-y border-border">
        <div className="container-page py-14">
          <h2 className="text-xl font-semibold mb-6">Other English-speaking professionals in {area.name}</h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/${area.slug}/${c.slug}`}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-brand hover:bg-brand-light transition"
              >
                {c.icon} English {c.name} in {area.name}
              </Link>
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-10 mb-6">{category.name} in other areas</h2>
          <div className="flex flex-wrap gap-2">
            {otherAreas.map((a) => (
              <Link
                key={a.slug}
                href={`/${a.slug}/${category.slug}`}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm hover:border-brand hover:bg-brand-light transition"
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
