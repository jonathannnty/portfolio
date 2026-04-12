import type { ReactNode } from "react";

/**
 * Section wrapper used on every page. Enforces consistent vertical rhythm,
 * container width, and eyebrow/title/subtitle typography so the style guide
 * is applied the same way everywhere.
 */
type SectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  id?: string;
  children: ReactNode;
  /** Remove top padding — useful when stacking two sections visually. */
  tight?: boolean;
};

export default function Section({
  eyebrow,
  title,
  subtitle,
  id,
  children,
  tight,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`container-page ${tight ? "pt-8" : "pt-20 md:pt-28"} pb-20 md:pb-28`}
    >
      {(eyebrow || title || subtitle) && (
        <header className="mb-12 max-w-2xl">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {title && (
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[color:var(--color-fg)] sm:text-4xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-4 text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
