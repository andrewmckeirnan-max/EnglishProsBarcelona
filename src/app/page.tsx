import Link from "next/link";
import Image from "next/image";
import { CheckCheck, ListFilter, Unlock } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { areas, visibleCategories } from "@/lib/data";
import { professionals } from "@/lib/professionals";

export default function Home() {
  // Real, computed from the live dataset, not a placeholder stat - never
  // drifts out of sync as more listings get added.
  const verifiedCount = professionals.length;

  return (
    <div>
      {/* Hero — the match form sits beside the headline (not just linked
          from the header CTA) so it's visible without scrolling or
          bypassing the trust content below. */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="container-page pt-16 pb-16 sm:pt-24 sm:pb-20">
          <div className="grid lg:grid-cols-[1.05fr_440px] gap-10 lg:gap-14 items-start">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-border text-xs font-semibold px-3 py-1.5 text-brand mb-6 shadow-soft">
                <CheckCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                {verifiedCount} verified professionals &middot; 6 neighbourhoods
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance max-w-2xl mx-auto lg:mx-0">
                Find an English-speaking professional in Barcelona
              </h1>
              <p className="mt-5 text-lg text-foreground/70 max-w-xl mx-auto lg:mx-0 text-balance">
                Dentists, doctors, lawyers, tax advisors and more, matched to your
                neighbourhood, in a language you&apos;re fluent in.
              </p>
            </div>
            <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0 lg:mt-12">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand mb-2 text-center lg:text-left">
                Get matched &middot; free &middot; under a minute
              </p>
              <div id="find" className="scroll-mt-20">
                <LeadForm compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="container-page py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">What are you looking for?</h2>
        <p className="text-foreground/60 mb-8">Browse by service, then choose your neighbourhood.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {visibleCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/barcelona/${c.slug}`}
              className="rounded-2xl border border-border p-5 hover:border-brand/30 hover:shadow-soft hover:-translate-y-0.5 transition-all bg-surface"
            >
              <span className="text-3xl">{c.icon}</span>
              <p className="font-semibold mt-3">{c.pluralName}</p>
              <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{c.shortPitch}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Areas */}
      <section className="bg-surface-muted border-y border-border">
        <div className="container-page py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">Barcelona neighbourhoods we cover</h2>
          <p className="text-foreground/60 mb-8">
            Starting with the areas with the largest English-speaking communities.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/${a.slug}`}
                className="group rounded-2xl border border-border bg-surface overflow-hidden hover:border-brand/30 hover:shadow-soft-lg hover:-translate-y-1 transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
                  <Image
                    src={a.image}
                    alt={`${a.name}, Barcelona`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-xs text-foreground/50 mb-2">{a.district} district</p>
                  <p className="text-sm text-foreground/70 line-clamp-3">{a.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-xs text-foreground/40 mt-4">
            Neighbourhood photos via Wikimedia Commons.{" "}
            <Link href="/about#photo-credits" className="underline hover:text-foreground/60">
              Photo credits
            </Link>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16 sm:py-20 pb-20 sm:pb-24">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-10 text-center">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { Icon: ListFilter, title: "Tell us what you need", body: "Describe it in your own words, or pick a service, area and urgency step by step." },
            { Icon: CheckCheck, title: "See real matches instantly", body: "We show your top vetted options right on the page, not a generic list, before you give us anything." },
            { Icon: Unlock, title: "Get the full list and typical prices", body: "Add your name, phone and email and we send you every match with contact details and a map link, plus typical prices for that service in Barcelona." },
          ].map((s) => (
            <div key={s.title} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-soft">
                <s.Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-foreground/60 mt-1">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
