// Two-tier wordmark: bold city name on top, a smaller wide-tracked
// descriptor beneath it. This is the standard "prestigious professional
// services" lockup convention (real estate, private client, hospitality
// brands lean on it constantly) — it reads as established/serious through
// restraint and typographic confidence rather than a mascot-style icon.
// Deliberately no boxed monogram/icon badge, following the same instinct
// that makes Planity's wordmark-only logo feel premium: the absence of a
// decorative icon is itself the signal.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col leading-none select-none ${className}`}>
      <span className="font-bold tracking-tight text-[17px] text-foreground">BARCELONA</span>
      <span className="font-semibold text-[9px] tracking-[0.28em] text-brand mt-0.5">ENGLISH PROS</span>
    </span>
  );
}
