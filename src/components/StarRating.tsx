import { Star } from "lucide-react";

/**
 * Five-star rating graphic with proportional gold fill (e.g. 4.6 fills the
 * 5th star 60%), the pattern used by Fresha/Booksy/Google listings rather
 * than a single icon + number. Background stars use the border tone as the
 * "empty" state so it reads correctly in both light and dark surfaces.
 */
export function StarRating({ value, size = 14 }: { value: number; size?: number }) {
  const pct = (Math.max(0, Math.min(5, value)) / 5) * 100;
  const row = (colorClass: string) => (
    <span className={`flex gap-[1px] ${colorClass}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} style={{ width: size, height: size }} className="shrink-0 fill-current" strokeWidth={0} />
      ))}
    </span>
  );
  return (
    <span className="relative inline-flex" style={{ width: size * 5 + 4, height: size }}>
      <span className="text-border">{row("text-border")}</span>
      <span className="absolute inset-0 overflow-hidden text-amber-400" style={{ width: `${pct}%` }}>
        {row("text-amber-400")}
      </span>
    </span>
  );
}
