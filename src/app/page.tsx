import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "@/components/SearchBar";
import { LeadForm } from "@/components/LeadForm";
import { areas, visibleCategories } from "@/lib/data";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-light to-background">
        <div className="container-page pt-14 pb-20 sm:pt-20 sm:pb-28 text-center">
          <span className="inline-block rounded-full bg-white/70 border border-border text-xs font-semibold px-3 py-1 text-brand mb-5">
            Barcelona &middot; English-speaking professionals
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance max-w-3xl mx-auto">
            Find an English-speaking professional in Barcelona
          </h1>
          <p className="mt-4 text-lg text-foreground/70 max-w-xl mx-auto text-balance">
            Dentists, doctors, lawyers, tax advisors and more, matched to your
            neighbourhood, in a language you&apos;re fluent in.
          </p>
          <div className="mt-8 max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="container-page py-16">
        <h2 className="text-2xl font-semibold mb-1">What are you looking for?</h2>
        <p className="text-foreground/60 mb-6">Browse by service, then choose your neighbourhood.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {visibleCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/eixample/${c.slug}`}
              className="rounded-2xl border border-border p-5 hover:border-brand hover:shadow-md transition bg-surface"
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
        <div className="container-page py-16">
          <h2 className="text-2xl font-semibold mb-1">Barcelona neighbourhoods we cover</h2>
          <p className="text-foreground/60 mb-6">
            Starting with the areas with the largest English-speaking communities.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/${a.slug}`}
                className="group rounded-2xl border border-border bg-surface overflow-hidden hover:border-brand hover:shadow-md transition"
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
      <section className="container-page py-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Tell us what you need", body: "Describe it in your own words, or pick a service, area and urgency step by step." },
            { step: "2", title: "See real matches instantly", body: "We show your top vetted options right on the page, not a generic list, before you give us anything." },
            { step: "3", title: "Unlock the full ranked list", body: "Add your WhatsApp and email to unlock every match with contact details, Google Maps links and a cost comparison." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white font-bold">
                {s.step}
              </div>
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-foreground/60 mt-1">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lead form */}
      <section id="find" className="container-page pb-24 scroll-mt-20">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold mb-1 text-center">Get matched now</h2>
          <p className="text-foreground/60 mb-6 text-center">Takes under a minute. No cost to you.</p>
          <LeadForm />
        </div>
      </section>
    </div>
  );
}
