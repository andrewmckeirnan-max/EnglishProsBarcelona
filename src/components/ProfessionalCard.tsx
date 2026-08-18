import { Star, Lock } from "lucide-react";
import type { Professional } from "@/lib/types";
import { waLink } from "@/lib/whatsapp";
import { googleMapsSearchUrl } from "@/lib/maps";
import { parseRating } from "@/lib/text";

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const initials = professional.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const rating = parseRating(professional.ratingLabel);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col sm:flex-row gap-4 sm:items-center hover:shadow-soft hover:border-brand/20 transition-all">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand font-bold">
        {initials}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold">{professional.name}</h3>
          {rating && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/80">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
              {rating.value}
              <span className="font-normal text-foreground/50">({rating.count})</span>
            </span>
          )}
          {professional.isPartner && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-brand text-white text-[11px] font-semibold px-2 py-0.5 cursor-help"
              title="This business pays for priority placement here. It doesn't affect who we think fits your need best, that's based on what you tell us."
            >
              Recommended partner
              <span aria-hidden="true" className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-white/25 text-[9px] leading-none">
                i
              </span>
            </span>
          )}
        </div>
        <p className="text-sm text-foreground/60 mt-0.5">{professional.addressArea}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {professional.specialties.map((s) => (
            <span key={s} className="text-xs rounded-full bg-surface-muted border border-border px-2 py-1 text-foreground/70">
              {s}
            </span>
          ))}
        </div>
        <p className="text-xs text-foreground/50 mt-2">
          Speaks: {professional.languages.join(", ")}
        </p>
      </div>
      <div className="flex sm:flex-col gap-2 sm:w-40 shrink-0">
        {professional.whatsappNumber && (
          <a
            href={waLink(professional.whatsappNumber, `Hi, I found ${professional.name} via Barcelona English Pros and I'd like to book an appointment.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-full bg-[#25D366] text-white text-sm font-semibold px-4 py-2 hover:opacity-90 transition"
          >
            WhatsApp
          </a>
        )}
        {professional.bookingUrl && (
          <a
            href={professional.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-full border border-brand text-brand text-sm font-semibold px-4 py-2 hover:bg-brand-light transition"
          >
            {professional.isPartner ? "Book" : "Visit website"}
          </a>
        )}
        {/* Every listing needs at least one working action, even the ones
            we haven't onboarded a WhatsApp number or website link for yet.
            A Maps search is always buildable from name + addressArea alone. */}
        {!professional.whatsappNumber && !professional.bookingUrl && (
          <a
            href={googleMapsSearchUrl(professional)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-full border border-brand text-brand text-sm font-semibold px-4 py-2 hover:bg-brand-light transition"
          >
            View on Google Maps
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Teaser for a professional beyond the free preview limit, shows that
 * more options exist without revealing who they are, and links to the
 * lead form (`#get-matched`) where submitting name + WhatsApp + email
 * unlocks the full ranked list.
 */
export function LockedProfessionalCard() {
  return (
    <div className="relative rounded-2xl border border-dashed border-border bg-surface-muted overflow-hidden">
      <div className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center blur-[3px] select-none pointer-events-none opacity-70">
        <div className="h-14 w-14 shrink-0 rounded-full bg-border" />
        <div className="flex-1">
          <div className="h-4 w-40 rounded bg-border mb-2" />
          <div className="h-3 w-28 rounded bg-border mb-3" />
          <div className="flex gap-1.5">
            <div className="h-5 w-16 rounded-full bg-border" />
            <div className="h-5 w-20 rounded-full bg-border" />
          </div>
        </div>
        <div className="h-9 w-28 rounded-full bg-border shrink-0" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-surface-muted/60">
        <a
          href="#get-matched"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand text-white text-xs font-semibold px-4 py-2 shadow-soft hover:bg-brand-dark transition"
        >
          <Lock className="h-3 w-3" strokeWidth={2.5} />
          Unlock this option
        </a>
      </div>
    </div>
  );
}
