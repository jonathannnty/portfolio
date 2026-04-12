import Link from "next/link";
import { site } from "@/content/site";
import { getCurrentUTCYear } from "@/lib/date";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-base font-semibold text-[color:var(--color-fg)]">
            {site.name}
            <span className="text-[color:var(--color-primary-600)]">.</span>
          </p>
          <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
            {site.location}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[color:var(--color-fg-muted)]">
          <Link
            href="/about"
            className="hover:text-[color:var(--color-primary-700)]"
          >
            About
          </Link>
          <Link
            href="/projects"
            className="hover:text-[color:var(--color-primary-700)]"
          >
            Projects
          </Link>
          <Link
            href="/blog"
            className="hover:text-[color:var(--color-primary-700)]"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="hover:text-[color:var(--color-primary-700)]"
          >
            Contact
          </Link>
          <a
            href={site.socials.github.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[color:var(--color-primary-700)]"
          >
            GitHub
          </a>
          <a
            href={site.socials.linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[color:var(--color-primary-700)]"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <div className="border-t border-[color:var(--color-border)]">
        <div className="container-page py-4 text-xs text-[color:var(--color-fg-subtle)]">
          © {getCurrentUTCYear()} {site.name}. Built with Next.js, Tailwind, and
          anime.js.
        </div>
      </div>
    </footer>
  );
}
