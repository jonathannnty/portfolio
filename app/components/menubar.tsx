"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { Mail, Menu, X } from "lucide-react";
import { animate, stagger } from "animejs";
import { site } from "@/content/site";
import { GithubIcon, LinkedinIcon } from "./brand-icons";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const isActive = (pathname: string, path: string) => {
  if (path === "/") return pathname === path;
  return pathname.startsWith(path);
};

export default function MainMenuBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nameRef = useRef<HTMLSpanElement>(null);
  const animating = useRef(false);

  const handleNameClick = () => {
    if (animating.current || !nameRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = nameRef.current.querySelectorAll<HTMLElement>(".name-char");
    if (!chars.length) return;
    animating.current = true;
    animate(chars, {
      translateY:  [0, -10, 0],
      duration:    500,
      delay:       stagger(55),
      ease:        "outBack",
      onComplete:  () => { animating.current = false; },
    });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[color:var(--color-border)] bg-[color:var(--color-bg)]/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          onClick={() => { setMobileOpen(false); handleNameClick(); }}
          className="text-2xl font-bold tracking-tight text-[color:var(--color-fg)]"
        >
          <span ref={nameRef} className="inline-flex">
            {site.name.split("").map((char, i) => (
              <span
                key={i}
                className="name-char inline-block"
                style={{ whiteSpace: char === " " ? "pre" : undefined }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span className="text-[color:var(--color-primary-600)]">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = isActive(pathname, link.path);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative text-lg transition-colors ${
                  active
                    ? "font-semibold text-[color:var(--color-primary-700)]"
                    : "text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-primary-600)]"
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-[color:var(--color-primary-600)]" />
                )}
              </Link>
            );
          })}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[color:var(--color-primary-400)] px-3 py-1.5 text-sm font-medium text-[color:var(--color-primary-700)] transition-colors hover:bg-[color:var(--color-primary-50)]"
          >
            Resume
          </a>

          <div className="flex items-center gap-4 border-l border-[color:var(--color-border)] pl-6">
            <a
              href={site.socials.github.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[color:var(--color-fg-muted)] transition-colors hover:text-[color:var(--color-primary-600)]"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href={site.socials.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[color:var(--color-fg-muted)] transition-colors hover:text-[color:var(--color-primary-600)]"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a
              href={site.socials.email.href}
              aria-label="Email"
              className="text-[color:var(--color-fg-muted)] transition-colors hover:text-[color:var(--color-primary-600)]"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[color:var(--color-border)] text-[color:var(--color-fg)] md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-bg)] md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((link) => {
              const active = isActive(pathname, link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-2 text-base transition-colors ${
                    active
                      ? "bg-[color:var(--color-primary-50)] font-semibold text-[color:var(--color-primary-700)]"
                      : "text-[color:var(--color-fg)] hover:bg-[color:var(--color-surface-muted)]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-base font-medium text-[color:var(--color-primary-700)] hover:bg-[color:var(--color-primary-50)] transition-colors"
            >
              Resume
            </a>
            <div className="mt-3 flex items-center gap-5 border-t border-[color:var(--color-border)] pt-4">
              <a href={site.socials.github.href} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubIcon className="h-5 w-5 text-[color:var(--color-fg-muted)]" />
              </a>
              <a href={site.socials.linkedin.href} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinIcon className="h-5 w-5 text-[color:var(--color-fg-muted)]" />
              </a>
              <a href={site.socials.email.href} aria-label="Email">
                <Mail className="h-5 w-5 text-[color:var(--color-fg-muted)]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}