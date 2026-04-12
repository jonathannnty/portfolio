import { Award as AwardIcon, ExternalLink } from "lucide-react";
import { awards } from "@/content/awards";

export default function AwardsGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {awards.map((a) => (
        <li key={a.id} className="card flex gap-4 p-5">
          <span
            aria-hidden
            className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
          >
            <AwardIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-base font-semibold text-[color:var(--color-fg)]">
                {a.title}
              </p>
              <span className="flex-none font-mono text-xs text-[color:var(--color-fg-subtle)]">
                {a.date}
              </span>
            </div>
            <p className="text-sm text-[color:var(--color-primary-700)]">
              {a.organization}
            </p>
            {a.description && (
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
                {a.description}
              </p>
            )}
            {a.link && (
              <a
                href={a.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--color-primary-700)] hover:underline"
              >
                {a.link.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
