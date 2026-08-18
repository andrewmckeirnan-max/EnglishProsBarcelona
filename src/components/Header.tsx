import Link from "next/link";
import { areas, visibleCategories } from "@/lib/data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
      <div className="container-page flex items-center justify-between h-16 gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-bold text-sm">
            BE
          </span>
          <span className="font-semibold text-[15px] tracking-tight">
            BCN English Pros
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <div className="group relative">
            <button className="px-3 py-2 rounded-lg hover:bg-surface-muted font-medium">
              Services
            </button>
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition absolute left-0 top-full pt-2 w-64">
              <div className="rounded-xl border border-border bg-surface shadow-lg p-2">
                {visibleCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/eixample/${c.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-muted"
                  >
                    <span>{c.icon}</span>
                    <span>{c.pluralName}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="group relative">
            <button className="px-3 py-2 rounded-lg hover:bg-surface-muted font-medium">
              Areas
            </button>
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition absolute left-0 top-full pt-2 w-56">
              <div className="rounded-xl border border-border bg-surface shadow-lg p-2">
                {areas.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/${a.slug}`}
                    className="block px-3 py-2 rounded-lg hover:bg-surface-muted"
                  >
                    {a.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/partners" className="px-3 py-2 rounded-lg hover:bg-surface-muted font-medium">
            For professionals
          </Link>
        </nav>

        <Link
          href="/#find"
          className="rounded-full bg-brand text-white text-sm font-semibold px-4 py-2 hover:bg-brand-dark transition shrink-0"
        >
          Find a professional
        </Link>
      </div>
    </header>
  );
}
