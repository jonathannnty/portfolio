import type { ReactNode } from "react";

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
  /**
   * The HTML heading level for the section title. Use "h1" on the
   * first/primary section of a page to maintain H1 → H2 → H3 hierarchy.
   * Defaults to "h2".
   */
  titleAs?: "h1" | "h2";
};

export default function Section({
  eyebrow,
  title,
  subtitle,
  id,
  children,
  tight,
  illustration,
  titleAs = "h2",
}: SectionProps) {
  const hasHeader = eyebrow || title || subtitle;
  const TitleTag = titleAs;

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
              <TitleTag className="mt-3 font-display text-3xl font-bold tracking-tight text-[color:var(--color-fg)] sm:text-4xl">
                {title}
              </TitleTag>
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
