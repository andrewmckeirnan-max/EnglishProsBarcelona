import type { Professional } from "@/lib/types";
import { waLink } from "@/lib/whatsapp";

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const initials = professional.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand font-bold">
        {initials}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold">{professional.name}</h3>
          {professional.isPartner && (
            <span className="rounded-full bg-brand text-white text-[11px] font-semibold px-2 py-0.5">
              Recommended partner
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
            href={waLink(professional.whatsappNumber, `Hi, I found ${professional.name} via BCN English Pros and I'd like to book an appointment.`)}
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
      </div>
    </div>
  );
}
