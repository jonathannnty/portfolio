import type { Metadata } from "next";
import Section from "../components/section";
import BlogCard from "../components/blog-card";
import RevealProvider from "../components/reveal-provider";
import BlogIllustration from "../components/illustrations/blog-illustration";
import { posts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Occasional writing on things I'm building, reading, or thinking about.",
};

export default function BlogIndexPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <RevealProvider />
      <Section
        eyebrow="Blog"
        title="Notes & writing."
        subtitle="Occasional posts here and there. No schedule, it's just whenever I feel like writing."
        illustration={<BlogIllustration />}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {sorted.map((p) => (
            <div key={p.slug} className="reveal">
              <BlogCard post={p} />
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
