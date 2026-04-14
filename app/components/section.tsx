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
  /**
   * Optional decorative illustration rendered to the right of the heading
   * block on large screens. Pass a client component (e.g. AboutIllustration).
   * Hidden below the `lg` breakpoint so it never crowds the title on mobile.
   */
  illustration?: ReactNode;
};

export default function Section({
  eyebrow,
  title,
  subtitle,
  id,
  children,
  tight,
  illustration,
}: SectionProps) {
  const hasHeader = eyebrow || title || subtitle;

  return (
    <section
      id={id}
      className={`container-page ${tight ? "pt-8" : "pt-20 md:pt-28"} pb-20 md:pb-28`}
    >
      {hasHeader && (
        <header className={`mb-12 flex items-center gap-10 ${illustration ? "" : "max-w-2xl"}`}>
          {/* Text block — always constrained to 2xl for readability */}
          <div className="max-w-2xl flex-1 min-w-0">
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
          </div>

          {/* Illustration — only visible on large screens */}
          {illustration && (
            <div className="hidden lg:flex flex-none items-center select-none">
              {illustration}
            </div>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
