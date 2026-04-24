"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Experience } from "@/content/experiences";

type Props = {
  experience: Experience;
  onClose: () => void;
};

export default function ExperienceModal({ experience, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flyover-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-lg)]">
        <div className="relative p-6 sm:p-8">
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-surface-muted)] text-lg text-[color:var(--color-fg)] transition-colors hover:bg-[color:var(--color-surface-raised)]"
          >
            ×
          </button>

          <div className="text-xs uppercase tracking-wider text-[color:var(--color-fg-muted)]">
            {experience.period}
          </div>
          <h3
            id="flyover-modal-title"
            className="mt-1 pr-10 text-2xl font-bold tracking-tight text-[color:var(--color-fg)]"
          >
            {experience.role}
          </h3>
          <div className="text-base text-[color:var(--color-fg-muted)]">
            {experience.company}
            {experience.location ? ` · ${experience.location}` : ""}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
            {experience.summary}
          </p>

          {experience.highlights.length > 0 && (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--color-fg-muted)] marker:text-[color:var(--color-primary-500)]">
              {experience.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}

          {experience.stack && experience.stack.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {experience.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-[color:var(--color-primary-100)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-primary-700)]"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {experience.images && experience.images.length > 0 && (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {experience.images.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[color:var(--color-border)]"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 320px, 100vw"
                  />
                </div>
              ))}
            </div>
          )}

          {experience.link && (
            <a
              href={experience.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-primary-600)] underline hover:text-[color:var(--color-primary-700)]"
            >
              {experience.link.label} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
