import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { posts, getPostBySlug } from "@/content/blog";
import { formatLongDate } from "@/lib/date";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(iso: string) {
  return formatLongDate(iso);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container-page pt-20 pb-24 md:pt-28">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-primary-700)]"
      >
        <ArrowLeft className="h-4 w-4" />
        All posts
      </Link>

      <header className="mt-8 max-w-3xl">
        <div className="flex items-center gap-3 text-sm text-[color:var(--color-fg-subtle)]">
          <time dateTime={post.date} className="font-mono">
            {formatDate(post.date)}
          </time>
          <span>·</span>
          <span>{post.readingTime}</span>
          {post.tag && (
            <>
              <span>·</span>
              <span className="chip">{post.tag}</span>
            </>
          )}
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[color:var(--color-fg)] sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-fg-muted)]">
          {post.excerpt}
        </p>
      </header>

      <div className="mt-12 max-w-3xl">{post.body}</div>
    </article>
  );
}
