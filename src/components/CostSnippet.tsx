import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CategorySlug } from "@/lib/types";
import { costsForCategory, formatRange } from "@/lib/costData";

/** Compact "typical prices" box linking into the cost checker. Renders nothing when a profession has no price data. */
export function CostSnippet({
  categories,
  heading,
  className = "container-page py-8 sm:py-10",
}: {
  categories: CategorySlug[];
  heading?: string;
  className?: string;
}) {
  const items = categories.flatMap((c) => costsForCategory(c)).slice(0, 5);
  if (items.length === 0) return null;
  return (
    <section className={className}>
      <div className="rounded-2xl border border-border bg-surface-muted p-5 sm:p-6">
        <h2 className="text-lg font-bold tracking-tight">{heading ?? "Typical prices in Barcelona, 2026"}</h2>
        <ul className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
          {items.map((c) => (
            <li key={c.id} className="flex justify-between gap-3 border-b border-border/60 py-1.5">
              <Link href={`/cost-checker#${c.id}`} className="hover:text-brand">
                {c.service}
              </Link>
              <span className="font-semibold whitespace-nowrap">{formatRange(c)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-foreground/50">Typical market ranges from published sources, not the fees of any professional listed here.</p>
        <Link href="/cost-checker" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          Check a quote with the free cost checker <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}
