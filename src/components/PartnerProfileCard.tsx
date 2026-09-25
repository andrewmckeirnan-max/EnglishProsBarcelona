import { Crown, Star, MapPin, Calendar, MessageCircle, Phone, ExternalLink } from "lucide-react";
import type { Professional } from "@/lib/types";
import { waLink } from "@/lib/whatsapp";
import { googleMapsSearchUrl } from "@/lib/maps";
import { getCategory } from "@/lib/data";
import { parseRating } from "@/lib/text";
import { StarRating } from "@/components/StarRating";

/**
 * The standout listing for featured, recommended and top partners. Same layout as the profile on the
 * /partners page, but built only from real data: no reviews are shown unless we hold a verified rating,
 * and buttons appear only for contact details the business has published.
 */
export function PartnerProfileCard({ professional: p, rank }: { professional: Professional; rank?: number }) {
  const initials = p.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const rating = parseRating(p.ratingLabel);
  const categoryName = getCategory(p.categorySlug)?.name ?? "";
  const mapQuery = encodeURIComponent(p.streetAddress ? `${p.streetAddress}, Barcelona` : `${p.name}, ${p.addressArea}, Barcelona`);
  const telHref = p.phoneDisplay ? `tel:${p.phoneDisplay.replace(/[^\d+]/g, "")}` : null;

  const badge =
    p.partnerTier === "top"
      ? { label: "Top Recommendation", Icon: Crown, cls: "from-amber-400 to-amber-500", tip: "This business pays for the exclusive #1 spot for this service and area. It doesn't affect who we think fits your need best, that's based on what you tell us." }
      : p.partnerTrial
        ? { label: "Featured", Icon: Star, cls: "from-amber-400 to-amber-500", tip: "Featured by Barcelona English Pros. It doesn't affect who we think fits your need best, that's based on what you tell us." }
        : { label: "Recommended partner", Icon: Star, cls: "from-brand to-brand-dark", tip: "This business pays for priority placement here. It doesn't affect who we think fits your need best, that's based on what you tell us." };

  const hasWhatsapp = Boolean(p.whatsappNumber);
  const waHref = p.whatsappNumber
    ? waLink(p.whatsappNumber, `Hi${p.contactName ? ` ${p.contactName}` : ""}, I found you via Barcelona English Pros and I'd like to book an appointment.`)
    : null;

  return (
    <div className="relative rounded-3xl border border-amber-200 bg-surface shadow-soft-lg overflow-hidden">
      <div className="relative h-24 hero-gradient">
        <span
          title={badge.tip}
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${badge.cls} text-white text-[11px] font-bold px-3 py-1 shadow-soft cursor-help`}
        >
          <badge.Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
          {badge.label}
        </span>
        {rank != null && (
          <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-[13px] font-bold text-amber-950 shadow-soft ring-2 ring-white">
            {rank}
          </span>
        )}
        {p.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external, unoptimized business photo
          <img src={p.photoUrl} alt={p.name} className="absolute -bottom-8 left-5 h-16 w-16 rounded-2xl border-4 border-surface shadow-soft object-cover bg-brand-light" />
        ) : (
          <div className="absolute -bottom-8 left-5 h-16 w-16 rounded-2xl bg-brand-light border-4 border-surface shadow-soft flex items-center justify-center text-brand font-bold text-lg">
            {initials}
          </div>
        )}
      </div>

      <div className="pt-11 px-5 pb-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-bold text-lg leading-tight">{p.name}</h3>
            <p className="text-sm text-foreground/60 mt-0.5">
              {categoryName} &middot; {p.addressArea}
            </p>
          </div>
          {rating && (
            <div className="flex items-center gap-1.5 text-sm">
              <StarRating value={Number(rating.value)} size={15} />
              <span className="font-semibold">{rating.value}</span>
              <span className="text-foreground/50 text-xs">({rating.count})</span>
            </div>
          )}
        </div>

        <p className="flex items-center gap-1.5 text-xs text-foreground/50 mt-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          {p.streetAddress ? `${p.streetAddress} · ` : ""}Speaks {p.languages.join(", ")}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {p.specialties.map((s) => (
            <span key={s} className="text-xs rounded-full bg-surface-muted border border-border px-2 py-1 text-foreground/70">
              {s}
            </span>
          ))}
        </div>

        {p.bio && <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{p.bio}</p>}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {p.bookingUrl && (
            <a
              href={p.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${telHref ? "" : "col-span-2 "}flex flex-col items-center justify-center gap-1 rounded-xl bg-foreground text-white text-sm font-semibold py-2.5 hover:bg-brand-dark transition-colors`}
            >
              <Calendar className="h-4 w-4" strokeWidth={2} />
              Book now
            </a>
          )}
          {telHref && (
            <a
              href={telHref}
              className={`${p.bookingUrl ? "" : "col-span-2 "}flex flex-col items-center justify-center gap-1 rounded-xl border border-brand text-brand text-sm font-semibold py-2.5 hover:bg-brand-light transition`}
            >
              <Phone className="h-4 w-4" strokeWidth={2} />
              Call
            </a>
          )}
          {hasWhatsapp && waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white text-sm font-semibold py-3 hover:opacity-90 transition"
            >
              <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
              {p.contactName ? `Connect with ${p.contactName} on WhatsApp` : "WhatsApp"}
            </a>
          )}
        </div>

        <div className="relative mt-4 rounded-xl overflow-hidden border border-border h-36">
          <iframe
            title={`${p.name} location map`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            loading="lazy"
            className="h-full w-full grayscale-[15%]"
          />
          <a
            href={googleMapsSearchUrl(p)}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-surface/95 backdrop-blur text-[11px] font-semibold px-2.5 py-1 shadow-soft hover:bg-surface transition"
          >
            Open in Maps
            <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  );
}
