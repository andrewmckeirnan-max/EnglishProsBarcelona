import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getAllBlogPosts, getBlogPost } from "@/lib/blog";
import { getArea, getCategory } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BlogBody } from "@/components/BlogBody";
import { breadcrumbSchema, blogPostingSchema } from "@/lib/schema";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedCategories = (post.relatedCategorySlugs ?? [])
    .map((slug) => getCategory(slug))
    .filter((c) => c && !c.hidden);
  const relatedAreas = (post.relatedAreaSlugs ?? []).map((slug) => getArea(slug)).filter(Boolean);

  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Guides", url: "/blog" },
      { name: post.title, url: `/blog/${post.slug}` },
    ]),
    blogPostingSchema(post),
  ];

  return (
    <div>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <article className="container-page py-10 sm:py-16 max-w-2xl">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Guides", href: "/blog" },
            { name: post.title },
          ]}
        />

        <p className="text-xs text-foreground/50 mt-5">
          {new Date(post.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          {" · "}
          {post.readingMinutes} min read
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance mt-2">{post.title}</h1>
        <p className="mt-4 text-lg text-foreground/70">{post.description}</p>

        <div className="mt-8">
          <BlogBody blocks={post.content} />
        </div>

        {(relatedCategories.length > 0 || relatedAreas.length > 0) && (
          <div className="mt-12 rounded-2xl border border-border bg-surface-muted p-6">
            <p className="font-semibold text-sm mb-3">Verified in this guide</p>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.map((c) =>
                c ? (
                  <Link
                    key={c.slug}
                    href={`/eixample/${c.slug}`}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm hover:border-brand hover:bg-brand-light transition-all"
                  >
                    {c.icon} {c.pluralName}
                  </Link>
                ) : null
              )}
              {relatedAreas.map((a) =>
                a ? (
                  <Link
                    key={a.slug}
                    href={`/${a.slug}`}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm hover:border-brand hover:bg-brand-light transition-all"
                  >
                    {a.name}
                  </Link>
                ) : null
              )}
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2">Sources consulted</p>
          <ul className="flex flex-col gap-1.5">
            {post.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-brand"
                >
                  {s.name}
                  <ExternalLink className="h-3 w-3" strokeWidth={2} />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-foreground/40 mt-3">
            Facts are paraphrased and cross-checked, not lifted from these sources verbatim. This
            page is informational, not legal, tax or medical advice.
          </p>
        </div>
      </article>
    </div>
  );
}
