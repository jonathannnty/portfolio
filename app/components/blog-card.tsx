import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/content/blog";
import { formatBlogDate } from "@/lib/date";

function formatDate(iso: string) {
  return formatBlogDate(iso);
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card group flex flex-col p-6">
      <div className="flex items-center justify-between text-xs text-[color:var(--color-fg-subtle)]">
        <time dateTime={post.date} className="font-mono">
          {formatDate(post.date)}
        </time>
        <span>{post.readingTime}</span>
      </div>

      <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-[color:var(--color-fg)]">
        {post.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
        {post.excerpt}
      </p>

      {post.tag && <span className="chip mt-4 self-start">{post.tag}</span>}

      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-primary-700)]">
        Read post
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}
