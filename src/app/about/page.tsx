import type { Metadata } from "next";
import { areas, cultureImages } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "Barcelona English Pros helps English-speaking residents of Barcelona find trusted local professionals.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-4">About Barcelona English Pros</h1>
      <div className="prose prose-sm text-foreground/70 space-y-4">
        <p>
          Barcelona English Pros helps English-speaking residents, expats and visitors in
          Barcelona find professionals (dentists, doctors, lawyers, tax advisors and
          more) who can serve them entirely in English, near their neighbourhood.
        </p>
        <p>
          We may earn a fee from professionals we match you with. That never changes
          what you pay them, and it never affects who we recommend for your specific
          need. Matches are based on what you tell us, not who pays the most.
        </p>
        <p>
          We are an independent directory and matching service. We are not affiliated
          with any clinic, law firm, government body, or the City of Barcelona.
        </p>
      </div>

      <div id="how-we-verify" className="mt-14 pt-8 border-t border-border scroll-mt-20">
        <h2 className="text-lg font-semibold mb-3">How we verify listings</h2>
        <div className="prose prose-sm text-foreground/70 space-y-3">
          <p>
            Every professional on this site is added only after we find a specific,
            checkable signal that they offer service in English, cross-checked against
            their real address on Google Maps: an explicit mention in a review, in their
            own business name, or on their website. We don&apos;t list a business just
            because it&apos;s nearby or highly rated.
          </p>
          <p>
            We show ratings and review counts only where we can trace them to a genuine,
            visible source (currently Google Maps), never invented. We don&apos;t show
            pricing unless a professional has published it themselves, and we don&apos;t
            claim any listing is &quot;the best&quot; without a stated reason.
          </p>
          <p>
            None of this replaces your own judgement; details change, and we&apos;d
            rather you double-check something important (a qualification, an insurance
            policy, an emergency service) directly with the professional. If you find a
            listing that&apos;s out of date or wrong, tell us and we&apos;ll fix it.
          </p>
        </div>
      </div>

      <div id="photo-credits" className="mt-14 pt-8 border-t border-border scroll-mt-20">
        <h2 className="text-lg font-semibold mb-3">Photo credits</h2>
        <p className="text-sm text-foreground/60 mb-4">
          Neighbourhood and Barcelona-life photos are sourced from Wikimedia Commons under free licenses.
        </p>
        <ul className="text-sm text-foreground/60 space-y-1.5">
          {areas.map((a) => (
            <li key={a.slug}>
              <span className="font-medium text-foreground/80">{a.name}</span>: photo by{" "}
              {a.imageCredit.photographer} (
              <a href={a.imageCredit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand">
                {a.imageCredit.license}
              </a>
              )
            </li>
          ))}
          {cultureImages.map((img) => (
            <li key={img.src}>
              <span className="font-medium text-foreground/80">{img.caption}</span>: photo by{" "}
              {img.credit.photographer} (
              <a href={img.credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand">
                {img.credit.license}
              </a>
              )
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
