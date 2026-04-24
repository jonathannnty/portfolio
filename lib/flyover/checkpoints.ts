import type { Experience } from "@/content/experiences";
import type { Checkpoint, RouteData } from "./types";

/**
 * Resolve the ordered checkpoint list shown by the engine.
 *
 * Preferred path: `manifestCheckpoints` (built at ingestion from each
 * experience's `geo: { lat, lng }`). When no anchors exist yet we
 * synthesize an evenly-distributed set from the experiences themselves so
 * the engine has something visible to demo. Once `geo` fields are added
 * and `npm run ingest:route` is re-run, the manifest path takes over.
 */
export function resolveCheckpoints(
  experiences: Experience[],
  route: RouteData,
  manifestCheckpoints: Checkpoint[],
): Array<{ checkpoint: Checkpoint; experience: Experience }> {
  const byId = new Map(experiences.map((e) => [e.id, e]));

  if (manifestCheckpoints.length > 0) {
    return manifestCheckpoints
      .map((cp) => {
        const exp = byId.get(cp.id);
        return exp ? { checkpoint: cp, experience: exp } : null;
      })
      .filter(
        (v): v is { checkpoint: Checkpoint; experience: Experience } => v !== null,
      );
  }

  // Fallback: distribute experiences evenly between 15% and 85% of route.
  const n = experiences.length;
  if (n === 0) return [];
  const start = 0.15;
  const end = 0.85;
  return experiences.map((exp, i) => {
    const progress = n === 1 ? (start + end) / 2 : start + ((end - start) * i) / (n - 1);
    const targetMeters = progress * route.totalDistance;
    let lo = 0;
    let hi = route.points.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (route.points[mid].d < targetMeters) lo = mid + 1;
      else hi = mid;
    }
    return {
      checkpoint: { id: exp.id, pointIndex: lo, progress },
      experience: exp,
    };
  });
}

/**
 * Find the checkpoint that should be "active" given current scroll progress
 * within the fly phase (0..1, where 0 is fly start and 1 is fly end).
 *
 * Per-checkpoint window overrides come from `experience.flyover.window` and
 * are honored on a case-by-case basis: a high-emphasis role can dwell
 * longer; a low-emphasis one can collapse to a brief flash.
 */
export function activeCheckpointIndex(
  cps: Array<{ checkpoint: Checkpoint; experience: Experience }>,
  flyProgress: number,
  defaultWindow = 0.06,
): number | null {
  if (cps.length === 0) return null;
  let best = -1;
  let bestDist = Infinity;
  let bestWindow = defaultWindow;
  for (let i = 0; i < cps.length; i++) {
    const d = Math.abs(cps[i].checkpoint.progress - flyProgress);
    if (d < bestDist) {
      bestDist = d;
      best = i;
      bestWindow = windowFor(cps[i].experience, defaultWindow);
    }
  }
  return bestDist <= bestWindow ? best : null;
}

function windowFor(exp: Experience, fallback: number): number {
  const explicit = exp.flyover?.window;
  if (typeof explicit === "number" && explicit > 0) return explicit;
  switch (exp.flyover?.emphasis) {
    case "high":
      return fallback * 1.6;
    case "low":
      return fallback * 0.5;
    default:
      return fallback;
  }
}
