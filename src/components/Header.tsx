"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { areas, visibleCategories } from "@/lib/data";
import { Logo } from "@/components/Logo";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"services" | "areas" | null>(null);

  function closeMobile() {
    setMobileOpen(false);
    setMobileSection(null);
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
      <div className="container-page flex items-center justify-between h-16 gap-4">
        <Link href="/" className="shrink-0" onClick={closeMobile}>
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <div className="group relative">
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-surface-muted font-medium">
              Services
              <ChevronDown className="h-3.5 w-3.5 text-foreground/50 transition-transform group-hover:rotate-180" strokeWidth={2.5} />
            </button>
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition absolute left-0 top-full pt-2 w-[420px]">
              <div className="rounded-xl border border-border bg-surface shadow-soft-lg p-2 max-h-[75vh] overflow-y-auto grid grid-cols-2 gap-0.5">
                {visibleCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/eixample/${c.slug}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-muted text-sm"
                  >
                    <span>{c.icon}</span>
                    <span>{c.pluralName}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="group relative">
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-surface-muted font-medium">
              Areas
              <ChevronDown className="h-3.5 w-3.5 text-foreground/50 transition-transform group-hover:rotate-180" strokeWidth={2.5} />
            </button>
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition absolute left-0 top-full pt-2 w-56">
              <div className="rounded-xl border border-border bg-surface shadow-soft-lg p-2 max-h-[75vh] overflow-y-auto">
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

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/#find"
            className="rounded-full bg-brand text-white text-sm font-semibold px-4 py-2.5 hover:bg-brand-dark transition-colors shadow-soft"
          >
            Find a professional
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-muted"
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile menu: the desktop nav is hidden entirely below md, so this
          is the only way a phone visitor can browse by service or area
          from anywhere other than the homepage's own grids. */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container-page py-3 flex flex-col">
            <button
              onClick={() => setMobileSection((s) => (s === "services" ? null : "services"))}
              className="flex items-center justify-between py-3 font-medium text-left"
            >
              Services
              <ChevronDown
                className={`h-4 w-4 text-foreground/50 transition-transform ${mobileSection === "services" ? "rotate-180" : ""}`}
                strokeWidth={2.5}
              />
            </button>
            {mobileSection === "services" && (
              <div className="grid grid-cols-2 gap-0.5 pb-3">
                {visibleCategories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/eixample/${c.slug}`}
                    onClick={closeMobile}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-muted text-sm"
                  >
                    <span>{c.icon}</span>
                    <span>{c.pluralName}</span>
                  </Link>
                ))}
              </div>
            )}

            <button
              onClick={() => setMobileSection((s) => (s === "areas" ? null : "areas"))}
              className="flex items-center justify-between py-3 border-t border-border font-medium text-left"
            >
              Areas
              <ChevronDown
                className={`h-4 w-4 text-foreground/50 transition-transform ${mobileSection === "areas" ? "rotate-180" : ""}`}
                strokeWidth={2.5}
              />
            </button>
            {mobileSection === "areas" && (
              <div className="flex flex-col gap-0.5 pb-3">
                {areas.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/${a.slug}`}
                    onClick={closeMobile}
                    className="px-3 py-2 rounded-lg hover:bg-surface-muted text-sm"
                  >
                    {a.name}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/partners"
              onClick={closeMobile}
              className="py-3 border-t border-border font-medium"
            >
              For professionals
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
