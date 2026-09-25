"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { costItems, costSources, formatRange, judgeQuote, COST_DATA_CHECKED } from "@/lib/costData";
import { categories } from "@/lib/data";

const groupNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

export function CostChecker({ initialId }: { initialId?: string }) {
  const [id, setId] = useState(initialId ?? costItems[0].id);
  const [quoteText, setQuoteText] = useState("");
  const item = costItems.find((c) => c.id === id) ?? costItems[0];

  // Deep links such as /cost-checker#dental-implant open that service.
  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    if (fromHash && costItems.some((c) => c.id === fromHash)) setId(fromHash);
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, typeof costItems>();
    for (const c of costItems) {
      const g = groupNames[c.categorySlug] ?? c.categorySlug;
      map.set(g, [...(map.get(g) ?? []), c]);
    }
    return [...map.entries()];
  }, []);

  const isPct = item.currency === "pct";
  const quote = Number(quoteText.replace(",", "."));
  const hasQuote = quoteText.trim() !== "" && Number.isFinite(quote) && quote > 0;
  const verdict = hasQuote ? judgeQuote(item, quote) : null;

  // Scale the bar from 0 to a little past the top of the range so a quote above the range still shows.
  const max = Math.max(item.high * 1.25, hasQuote ? quote * 1.05 : 0);
  const pos = (v: number) => `${Math.min(100, Math.max(0, (v / max) * 100))}%`;
  const fmt = (v: number) => (isPct ? `${v}%` : `€${v.toLocaleString("en-GB")}`);

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-soft p-5 sm:p-7">
      <label htmlFor="cost-service" className="block text-sm font-semibold mb-2">
        What do you need a price for?
      </label>
      <select
        id="cost-service"
        value={id}
        onChange={(e) => {
          setId(e.target.value);
          setQuoteText("");
        }}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base"
      >
        {groups.map(([group, items]) => (
          <optgroup key={group} label={group}>
            {items.map((c) => (
              <option key={c.id} value={c.id}>
                {c.service}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <div className="mt-6" aria-live="polite">
        <p className="text-sm text-foreground/60">Typical range in Barcelona, 2026</p>
        <p className="text-3xl sm:text-4xl font-bold tracking-tight mt-1 text-brand">{formatRange(item)}</p>
        <p className="text-sm text-foreground/60 mt-1">{item.unit}</p>

        <div className="mt-5" aria-hidden="true">
          <div className="relative h-3 rounded-full bg-surface-muted">
            <div
              className="absolute top-0 h-3 rounded-full bg-brand/70"
              style={{ left: pos(item.low), width: `calc(${pos(item.high)} - ${pos(item.low)})` }}
            />
            {item.typical !== undefined && (
              <div className="absolute -top-1 h-5 w-1 rounded bg-foreground" style={{ left: pos(item.typical) }} />
            )}
            {hasQuote && (
              <div
                className={`absolute -top-1.5 h-6 w-6 -ml-3 rounded-full border-2 border-white shadow ${
                  verdict === "within" ? "bg-green-600" : verdict === "below" ? "bg-amber-500" : "bg-red-600"
                }`}
                style={{ left: pos(quote) }}
              />
            )}
          </div>
          <div className="flex justify-between text-xs text-foreground/50 mt-2">
            <span>{fmt(item.low)}</span>
            {item.typical !== undefined && <span>Common: about {fmt(item.typical)}</span>}
            <span>{fmt(item.high)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-surface-muted p-4">
        <label htmlFor="cost-quote" className="block text-sm font-semibold">
          Got a quote? Check it {isPct ? "(as a % of the price)" : "(in euros)"}
        </label>
        <input
          id="cost-quote"
          inputMode="decimal"
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          placeholder={isPct ? "e.g. 11" : "e.g. 450"}
          className="mt-2 w-full sm:w-48 rounded-lg border border-border bg-surface px-3 py-2"
        />
        {verdict && (
          <p className="mt-3 text-sm flex items-start gap-2" role="status">
            {verdict === "within" ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600 shrink-0" />
            )}
            <span>
              {verdict === "within" && "That is inside the published range. It is a reasonable figure to compare with a second quote."}
              {verdict === "below" &&
                "That is below the published range. It can be a good deal, so check what is included and that the professional is properly registered."}
              {verdict === "above" &&
                "That is above the published range. Ask what is included, and get a second quote before agreeing."}
            </span>
          </p>
        )}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        <div>
          <p className="text-sm font-semibold">What moves the price</p>
          <p className="text-sm text-foreground/70 mt-1 leading-relaxed">{item.note}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Ask before you book</p>
          <ul className="text-sm text-foreground/70 mt-1 list-disc pl-5 space-y-1">
            {item.ask.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      </div>

      {item.confidence === "limited" && (
        <p className="mt-5 text-xs text-foreground/60 flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 mt-px" />
          Fewer published sources exist for this item, so treat the range as a rough guide.
        </p>
      )}

      <p className="mt-5 text-xs text-foreground/50">
        Sources: {item.sources.map((s, i) => (
          <span key={s}>
            {i > 0 && ", "}
            <a href={costSources[s].url} target="_blank" rel="noopener noreferrer nofollow" className="underline hover:text-brand">
              {costSources[s].name}
            </a>
          </span>
        ))}
        . Checked {new Date(COST_DATA_CHECKED).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/barcelona/${item.categorySlug}`}
          className="inline-flex items-center gap-2 rounded-full bg-brand text-white text-sm font-semibold px-5 py-3 hover:bg-brand-dark transition-colors"
        >
          See English-speaking {groupNames[item.categorySlug]?.toLowerCase()} options <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
        <Link href="/#find" className="inline-flex items-center rounded-full border border-border text-sm font-semibold px-5 py-3 hover:bg-surface-muted">
          Get matched for free
        </Link>
      </div>
    </div>
  );
}
