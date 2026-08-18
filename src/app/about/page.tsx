import type { Metadata } from "next";

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
          need — matches are based on what you tell us, not who pays the most.
        </p>
        <p>
          We are an independent directory and matching service. We are not affiliated
          with any clinic, law firm, government body, or the City of Barcelona.
        </p>
      </div>
    </div>
  );
}
