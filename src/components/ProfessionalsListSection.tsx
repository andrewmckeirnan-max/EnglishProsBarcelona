"use client";

import Link from "next/link";
import { LockOpen } from "lucide-react";
import { ProfessionalCard, LockedProfessionalCard } from "@/components/ProfessionalCard";
import { ProfessionalsMap } from "@/components/ProfessionalsMap";
import { useUnlock } from "@/components/UnlockContext";
import { FREE_PREVIEW_LIMIT } from "@/lib/constants";
import type { Area, Professional } from "@/lib/types";

interface Props {
  professionals: Professional[];
  area: Area;
}

// The single, authoritative place professionals are shown on a category
// page. Reads the shared unlock state (see UnlockContext) so submitting
// the lead form above flips this section from locked-preview straight to
// fully open, in place, instead of leaving stale locked cards behind
// while a separate copy of the list appears inside the form itself.
export function ProfessionalsListSection({ professionals, area }: Props) {
  const { unlocked } = useUnlock();
  const visibleProfessionals = unlocked ? professionals : professionals.slice(0, FREE_PREVIEW_LIMIT);
  const lockedCount = unlocked ? 0 : Math.max(professionals.length - FREE_PREVIEW_LIMIT, 0);
  const partnerCount = professionals.filter((p) => p.partnerTier).length;

  return (
    <>
      <p className="text-sm text-foreground/60 mb-6 flex items-center gap-1.5">
        {unlocked && <LockOpen className="h-4 w-4 text-brand shrink-0" strokeWidth={2} />}
        {unlocked
          ? "Unlocked, here's the full ranked list."
          : lockedCount > 0
            ? `Showing ${visibleProfessionals.length} of ${professionals.length}. Tell us what you need to unlock the full ranked list.`
            : partnerCount > 0
              ? partnerCount === 1
                ? "Our recommended partner, plus other English-speaking options we found nearby."
                : "Our recommended partners, plus other English-speaking options we found nearby."
              : "English-speaking options we found nearby. None of these are paying partners yet, this is an independent, informational list."}
      </p>
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-start">
        <div className="flex flex-col gap-4">
          {visibleProfessionals.map((p, i) => (
            <ProfessionalCard key={p.id} professional={p} rank={i + 1} />
          ))}
          {Array.from({ length: lockedCount }).map((_, i) => (
            <LockedProfessionalCard key={`locked-${i}`} />
          ))}
        </div>
        <div className="hidden lg:block h-[520px] sticky top-24">
          <ProfessionalsMap professionals={professionals} area={area} />
        </div>
      </div>
      <p className="text-xs text-foreground/40 mt-4">
        <Link href="/about#how-we-verify" className="underline hover:text-foreground/60">
          How we verify listings
        </Link>
      </p>
    </>
  );
}
