import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Barcelona English Pros collects, why, and who it's shared with.",
};

export default function PrivacyPage() {
  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-foreground/50 mb-10">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

      <div className="prose prose-sm text-foreground/70 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Who we are</h2>
          <p>
            Barcelona English Pros (&quot;we&quot;, &quot;us&quot;) operates barcelonaenglishpros.com,
            an independent directory that matches English-speaking residents and visitors in
            Barcelona with local professionals. For anything in this policy, contact{" "}
            <a href="mailto:hello@barcelonaenglishpros.com" className="underline hover:text-brand">
              hello@barcelonaenglishpros.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">What we collect</h2>
          <p>When you submit the &quot;get matched&quot; form, we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your name</li>
            <li>Your WhatsApp or phone number</li>
            <li>Your email address</li>
            <li>What you told us you need (service, area, urgency, and any notes you added)</li>
            <li>The page you submitted the form from</li>
            <li>If you choose to tell us, how you found us</li>
          </ul>
          <p>
            We don&apos;t use tracking pixels, ad networks, or analytics that profile you across
            other sites. We do use Vercel Web Analytics, our hosting provider&apos;s privacy-focused,
            cookie-free page-view counter, to see which pages are visited and roughly where visitors
            came from (for example a search engine). It doesn&apos;t identify you personally. Simply
            browsing the site without submitting the form doesn&apos;t send us any of the details above.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Why we collect it, and what we do with it</h2>
          <p>Your enquiry is used only to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Send you, by email, the ranked list of professionals matching your request</li>
            <li>Let us follow up with you directly on WhatsApp or email if we don&apos;t yet have a listed match and need to check availability with someone nearby</li>
            <li>Improve which professionals we prioritise researching and listing</li>
          </ul>
          <p>
            <strong className="text-foreground">
              We do not share your name, contact details, or enquiry with any professional or
              third party.
            </strong>{" "}
            The businesses listed on this site never receive your information from us — if you
            contact one, that&apos;s you reaching out directly, on WhatsApp or their own
            website, outside of anything we control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Who processes it on our behalf</h2>
          <p>We use a small number of service providers to run this site. None of them are permitted to use your data for their own purposes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-foreground">Supabase</strong> — stores your enquiry in our database.</li>
            <li><strong className="text-foreground">Resend</strong> — sends the email with your matched list, and notifies us internally that an enquiry came in.</li>
            <li><strong className="text-foreground">Vercel</strong> — hosts the website itself.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">How long we keep it</h2>
          <p>
            We keep enquiry records to maintain a history of who we&apos;ve helped and to
            improve the service. You can ask us to delete your data at any time (see
            &quot;Your rights&quot; below) and we&apos;ll remove it, other than what we&apos;re
            legally required to retain.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Your rights</h2>
          <p>
            Under GDPR and Spanish data protection law (LOPDGDD), you can ask us to access,
            correct, delete, or export the data we hold about you, or object to how we use it.
            Email{" "}
            <a href="mailto:hello@barcelonaenglishpros.com" className="underline hover:text-brand">
              hello@barcelonaenglishpros.com
            </a>{" "}
            and we&apos;ll act on it. You can also lodge a complaint with Spain&apos;s data
            protection authority, the{" "}
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand"
            >
              Agencia Española de Protección de Datos (AEPD)
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Changes to this policy</h2>
          <p>
            If we change what we collect or how we use it, we&apos;ll update this page and
            change the date at the top.
          </p>
        </section>
      </div>
    </div>
  );
}
