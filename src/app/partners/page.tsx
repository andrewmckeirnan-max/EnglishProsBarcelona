import type { Metadata } from "next";
import { Target, Award, Send, ChevronDown, ArrowRight, MessageCircle } from "lucide-react";
import { ProfessionalCard } from "@/components/ProfessionalCard";
import { PartnerProfileMock } from "@/components/PartnerProfileMock";
import { exampleProfessional } from "@/lib/professionals";
import { businessWaLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "List Your Practice: Get English-Speaking Patient Enquiries",
  description:
    "We send qualified English-speaking enquiries from Barcelona residents to featured professionals. Get the gold Top Recommendation badge and top-of-list placement in your area and service.",
};

const faqs = [
  {
    q: "How is this different from SEO or ads?",
    a: "We already rank for narrow, high-intent searches like \"English dentist Poblenou\". You're not bidding against every dentist in Barcelona for a click, the badge puts you at the top of the exact search someone's already made.",
  },
  {
    q: "Will other businesses in my area still be listed?",
    a: "Yes. We list every real, English-speaking professional we verify, that's what makes the directory useful to residents in the first place. Paying gets you the gold \"Top Recommendation\" badge and first position above the rest of the list, not exclusivity over who else appears.",
  },
  {
    q: "What do I get?",
    a: "The gold \"Top Recommendation\" badge, first position in the list, a full profile page with your own booking button, map and reviews, and every enquiry forwarded to however you actually work, WhatsApp, email or phone, as it comes in.",
  },
  {
    q: "What does it cost?",
    a: "We start with a trial period so you see real enquiry volume before a euro changes hands. Message us your service and area and we'll walk you through it.",
  },
];

export default function PartnersPage() {
  const waMessage = "Hi! I run a clinic/practice in Barcelona and I'd like to hear more about getting the Top Recommendation badge as a featured partner on Barcelona English Pros.";
  const waHref = businessWaLink(waMessage);

  return (
    <div>
      <section className="hero-gradient border-b border-border">
        <div className="container-page py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto text-balance">
            Stop losing English-speaking clients to whoever ranks above you
          </h1>
          <p className="mt-4 text-lg text-foreground/70 max-w-xl mx-auto">
            We already rank for the searches your next patient is typing right now, things
            like &ldquo;English dentist Poblenou&rdquo;. A gold Top Recommendation badge and
            first-position placement make sure they see you first, not just whoever&apos;s already there.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-white text-sm font-semibold px-6 py-3.5 hover:bg-brand-dark transition-colors shadow-soft"
            >
              <Award className="h-4 w-4" strokeWidth={2.5} />
              Get the Top Recommendation badge
            </a>
            <a
              href="#preview"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-foreground/70 hover:text-foreground px-4 py-3.5 transition-colors"
            >
              See what you get
              <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </section>

      <section id="preview" className="container-page py-16 sm:py-20 scroll-mt-16">
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
              Every enquiry arrives with what they need, how urgent it is, and how to reach them, no cold "just checking prices" messages.
            </p>
          </div>
          <div>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light">
              <Award className="h-5 w-5 text-brand" strokeWidth={2} />
            </div>
            <p className="font-semibold">Bumped to the top</p>
            <p className="text-sm text-foreground/60 mt-1">
              The gold badge and first-position placement move you above the rest of the list, every real listing stays up, paying is what gets you seen first.
            </p>
          </div>
          <div>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light">
              <Send className="h-5 w-5 text-brand" strokeWidth={2} />
            </div>
            <p className="font-semibold">Delivered your way</p>
            <p className="text-sm text-foreground/60 mt-1">
              WhatsApp, email or a phone call, you tell us how you want enquiries to land, no login, no dashboard, no lead you forgot to check.
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

      <section className="border-t border-border">
        <div className="container-page py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight max-w-lg mx-auto text-balance">
            Right now, someone else in your area is the one they tap first.
          </h2>
          <p className="mt-3 text-foreground/60 max-w-md mx-auto">
            Tell us your service and neighbourhood, we&apos;ll show you where you&apos;d rank with the badge.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-white text-sm font-semibold px-6 py-3.5 hover:bg-brand-dark transition-colors shadow-soft"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
            Message us on WhatsApp
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </a>
        </div>
      </section>
    </div>
  );
}
