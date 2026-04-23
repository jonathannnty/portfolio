import type { Metadata } from "next";
import Image from "next/image";
import Section from "../components/section";
import Timeline from "../components/timeline";
import CourseworkGrid from "../components/coursework-grid";
import AwardsGrid from "../components/awards-grid";
import ResumeViewer from "../components/resume-viewer";
import RevealProvider from "../components/reveal-provider";
import AboutIllustration from "../components/illustrations/about-illustration";
import ExperienceIllustration from "../components/illustrations/experience-illustration";
import CourseworkIllustration from "../components/illustrations/coursework-illustration";
import AwardsIllustration from "../components/illustrations/awards-illustration";
import { site } from "@/content/site";
import { experiences } from "@/content/experiences";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} — experience, coursework, and awards.`,
};

export default function AboutPage() {
  const sortedExperiences = [...experiences].sort((a, b) =>
    b.sortKey.localeCompare(a.sortKey),
  );

  return (
    <>
      <RevealProvider />

      <Section
        eyebrow="Who am I?"
        title={`Hello there, I'm ${site.name.split(" ")[0]}.`}
        illustration={<AboutIllustration />}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="space-y-8">
            <div className="max-w-2xl space-y-5">
              {site.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-[color:var(--color-fg-muted)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className= "mx-auto w-full rounded-[1.9rem] bg-gradient-to-br from-[color:var(--color-primary-200)] via-[color:var(--color-surface)] to-[color:var(--color-primary-300)] p-[1.5px] shadow-[var(--shadow-md)] lg:mx-0">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-[1.85rem] bg-[color:var(--color-surface)]">
              <Image
                src="/images/headshot.jpeg"
                alt={`${site.name} headshot`}
                fill
                priority
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 280px, 80vw"
                className="object-cover object-center"
              />
            </figure>
          </div>
        </div>
        <ResumeViewer />
      </Section>

      <Section
        id="experience"
        eyebrow="Working Experience"
        title="Here's a chronological timeline of all my roles I've done!"
        subtitle="Click any node to see what I worked on, the stack, and a few highlights."
        illustration={<ExperienceIllustration />}
        tight
      >
        <Timeline items={sortedExperiences} />
      </Section>

      <Section
        id="coursework"
        eyebrow="Coursework I've done"
        title="What have I studied at UC San Diego?"
        illustration={<CourseworkIllustration />}
        tight
      >
        <CourseworkGrid />
      </Section>

      <Section
        id="awards"
        eyebrow="Awards & honors"
        title="Recognitions."
        illustration={<AwardsIllustration />}
        tight
      >
        <AwardsGrid />
      </Section>
    </>
  );
}
