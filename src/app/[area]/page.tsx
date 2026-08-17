import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { areas, categories, getArea } from "@/lib/data";
import { LeadForm } from "@/components/LeadForm";

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

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-light to-background border-b border-border">
        <div className="container-page py-14 sm:py-20 text-center">
          <p className="text-sm font-semibold text-brand mb-2">{area.district} district</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto text-balance">
            English-speaking professionals in {area.name}
          </h1>
          <p className="mt-4 text-foreground/70 max-w-xl mx-auto">{area.blurb}</p>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl font-semibold mb-6">Services in {area.name}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${area.slug}/${c.slug}`}
              className="rounded-2xl border border-border p-5 hover:border-brand hover:shadow-md transition bg-surface"
            >
              <span className="text-3xl">{c.icon}</span>
              <p className="font-semibold mt-3">{c.pluralName}</p>
              <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{c.shortPitch}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted border-y border-border">
        <div className="container-page py-14 max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold mb-1 text-center">
            Not sure who you need in {area.name}?
          </h2>
          <p className="text-foreground/60 mb-6 text-center">Tell us and we&apos;ll match you.</p>
          <LeadForm defaultAreaSlug={area.slug} />
        </div>
      </section>
    </div>
  );
}
