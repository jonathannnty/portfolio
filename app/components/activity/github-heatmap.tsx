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

export default function GitHubHeatmap({ data }: Props) {
  return (
    <div className="flex gap-[3px] overflow-x-auto" aria-label="GitHub contribution heatmap">
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
  );
}
