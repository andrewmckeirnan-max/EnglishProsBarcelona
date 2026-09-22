import Link from "next/link";
import type { BlogBlock } from "@/lib/blog";
import { areas } from "@/lib/data";

function Segments({ segments }: { segments: { text: string; href?: string }[] }) {
  return (
    <>
      {segments.map((s, i) =>
        s.href ? (
          <Link key={i} href={s.href} className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
            {s.text}
          </Link>
        ) : (
          <span key={i}>{s.text}</span>
        )
      )}
    </>
  );
}

export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} className="text-xl sm:text-2xl font-bold tracking-tight mt-6">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="text-lg font-semibold mt-2">
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc pl-5 flex flex-col gap-1.5 text-foreground/80 leading-relaxed">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "find-cta":
            // Always generated from the live area list, never hardcoded,
            // so this reads correctly forever as areas get added.
            return (
              <p key={i} className="text-foreground/80 leading-relaxed">
                {block.lead}{" "}
                {areas.map((a, j) => (
                  <span key={a.slug}>
                    <Link href={`/${a.slug}/${block.categorySlug}`} className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand">
                      {a.name}
                    </Link>
                    {j < areas.length - 2 ? ", " : j === areas.length - 2 ? " and " : ""}
                  </span>
                ))}
                .
              </p>
            );
          case "p":
          default:
            return (
              <p key={i} className="text-foreground/80 leading-relaxed">
                <Segments segments={block.segments} />
              </p>
            );
        }
      })}
    </div>
  );
}
