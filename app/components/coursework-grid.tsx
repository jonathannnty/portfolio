import { coursework, type Course } from "@/content/coursework";

const CATEGORY_ORDER: Course["category"][] = [
  "Systems",
  "Theory",
  "AI/ML",
  "Math",
  "Other",
];

export default function CourseworkGrid() {
  // Group courses by category, keeping a stable display order
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    entries: coursework.filter((c) => c.category === category),
  })).filter((g) => g.entries.length > 0);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {grouped.map(({ category, entries }) => (
        <div key={category}>
          <h3 className="eyebrow mb-4">{category}</h3>
          <ul className="space-y-3">
            {entries.map((c) => (
              <li
                key={c.code}
                className="card p-4"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-[color:var(--color-primary-700)]">
                      {c.code}
                    </p>
                    <p className="mt-1 font-display text-base font-semibold text-[color:var(--color-fg)]">
                      {c.title}
                    </p>
                  </div>
                  <span className="flex-none font-mono text-xs text-[color:var(--color-fg-subtle)]">
                    {c.term}
                  </span>
                </div>
                {c.note && (
                  <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                    {c.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
