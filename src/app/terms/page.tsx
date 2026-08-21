import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using Barcelona English Pros.",
};

export default function TermsPage() {
  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
      <p className="text-sm text-foreground/50 mb-10">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

      <div className="prose prose-sm text-foreground/70 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">What this service is</h2>
          <p>
            Barcelona English Pros (&quot;we&quot;, &quot;us&quot;) is an independent directory
            and matching service. We help you find English-speaking professionals in
            Barcelona based on what you tell us you need. Using the site, submitting the
            enquiry form, or contacting a listed professional through it means you accept
            these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">We&apos;re a directory, not the professional</h2>
          <p>
            We are not a clinic, law firm, or the professionals themselves, and we don&apos;t
            employ, supervise, or take responsibility for the services any listed
            professional provides. Any agreement, appointment, payment, or dispute is
            between you and that professional directly. We&apos;re not affiliated with any
            clinic, law firm, government body, or the City of Barcelona.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">How listings are verified</h2>
          <p>
            We only list a professional after finding a specific, checkable signal that they
            offer service in English. Details change, though, so we&apos;d rather you
            double-check anything important (a qualification, insurance, emergency
            availability) directly with them. See{" "}
            <a href="/about#how-we-verify" className="underline hover:text-brand">
              how we verify listings
            </a>{" "}
            for more.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">It&apos;s free, and how we&apos;re paid</h2>
          <p>
            The service is always free to use. We may earn a fee from professionals we match
            you with, but that never changes what you pay them, and never affects who we
            recommend for your specific need.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Your data</h2>
          <p>
            See our{" "}
            <a href="/privacy" className="underline hover:text-brand">
              Privacy Policy
            </a>{" "}
            for exactly what we collect when you submit the enquiry form and what we do with
            it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Changes</h2>
          <p>
            We may update these terms as the service changes. Continuing to use the site
            after an update means you accept the current version.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a href="mailto:hello@barcelonaenglishpros.com" className="underline hover:text-brand">
              hello@barcelonaenglishpros.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
