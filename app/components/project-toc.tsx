"use client";

import { useEffect, useState } from "react";
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
