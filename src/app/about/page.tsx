import type { Metadata } from "next";
import { areas } from "@/lib/data";

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

      <div id="photo-credits" className="mt-14 pt-8 border-t border-border scroll-mt-20">
        <h2 className="text-lg font-semibold mb-3">Photo credits</h2>
        <p className="text-sm text-foreground/60 mb-4">
          Neighbourhood photos are sourced from Wikimedia Commons under free licenses.
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
        </ul>
      </div>
    </div>
  );
}
