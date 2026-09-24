import Link from "next/link";

export function Breadcrumbs({ items, light = false }: { items: { name: string; href?: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs ${light ? "text-white/60" : "text-foreground/50"}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className={light ? "hover:text-white hover:underline" : "hover:text-brand hover:underline"}>
                {item.name}
              </Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
