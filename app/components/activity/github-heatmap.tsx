import type { GitHubData } from "@/lib/activity/github";

type Props = { data: NonNullable<GitHubData> };

function tier(count: number): string {
  if (count === 0)
    return "bg-[color:var(--color-surface-muted)]";
  if (count <= 3)
    return "bg-[color:var(--color-primary-200)]";
  if (count <= 9)
    return "bg-[color:var(--color-primary-400)]";
  return "bg-[color:var(--color-primary-700)]";
}

const LEGEND_TIERS = [0, 1, 4, 10] as const;

export default function GitHubHeatmap({ data }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">
          GitHub Activity
        </p>
        {data.totalThisWeek > 0 && (
          <p className="font-mono text-[10px] opacity-40">
            {data.totalThisWeek} this week
          </p>
        )}
      </div>

      {/* Heatmap grid */}
      <div
        className="flex justify-end gap-[3px] overflow-hidden"
        aria-label="GitHub contribution heatmap"
      >
        {data.weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.days.map((count, di) => (
              <div
                key={di}
                title={`${count} contribution${count !== 1 ? "s" : ""}`}
                className={`h-[10px] w-[10px] rounded-[2px] ${tier(count)}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 justify-end">
        <span className="font-mono text-[9px] opacity-40">Less</span>
        {LEGEND_TIERS.map((n) => (
          <div key={n} className={`h-[10px] w-[10px] rounded-[2px] ${tier(n)}`} />
        ))}
        <span className="font-mono text-[9px] opacity-40">More</span>
      </div>
    </div>
  );
}
