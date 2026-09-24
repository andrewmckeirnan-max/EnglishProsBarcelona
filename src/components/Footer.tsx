import Link from "next/link";
import { areas, visibleCategories } from "@/lib/data";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted mt-24">
      <div className="container-page py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-3">
            <Logo />
          </div>
          <p className="text-foreground/60 leading-relaxed">
            The English-speaking professional finder for Barcelona. We match
            you with trusted local dentists, doctors, lawyers and more.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-3">Popular services</p>
          <ul className="space-y-2">
            {visibleCategories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/barcelona/${c.slug}`} className="text-foreground/70 hover:text-brand">
                  {c.pluralName} in Barcelona
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-3">Areas</p>
          <ul className="space-y-2">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link href={`/${a.slug}`} className="text-foreground/70 hover:text-brand">
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-3">Company</p>
          <ul className="space-y-2">
            <li>
              <Link href="/blog" className="text-foreground/70 hover:text-brand">
                Guides
              </Link>
            </li>
            <li>
              <Link href="/partners" className="text-foreground/70 hover:text-brand">
                List your practice
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-foreground/70 hover:text-brand">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-foreground/70 hover:text-brand">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-foreground/70 hover:text-brand">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 text-xs text-foreground/50 flex flex-col sm:flex-row justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Barcelona English Pros. Not affiliated with any clinic, law firm or public body.</p>
          <p>Barcelona, Spain</p>
        </div>
      </div>
    </footer>
  );
}
