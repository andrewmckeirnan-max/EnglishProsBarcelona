import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getAllBlogPosts, getBlogPost } from "@/lib/blog";
import { RelatedGuides } from "@/components/RelatedGuides";
import { getCategory } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BlogBody } from "@/components/BlogBody";
import { breadcrumbSchema, blogPostingSchema, faqSchema } from "@/lib/schema";
import { clipDescription, fitTitle, ogFor, titleMeta } from "@/lib/site";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: titleMeta(fitTitle(post.title)),
    description: clipDescription(post.description),
    openGraph: { ...ogFor(fitTitle(post.title), clipDescription(post.description), `/blog/${post.slug}`), type: "article" as const, publishedTime: post.publishedDate },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedCategories = (post.relatedCategorySlugs ?? [])
    .map((slug) => getCategory(slug))
    .filter((c) => c && !c.hidden);

  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Guides", url: "/blog" },
      { name: post.title, url: `/blog/${post.slug}` },
    ]),
    blogPostingSchema(post),
    ...(post.faqs && post.faqs.length > 0 ? [faqSchema(post.faqs.map((f) => ({ question: f.q, answer: f.a })))] : []),
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

        {post.tldr && (
          <div className="mt-6 rounded-2xl border border-brand/20 bg-brand-light p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-brand mb-1">The short answer</p>
            <p className="text-foreground/80">{post.tldr}</p>
          </div>
        )}

        <div className="mt-8">
          <BlogBody blocks={post.content} />
        </div>

        {post.faqs && post.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold tracking-tight mb-4">Common questions</h2>
            <div className="flex flex-col gap-4">
              {post.faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-border bg-surface p-5">
                  <h3 className="font-semibold">{f.q}</h3>
                  <p className="mt-1.5 text-foreground/70">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedCategories.length > 0 && (
          <div className="mt-12 rounded-2xl border border-border bg-surface-muted p-6">
            <p className="font-semibold text-sm mb-3">Related</p>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.map((c) =>
                c ? (
                  <Link
                    key={c.slug}
                    href={`/barcelona/${c.slug}`}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm hover:border-brand hover:bg-brand-light transition-all"
                  >
                    {c.icon} {c.pluralName}
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

      <RelatedGuides
        heading="More guides"
        posts={getAllBlogPosts()
          .filter((p) => p.slug !== post.slug)
          .sort((a, b) => Number(b.relatedCategorySlugs?.some((c) => post.relatedCategorySlugs?.includes(c)) ?? 0) - Number(a.relatedCategorySlugs?.some((c) => post.relatedCategorySlugs?.includes(c)) ?? 0))
          .slice(0, 3)}
      />
    </div>
  );
}
