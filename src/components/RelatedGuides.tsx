import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

export function RelatedGuides({ posts, heading = "Related guides" }: { posts: BlogPost[]; heading?: string }) {
  if (posts.length === 0) return null;
  return (
    <section className="container-page py-12 sm:py-16">
      <h2 className="text-2xl font-bold tracking-tight mb-6">{heading}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="rounded-2xl border border-border bg-surface p-5 hover:shadow-soft hover:border-brand/20 transition-all flex flex-col"
          >
            <p className="font-semibold leading-snug">{p.title}</p>
            <p className="text-sm text-foreground/60 mt-2 flex-1">{p.excerpt}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand mt-3">
              Read the guide <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
