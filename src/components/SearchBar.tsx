"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { areas, categories } from "@/lib/data";
import type { AreaSlug, CategorySlug } from "@/lib/types";

export function SearchBar() {
  const router = useRouter();
  const [categorySlug, setCategorySlug] = useState<CategorySlug>(categories[0].slug);
  const [areaSlug, setAreaSlug] = useState<AreaSlug>(areas[0].slug);

  function handleSearch() {
    router.push(`/${areaSlug}/${categorySlug}`);
  }

  return (
    <div className="rounded-2xl sm:rounded-full bg-surface shadow-xl border border-border p-2 flex flex-col sm:flex-row gap-2">
      <label className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-full hover:bg-surface-muted">
        <span className="text-lg">🔎</span>
        <select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value as CategorySlug)}
          className="w-full bg-transparent text-sm font-medium focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.pluralName}
            </option>
          ))}
        </select>
      </label>
      <div className="hidden sm:block w-px bg-border my-2" />
      <label className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-full hover:bg-surface-muted">
        <span className="text-lg">📍</span>
        <select
          value={areaSlug}
          onChange={(e) => setAreaSlug(e.target.value as AreaSlug)}
          className="w-full bg-transparent text-sm font-medium focus:outline-none"
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
        className="rounded-xl sm:rounded-full bg-brand text-white font-semibold px-6 py-3 hover:bg-brand-dark transition shrink-0"
      >
        Search
      </button>
    </div>
  );
}
