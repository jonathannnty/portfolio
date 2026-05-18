import type { Metadata } from "next";
import { Suspense } from "react";
import Section from "../components/section";
import BlogCard from "../components/blog-card";
import RevealProvider from "../components/reveal-provider";
import BlogIllustration from "../components/illustrations/blog-illustration";
import ActivityStrip from "../components/activity/activity-strip";
import { posts } from "@/content/blog";
import { site } from "@/content/site";
import { getSpotifyData } from "@/lib/activity/spotify";
import { getGitHubData } from "@/lib/activity/github";

export const metadata: Metadata = {
  title: "Blog",
  description: "Occasional writing on things I'm building, reading, or thinking about.",
  openGraph: {
    title: `Blog — ${site.name}`,
    description: "Occasional writing on things I'm building, reading, or thinking about.",
    url: "/blog",
  },
};

async function ActivityData() {
  const [spotify, github] = await Promise.all([getSpotifyData(), getGitHubData()]);
  return <ActivityStrip spotify={spotify} github={github} />;
}

function ActivitySkeleton() {
  return <div className="h-28 mb-8" aria-hidden="true" />;
}

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
        titleAs="h1"
      >
        <Suspense fallback={<ActivitySkeleton />}>
          <ActivityData />
        </Suspense>

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
