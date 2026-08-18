import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { areas, visibleCategories, getArea } from "@/lib/data";
import { LeadForm } from "@/components/LeadForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return areas.map((a) => ({ area: a.slug }));
}

export async function generateMetadata(props: PageProps<"/[area]">): Promise<Metadata> {
  const { area: areaSlug } = await props.params;
  const area = getArea(areaSlug);
  if (!area) return {};
  return {
    title: `English-Speaking Professionals in ${area.name}, Barcelona`,
    description: `Find trusted English-speaking dentists, doctors, lawyers, tax advisors and more in ${area.name} (${area.district}), Barcelona.`,
  };
}

export default async function AreaPage(props: PageProps<"/[area]">) {
  const { area: areaSlug } = await props.params;
  const area = getArea(areaSlug);
  if (!area) notFound();

  const jsonLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: area.name, url: `/${area.slug}` },
  ]);

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-page pt-5">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: area.name }]} />
      </div>
      <section className="border-b border-border">
        <div className="relative aspect-[16/7] sm:aspect-[3/1] overflow-hidden">
          <Image
            src={area.image}
            alt={`${area.name}, Barcelona`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-page pb-5 sm:pb-8">
              <p className="text-sm font-semibold text-white/90 mb-1">{area.district} district</p>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl text-balance">
                English-speaking professionals in {area.name}
              </h1>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-b from-brand-light to-background">
          <div className="container-page py-8 sm:py-10 text-center">
            <p className="text-foreground/70 max-w-xl mx-auto">{area.blurb}</p>
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Services in {area.name}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {visibleCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/${area.slug}/${c.slug}`}
              className="rounded-2xl border border-border p-5 hover:border-brand/30 hover:shadow-soft hover:-translate-y-0.5 transition-all bg-surface"
            >
              <span className="text-3xl">{c.icon}</span>
              <p className="font-semibold mt-3 line-clamp-2">
                English-speaking {c.pluralName} in {area.name}
              </p>
              <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{c.shortPitch}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted border-y border-border">
        <div className="container-page py-14 sm:py-20 max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-center">
            Not sure who you need in {area.name}?
          </h2>
          <p className="text-foreground/60 mb-6 text-center">Tell us and we&apos;ll match you.</p>
          <LeadForm defaultAreaSlug={area.slug} />
        </div>
      </section>
    </div>
  );
}
