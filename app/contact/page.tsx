import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import Section from "../components/section";
import ContactForm from "../components/contact-form";
import {
  GithubIcon,
  LinkedinIcon,
  SpotifyIcon,
  StravaIcon,
} from "../components/brand-icons";
import ContactIllustration from "../components/illustrations/contact-illustration";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <Section
      eyebrow="Contact"
      title="Let's talk."
      subtitle="Have a project, a question, or just want to say hi? Drop me a note and I'll get back to you."
      illustration={<ContactIllustration />}
    >
      <div className="mb-10 flex justify-center lg:hidden">
        <ContactIllustration />
      </div>
      <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,1.2fr)]">
        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-base font-semibold text-[color:var(--color-fg)]">
              Other ways to reach me
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3 text-[color:var(--color-fg-muted)]">
                <Mail className="h-4 w-4 text-[color:var(--color-primary-600)]" />
                <a
                  href={site.socials.email.href}
                  className="hover:text-[color:var(--color-primary-700)]"
                >
                  {site.socials.email.handle}
                </a>
              </li>
              <li className="flex items-center gap-3 text-[color:var(--color-fg-muted)]">
                <GithubIcon className="h-4 w-4 text-[color:var(--color-primary-600)]" />
                <a
                  href={site.socials.github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[color:var(--color-primary-700)]"
                >
                  {site.socials.github.handle}
                </a>
              </li>
              <li className="flex items-center gap-3 text-[color:var(--color-fg-muted)]">
                <LinkedinIcon className="h-4 w-4 text-[color:var(--color-primary-600)]" />
                <a
                  href={site.socials.linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[color:var(--color-primary-700)]"
                >
                  {site.socials.linkedin.handle}
                </a>
              </li>
              <li className="flex items-center gap-3 text-[color:var(--color-fg-muted)]">
                <StravaIcon className="h-4 w-4 text-[color:var(--color-primary-600)]" />
                <a
                  href={site.socials.strava.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[color:var(--color-primary-700)]"
                >
                  {site.socials.strava.handle}
                </a>
              </li>
              <li className="flex items-center gap-3 text-[color:var(--color-fg-muted)]">
                <SpotifyIcon className="h-4 w-4 text-[color:var(--color-primary-600)]" />
                <a
                  href={site.socials.spotify.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[color:var(--color-primary-700)]"
                >
                  {site.socials.spotify.handle}
                </a>
              </li>
              <li className="flex items-center gap-3 text-[color:var(--color-fg-muted)]">
                <MapPin className="h-4 w-4 text-[color:var(--color-primary-600)]" />
                <span>{site.location}</span>
              </li>
            </ul>
          </div>
          <p className="text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
            I read everything that comes in. Expect a reply within a few days.
          </p>
        </aside>

        <div className="card p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
