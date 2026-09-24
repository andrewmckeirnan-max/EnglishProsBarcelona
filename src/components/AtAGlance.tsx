import type { Area, Professional } from "@/lib/types";
import { areaAliases, humanList } from "@/lib/seoTerms";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Lowercase the first letter for mid-sentence use, but leave acronyms and things like "3D" alone.
const lowerFirst = (s: string) => (/^[A-Z0-9]{2,}/.test(s) || /^[0-9]/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));

function topCounts(values: string[], limit: number) {
  const map = new Map<string, number>();
  for (const v of values) map.set(v.trim(), (map.get(v.trim()) ?? 0) + 1);
  return [...map.entries()].filter(([k]) => k).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit);
}

/**
 * Plain-HTML facts computed from the real listings on the page: how many
 * professionals, which languages they cover, what they specialise in and how
 * many are based locally. Unique to each page, fully extractable (no client
 * JS, no images), and never invented: every figure is counted from our data.
 */
export function AtAGlance({
  professionals,
  categoryName,
  categoryPluralName,
  area,
}: {
  professionals: Professional[];
  categoryName: string;
  categoryPluralName: string;
  area?: Area;
}) {
  const n = professionals.length;
  if (n === 0) return null;
  const where = area ? area.name : "Barcelona";
  const noun = (n === 1 ? categoryName : categoryPluralName).toLowerCase();
  const languages = topCounts(professionals.flatMap((p) => Array.from(new Set(p.languages))), 6);
  const specialties = topCounts(professionals.flatMap((p) => p.specialties), 5);

  let localLine = "";
  if (area) {
    const names = [area.name, ...areaAliases[area.slug]].map(norm);
    const local = professionals.filter((p) => names.some((a) => norm(p.addressArea).includes(a))).length;
    localLine =
      local === n
        ? `All ${n} are based in ${area.name}.`
        : local === 0
          ? `None are based in ${area.name} itself: they serve ${area.name} from elsewhere in Barcelona.`
          : `${local} ${local === 1 ? "is" : "are"} based in ${area.name} and ${n - local} serve it from elsewhere in Barcelona.`;
  }

  return (
    <div className="rounded-2xl border border-border bg-surface-muted p-5 sm:p-6 mb-8">
      <h3 className="font-semibold">At a glance</h3>
      <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
        We have verified {n} English-speaking {noun} in {where}. {localLine}{" "}
        {specialties.length > 0 && <>Specialties covered include {humanList(specialties.map(([s]) => lowerFirst(s)))}.</>}
      </p>
      {languages.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="text-sm w-full max-w-md">
            <caption className="text-left text-xs font-semibold uppercase tracking-wide text-foreground/50 pb-2">
              Languages spoken by the {n} listed {noun}
            </caption>
            <thead>
              <tr className="text-left text-foreground/50">
                <th className="font-medium py-1 pr-6">Language</th>
                <th className="font-medium py-1">Professionals</th>
              </tr>
            </thead>
            <tbody>
              {languages.map(([lang, count]) => (
                <tr key={lang} className="border-t border-border">
                  <td className="py-1.5 pr-6">{lang}</td>
                  <td className="py-1.5">
                    {count} of {n}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
