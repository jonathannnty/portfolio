import Link from "next/link";
import { site } from "@/content/site";
import { getCurrentUTCYear } from "@/lib/date";
import BackToTopButton from "./back-to-top";

export default function SiteFooter() {
  return (
    <footer className="brushed-t mt-24 bg-[color:var(--color-surface-muted)]">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-2xl font-bold text-[color:var(--color-fg)]">
            {site.name}
            <span className="text-[color:var(--color-primary-600)]">.</span>
          </p>
          <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
            {site.location}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-display text-sm text-[color:var(--color-fg-muted)]">
          <Link
            href="/about"
            className="transition-colors duration-150 hover:text-[color:var(--color-primary-700)]"
          >
            About
          </Link>
          <Link
            href="/projects"
            className="transition-colors duration-150 hover:text-[color:var(--color-primary-700)]"
          >
            Projects
          </Link>
          <Link
            href="/blog"
            className="transition-colors duration-150 hover:text-[color:var(--color-primary-700)]"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="transition-colors duration-150 hover:text-[color:var(--color-primary-700)]"
          >
            Contact
          </Link>
          <a
            href={site.socials.github.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-[color:var(--color-primary-700)]"
          >
            GitHub
          </a>
          <a
            href={site.socials.linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-150 hover:text-[color:var(--color-primary-700)]"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <div className="brushed-t">
        <div className="container-page flex items-center justify-between py-4 text-xs text-[color:var(--color-fg-subtle)]">
          <span>© {getCurrentUTCYear()} {site.name}. Built with Next.js, Tailwind, and anime.js.</span>
          <BackToTopButton />
        </div>
      </div>
    </footer>
  );
}
