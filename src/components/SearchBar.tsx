"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { areas, visibleCategories } from "@/lib/data";
import type { AreaSlug, CategorySlug } from "@/lib/types";

export function SearchBar() {
  const router = useRouter();
  const [categorySlug, setCategorySlug] = useState<CategorySlug>(visibleCategories[0].slug);
  const [areaSlug, setAreaSlug] = useState<AreaSlug>(areas[0].slug);

  function handleSearch() {
    router.push(`/${areaSlug}/${categorySlug}`);
  }

  return (
    <div className="rounded-2xl sm:rounded-full bg-surface shadow-soft-lg border border-border p-2 flex flex-col sm:flex-row gap-1 sm:gap-0 sm:items-center">
      <label className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl sm:rounded-full hover:bg-surface-muted transition-colors">
        <Search className="h-[18px] w-[18px] text-foreground/40 shrink-0" strokeWidth={2} />
        <select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value as CategorySlug)}
          className="w-full bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
        >
          {visibleCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.pluralName}
            </option>
          ))}
        </select>
      </label>
      <div className="hidden sm:block w-px h-6 bg-border shrink-0" />
      <label className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl sm:rounded-full hover:bg-surface-muted transition-colors">
        <MapPin className="h-[18px] w-[18px] text-foreground/40 shrink-0" strokeWidth={2} />
        <select
          value={areaSlug}
          onChange={(e) => setAreaSlug(e.target.value as AreaSlug)}
          className="w-full bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
        >
          {areas.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={handleSearch}
        className="flex items-center justify-center gap-1.5 rounded-xl sm:rounded-full bg-foreground text-white text-sm font-semibold px-6 py-3.5 sm:py-3 hover:bg-brand-dark transition-colors shrink-0"
      >
        Search
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
