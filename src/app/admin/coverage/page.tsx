import { areas, categories } from "@/lib/data";
import { professionals } from "@/lib/professionals";

// Live coverage tracker: always reflects the real current state of
// professionals.ts, nothing here is a manually-typed snapshot. Same
// query-param gate pattern as /admin/leads.
export default async function CoveragePage(props: PageProps<"/admin/coverage">) {
  const searchParams = await props.searchParams;
  const secret = process.env.ADMIN_SECRET;
  const provided = typeof searchParams.key === "string" ? searchParams.key : undefined;

  if (secret && provided !== secret) {
    return (
      <div className="container-page py-16 max-w-md mx-auto text-center">
        <h1 className="text-xl font-semibold mb-2">Restricted</h1>
        <p className="text-sm text-foreground/60">
          Add <code>?key=YOUR_ADMIN_SECRET</code> to the URL to view coverage.
        </p>
      </div>
    );
  }

  const visibleCats = categories.filter((c) => !c.hidden);

  const counts: Record<string, number> = {};
  for (const p of professionals) {
    const key = `${p.areaSlug}/${p.categorySlug}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const TARGET = 5;
  let zero = 0,
    partial = 0,
    met = 0;
  for (const a of areas) {
    for (const c of visibleCats) {
      const n = counts[`${a.slug}/${c.slug}`] ?? 0;
      if (n === 0) zero++;
      else if (n < TARGET) partial++;
      else met++;
    }
  }
  const totalCombos = areas.length * visibleCats.length;

  function cellClass(n: number) {
    if (n === 0) return "bg-red-50 text-red-700";
    if (n < TARGET) return "bg-amber-50 text-amber-700";
    return "bg-green-50 text-green-700";
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold mb-1">Listing coverage tracker</h1>
      <p className="text-sm text-foreground/60 mb-6">
        Live from professionals.ts — {professionals.length} real listings across {totalCombos} area × category
        combinations. Target: {TARGET} per combination.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-8 max-w-lg">
        <div className="rounded-xl border border-border bg-red-50 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{zero}</p>
          <p className="text-xs text-red-700/70">Empty (0)</p>
        </div>
        <div className="rounded-xl border border-border bg-amber-50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{partial}</p>
          <p className="text-xs text-amber-700/70">Partial (1-4)</p>
        </div>
        <div className="rounded-xl border border-border bg-green-50 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{met}</p>
          <p className="text-xs text-green-700/70">Target met (5+)</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-xs">
          <thead className="bg-surface-muted">
            <tr>
              <th className="px-3 py-2 text-left sticky left-0 bg-surface-muted">Category</th>
              {areas.map((a) => (
                <th key={a.slug} className="px-3 py-2 text-center whitespace-nowrap">
                  {a.name}
                </th>
              ))}
              <th className="px-3 py-2 text-center font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleCats.map((c) => {
              const rowTotal = areas.reduce((sum, a) => sum + (counts[`${a.slug}/${c.slug}`] ?? 0), 0);
              return (
                <tr key={c.slug}>
                  <td className="px-3 py-2 whitespace-nowrap sticky left-0 bg-surface font-medium">
                    {c.icon} {c.name}
                  </td>
                  {areas.map((a) => {
                    const n = counts[`${a.slug}/${c.slug}`] ?? 0;
                    return (
                      <td key={a.slug} className={`px-3 py-2 text-center font-semibold ${cellClass(n)}`}>
                        {n}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-center font-semibold">{rowTotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
