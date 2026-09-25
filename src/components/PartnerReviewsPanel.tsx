import { ExternalLink } from "lucide-react";
import type { Professional } from "@/lib/types";
import { parseRating } from "@/lib/text";
import { StarRating } from "@/components/StarRating";

/**
 * Quiet reviews panel shown beside the list on wide screens, for a featured partner that has a verified Google
 * rating. It shows the rating and count and links out to Google. Quotes appear only when the business has
 * given us testimonials to publish (Professional.testimonials), never copied from Google.
 */
export function PartnerReviewsPanel({ professional: p }: { professional: Professional }) {
  const rating = parseRating(p.ratingLabel);
  if (!rating || !p.reviewsUrl) return null;
  const first = p.contactName ?? p.name;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">Reviews of {first}</p>
      <div className="mt-2 flex items-center gap-3">
        <span className="text-4xl font-bold tracking-tight">{rating.value}</span>
        <div>
          <StarRating value={Number(rating.value)} size={18} />
          <p className="text-sm text-foreground/60 mt-0.5">{rating.count} Google reviews</p>
        </div>
      </div>

      {p.testimonials && p.testimonials.length > 0 && (
        <div className="mt-4 flex flex-col gap-2.5">
          {p.testimonials.slice(0, 3).map((t) => (
            <figure key={t.name} className="rounded-xl bg-surface-muted border border-border p-3">
              <blockquote className="text-sm text-foreground/70 leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-1.5 text-xs font-semibold text-foreground/60">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      )}

      <a
        href={p.reviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
      >
        Read the reviews on Google
        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
      </a>
    </div>
  );
}
