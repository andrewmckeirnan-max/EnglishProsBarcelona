import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Barcelona Expat Guides",
  description:
    "Practical, honestly-written guides for English speakers living in or moving to Barcelona: neighbourhoods, paperwork, healthcare and more.",
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="container-page py-14 sm:py-20">
      <p className="text-sm font-semibold text-brand mb-2">Guides</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance max-w-2xl">
        Practical guides for English speakers in Barcelona
      </h1>
      <p className="mt-4 text-foreground/70 max-w-xl">
        No listicle filler, just straight answers to the questions we get asked most, written
        by the same people who verify every professional on this site.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-5">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-2xl border border-border bg-surface p-6 hover:shadow-soft hover:border-brand/20 transition-all flex flex-col"
          >
            <p className="text-xs text-foreground/50">
              {new Date(post.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              {" · "}
              {post.readingMinutes} min read
            </p>
            <h2 className="text-lg font-bold tracking-tight mt-2">{post.title}</h2>
            <p className="text-sm text-foreground/60 mt-2 leading-relaxed flex-1">{post.excerpt}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand mt-4">
              Read guide
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
