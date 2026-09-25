import { Lock, Crown, Mail } from "lucide-react";
import type { Professional } from "@/lib/types";
import { waLink } from "@/lib/whatsapp";
import { googleMapsSearchUrl, staticMapThumbnailUrl } from "@/lib/maps";
import { parseRating } from "@/lib/text";
import { StarRating } from "@/components/StarRating";
import { PartnerProfileCard } from "@/components/PartnerProfileCard";

export function ProfessionalCard({
  professional,
  rank,
  compact = false,
  locked = false,
}: {
  professional: Professional;
  rank?: number;
  compact?: boolean;
  /** Name, languages and specialties stay public; website, map and booking links unlock with the form. */
  locked?: boolean;
}) {
  const initials = professional.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const rating = parseRating(professional.ratingLabel);
  // Tier 1: a real photo of the business (never a scraped Google/review
  // photo, see types.ts). Tier 2: a static map pin on their real geocoded
  // location, when we have coordinates but no photo. Tier 3: plain
  // initials, when we have neither.
  const photoSrc =
    professional.photoUrl ??
    (professional.lat != null && professional.lng != null
      ? staticMapThumbnailUrl(professional.lat, professional.lng)
      : undefined);

  const isTopPartner = professional.partnerTier === "top";

  // Featured, recommended and top partners get the standout profile card (unless the list is still locked).
  if (professional.partnerTier && !locked) {
    return <PartnerProfileCard professional={professional} rank={rank} />;
  }

  return (
    <div
      className={`relative rounded-2xl border bg-surface p-5 flex flex-col ${compact ? "items-start" : "sm:flex-row sm:items-center"} gap-4 transition-all ${
        isTopPartner
          ? "border-amber-300 shadow-soft bg-gradient-to-br from-amber-50/60 to-transparent"
          : "border-border hover:shadow-soft hover:border-brand/20"
      }`}
    >
      {rank != null && (
        <span className="absolute -top-2.5 -left-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-[13px] font-bold text-amber-950 shadow-soft ring-2 ring-white">
          {rank}
        </span>
      )}
      {photoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- external, unoptimized source photo/map tile
        <img
          src={photoSrc}
          alt={professional.name}
          className="h-14 w-14 shrink-0 rounded-full object-cover bg-surface-muted"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand font-bold">
          {initials}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold">{professional.name}</h3>
          {rating && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
              <StarRating value={Number(rating.value)} size={13} />
              {rating.value}
              <span className="font-normal text-foreground/50">({rating.count})</span>
            </span>
          )}
          {professional.partnerTier === "top" && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 cursor-help"
              title="This business pays for the exclusive #1 spot for this service and area. It doesn't affect who we think fits your need best, that's based on what you tell us."
            >
              <Crown className="h-3 w-3" strokeWidth={2.5} />
              Top Recommendation
            </span>
          )}
          {professional.partnerTier === "recommended" && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-brand text-white text-[11px] font-semibold px-2 py-0.5 cursor-help"
              title={
                professional.partnerTrial
                  ? "Featured by Barcelona English Pros. It doesn't affect who we think fits your need best, that's based on what you tell us."
                  : "This business pays for priority placement here. It doesn't affect who we think fits your need best, that's based on what you tell us."
              }
            >
              {professional.partnerTrial ? "Featured" : "Recommended partner"}
              <span aria-hidden="true" className="inline-flex h-3 w-3 items-center justify-center rounded-full bg-white/25 text-[9px] leading-none">
                i
              </span>
            </span>
          )}
        </div>
        <p className="text-sm text-foreground/60 mt-0.5">
          {locked ? (professional.addressArea.split(",").pop() ?? "").trim() : professional.addressArea}
        </p>
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
        {isTopPartner && professional.bio && (
          <p className="text-sm text-foreground/70 mt-3 leading-relaxed max-w-prose">
            {professional.bio}
          </p>
        )}
      </div>
      <div className={compact ? "flex flex-wrap gap-2 w-full" : "flex sm:flex-col gap-2 sm:w-40 shrink-0"}>
        {locked ? (
          <a
            href="#get-matched"
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-center rounded-full bg-brand text-white text-sm font-semibold px-4 py-2 hover:bg-brand-dark transition"
          >
            <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
            Send me the full details and typical prices
          </a>
        ) : (
        <>
        {professional.whatsappNumber && (
          <a
            href={waLink(professional.whatsappNumber, `Hi, I found ${professional.name} via Barcelona English Pros and I'd like to book an appointment.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-full bg-[#25D366] text-white text-sm font-semibold px-4 py-2 hover:opacity-90 transition"
          >
            {professional.contactName ? `Connect with ${professional.contactName} on WhatsApp` : "WhatsApp"}
          </a>
        )}
        {professional.bookingUrl && (
          <a
            href={professional.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-full border border-brand text-brand text-sm font-semibold px-4 py-2 hover:bg-brand-light transition"
          >
            {professional.partnerTier ? "Book" : "Visit website"}
          </a>
        )}
        {professional.websiteUrl && (
          <a
            href={professional.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-full border border-border text-foreground/70 text-sm font-semibold px-4 py-2 hover:bg-surface-muted transition"
          >
            Website
          </a>
        )}
        {professional.linkedinUrl && (
          <a
            href={professional.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center rounded-full border border-[#0A66C2]/30 text-[#0A66C2] text-sm font-semibold px-4 py-2 hover:bg-[#0A66C2]/10 transition"
          >
            LinkedIn
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
        </>
        )}
      </div>
    </div>
  );
}
