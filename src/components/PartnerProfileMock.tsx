import { Crown, MapPin, Calendar, MessageCircle, Phone, ExternalLink } from "lucide-react";
import { StarRating } from "@/components/StarRating";

const reviews = [
  { name: "Sarah M.", quote: "Finally a clinic where I didn't have to explain myself in broken Spanish. Booked same week.", rating: 5 },
  { name: "James T.", quote: "Found them through Barcelona English Pros, WhatsApped straight away and got an appointment for the next day.", rating: 5 },
  { name: "Freya L.", quote: "Friendly, professional, and genuinely fluent in English, not just \"a bit\".", rating: 4 },
];

/**
 * Sales-page mockup of the full profile a lead sees after tapping through
 * from the listing card, this is what "featured" actually buys: not just a
 * card in a list, but a page built to convert. Every field here is
 * illustrative, never wire this up to real professional data.
 */
export function PartnerProfileMock() {
  return (
    <div className="rounded-3xl border border-border bg-surface shadow-soft-lg overflow-hidden">
      <div className="relative h-28 hero-gradient">
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[11px] font-bold px-3 py-1 shadow-soft">
          <Crown className="h-3.5 w-3.5" strokeWidth={2.5} />
          Top Recommendation
        </span>
        <div className="absolute -bottom-8 left-5 h-16 w-16 rounded-2xl bg-brand-light border-4 border-surface shadow-soft flex items-center justify-center text-brand font-bold text-lg">
          YC
        </div>
      </div>

      <div className="pt-11 px-5 pb-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-bold text-lg leading-tight">Your Clinic Name</h3>
            <p className="text-sm text-foreground/60 mt-0.5">Dentist &middot; Poblenou, Barcelona</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <StarRating value={4.9} size={15} />
            <span className="font-semibold">4.9</span>
            <span className="text-foreground/50 text-xs">(36 reviews)</span>
          </div>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-foreground/50 mt-2">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
          Carrer de Pujades, Poblenou &middot; Speaks English, Spanish, Catalan
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {["Implants", "Invisalign", "Cosmetic dentistry"].map((s) => (
            <span key={s} className="text-xs rounded-full bg-surface-muted border border-border px-2 py-1 text-foreground/70">
              {s}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <button className="flex flex-col items-center justify-center gap-1 rounded-xl bg-foreground text-white text-xs font-semibold py-2.5 hover:bg-brand-dark transition-colors">
            <Calendar className="h-4 w-4" strokeWidth={2} />
            Book now
          </button>
          <button className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#25D366] text-white text-xs font-semibold py-2.5 hover:opacity-90 transition">
            <MessageCircle className="h-4 w-4" strokeWidth={2} />
            WhatsApp
          </button>
          <button className="flex flex-col items-center justify-center gap-1 rounded-xl border border-brand text-brand text-xs font-semibold py-2.5 hover:bg-brand-light transition">
            <Phone className="h-4 w-4" strokeWidth={2} />
            Call
          </button>
        </div>

        <div className="relative mt-4 rounded-xl overflow-hidden border border-border h-36">
          <iframe
            title="Clinic location map"
            src="https://www.google.com/maps?q=Poblenou,Barcelona&output=embed"
            loading="lazy"
            className="h-full w-full grayscale-[15%]"
          />
          <a
            href="https://www.google.com/maps/search/?api=1&query=Poblenou+Barcelona"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-surface/95 backdrop-blur text-[11px] font-semibold px-2.5 py-1 shadow-soft hover:bg-surface transition"
          >
            Open in Maps
            <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
          </a>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold text-foreground/70 mb-2">What patients say</p>
          <div className="flex flex-col gap-2">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-xl bg-surface-muted border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{r.name}</span>
                  <StarRating value={r.rating} size={11} />
                </div>
                <p className="text-xs text-foreground/60 mt-1 leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
