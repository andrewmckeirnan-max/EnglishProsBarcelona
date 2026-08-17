import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { areas, categories, getArea, getCategory } from "@/lib/data";
import { getProfessionals } from "@/lib/professionals";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { LeadForm } from "@/components/LeadForm";
import { sentenceLower } from "@/lib/text";

export function generateStaticParams() {
  return areas.flatMap((a) => categories.map((c) => ({ area: a.slug, category: c.slug })));
}

export async function generateMetadata(props: PageProps<"/[area]/[category]">): Promise<Metadata> {
  const { area: areaSlug, category: categorySlug } = await props.params;
  const area = getArea(areaSlug);
  const category = getCategory(categorySlug);
  if (!area || !category) return {};
  return {
    title: `English-Speaking ${category.name} in ${area.name}, Barcelona`,
    description: `${category.shortPitch} Serving ${area.name} (${area.district}), Barcelona.`,
  };
}

export default async function CategoryPage(props: PageProps<"/[area]/[category]">) {
  const { area: areaSlug, category: categorySlug } = await props.params;
  const area = getArea(areaSlug);
  const category = getCategory(categorySlug);
  if (!area || !category) notFound();

  const professionals = getProfessionals(area.slug, category.slug);
  const otherAreas = areas.filter((a) => a.slug !== area.slug);
  const otherCategories = categories.filter((c) => c.slug !== category.slug).slice(0, 6);

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-light to-background border-b border-border">
        <div className="container-page py-14 sm:py-20">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-start">
            <div>
              <p className="text-sm font-semibold text-brand mb-2">
                {area.name} &middot; {area.district}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                English-speaking {sentenceLower(category.name)} in {area.name}, Barcelona
              </h1>
              <p className="mt-4 text-foreground/70 max-w-xl">{category.shortPitch}</p>

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

            <div className="lg:sticky lg:top-24">
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
              {professionals.some((p) => p.isPartner)
                ? "Our featured partner, plus other English-speaking options we found nearby."
                : "English-speaking options we found nearby. None of these are paying partners yet — this is an independent, informational list."}
            </p>
            <div className="flex flex-col gap-4">
              {professionals.map((p) => (
                <ProfessionalCard key={p.id} professional={p} />
              ))}
            </div>
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

      <section className="bg-surface-muted border-y border-border">
        <div className="container-page py-14">
          <h2 className="text-xl font-semibold mb-6">Also popular in {area.name}</h2>
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
