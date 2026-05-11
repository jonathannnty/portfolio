"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Heading } from "@/lib/toc";

export type { Heading };

export function useTOCActiveId(ids: string[]): string {
  const [activeId, setActiveId] = useState(ids[0] ?? "");
  const idsKey = ids.join(",");

  useEffect(() => {
    if (!idsKey) return;
    setActiveId(ids[0] ?? "");

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );

    idsKey.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [idsKey]);

  return activeId;
}

export function ProjectTOCDesktop({ headings }: { headings: Heading[] }) {
  const activeId = useTOCActiveId(headings.map((h) => h.id));

  const handleClick = (id: string) => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    });
  };

  return (
    <nav aria-label="On this page">
      <p className="eyebrow mb-3">On this page</p>
      <ul className="flex flex-col gap-0.5">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(h.id);
              }}
              className={[
                "block border-l-2 pl-3 py-0.5 text-sm leading-relaxed transition-colors duration-150",
                activeId === h.id
                  ? "border-[color:var(--color-primary-500)] text-[color:var(--color-primary-700)] font-medium"
                  : "border-transparent text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] hover:border-[color:var(--color-border-strong)]",
              ].join(" ")}
            >
              {h.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ProjectTOCMobile({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false);
  const activeId = useTOCActiveId(headings.map((h) => h.id));

  const handleClick = (id: string) => {
    setOpen(false);
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start",
    });
  };

  return (
    <div className="xl:hidden mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-md bg-[color:var(--color-primary-50)] px-3 py-2 text-sm font-medium text-[color:var(--color-primary-700)]"
      >
        <span>On this page</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="mt-2 border-t border-[color:var(--color-border)] pt-2 flex flex-col gap-0.5">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(h.id);
                }}
                className={[
                  "block border-l-2 pl-3 py-0.5 text-sm leading-relaxed transition-colors duration-150",
                  activeId === h.id
                    ? "border-[color:var(--color-primary-500)] text-[color:var(--color-primary-700)] font-medium"
                    : "border-transparent text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] hover:border-[color:var(--color-border-strong)]",
                ].join(" ")}
              >
                {h.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
