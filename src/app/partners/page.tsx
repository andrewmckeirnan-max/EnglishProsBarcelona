import type { Metadata } from "next";
import { Target, Lock, MessageCircle } from "lucide-react";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { PartnerProfileMock } from "@/components/PartnerProfileMock";
import { exampleProfessional } from "@/lib/professionals";
import { businessWaLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "List Your Practice: Get English-Speaking Patient Enquiries",
  description:
    "We send qualified English-speaking enquiries from Barcelona residents directly to one recommended partner per area and service. No cost unless it converts to enquiries you want.",
};

const faqs = [
  {
    q: "How is this different from SEO or ads?",
    a: "We already rank for narrow, high-intent searches like \"English dentist Poblenou\". Instead of paying for clicks, you pay for qualified enquiries from people actively looking for an English-speaking provider in your area.",
  },
  {
    q: "How many partners per area/service?",
    a: "One. Your listing is featured exclusively for your service and area, we don't sell the same enquiry stream to your direct competitors.",
  },
  {
    q: "What do I get?",
    a: "A featured card on the relevant area + service page, priority placement in the lead-matching flow, and enquiries forwarded to you by WhatsApp and email as they come in.",
  },
  {
    q: "What does it cost?",
    a: "We start with a trial period so you can see real enquiry volume before committing to a monthly rate. Get in touch and we'll talk specifics for your service and area.",
  },
];

export default function PartnersPage() {
  const waMessage = "Hi! I run a clinic/practice in Barcelona and I'd like to hear more about becoming a featured partner on Barcelona English Pros.";

  return (
    <div>
      <section className="hero-gradient border-b border-border">
        <div className="container-page py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto text-balance">
            Get qualified English-speaking patient &amp; client enquiries
          </h1>
          <p className="mt-4 text-lg text-foreground/70 max-w-xl mx-auto">
            We match Barcelona&apos;s English-speaking residents and expats with one
            recommended professional per service, per neighbourhood. Be the one they find.
          </p>
          <a
            href={businessWaLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-white text-sm font-semibold px-6 py-3.5 hover:bg-brand-dark transition-colors shadow-soft"
          >
            Talk to us on WhatsApp
          </a>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-center">From a name in a list to a page built to convert</h2>
        <p className="text-foreground/60 max-w-xl mx-auto text-center mb-10">
          A featured partner doesn&apos;t just get a card, they get top billing on the page a
          qualified lead lands on right after searching &ldquo;English dentist Poblenou&rdquo;,
          with a booking button, your reviews and your location all one tap away.
        </p>
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50 mb-3">
              1. How you appear in results
            </p>
            <ProfessionalCard professional={exampleProfessional} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50 mb-3">
              2. What they see when they tap in
            </p>
            <PartnerProfileMock />
          </div>
        </div>
        <p className="text-xs text-foreground/50 mt-6 text-center">
          Illustrative example, not a real listing or real reviews — built from your actual details, photos and reviews once you&apos;re onboarded.
        </p>
      </section>

      <section className="bg-surface-muted border-y border-border">
        <div className="container-page py-16 sm:py-20 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light">
              <Target className="h-5 w-5 text-brand" strokeWidth={2} />
            </div>
            <p className="font-semibold">Qualified, not generic</p>
            <p className="text-sm text-foreground/60 mt-1">
              Every enquiry includes what they need, how urgent it is, and how to reach them.
            </p>
          </div>
          <div>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light">
              <Lock className="h-5 w-5 text-brand" strokeWidth={2} />
            </div>
            <p className="font-semibold">Exclusive per area</p>
            <p className="text-sm text-foreground/60 mt-1">
              One partner per service, per neighbourhood, never shared with a direct competitor.
            </p>
          </div>
          <div>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light">
              <MessageCircle className="h-5 w-5 text-brand" strokeWidth={2} />
            </div>
            <p className="font-semibold">Delivered by WhatsApp</p>
            <p className="text-sm text-foreground/60 mt-1">
              Enquiries land where you already work, no new dashboard to check.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Questions</h2>
        <div className="flex flex-col divide-y divide-border">
          {faqs.map((f) => (
            <div key={f.q} className="py-5">
              <p className="font-semibold">{f.q}</p>
              <p className="text-sm text-foreground/60 mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
