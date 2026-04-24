"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Experience } from "@/content/experiences";
import { resolveUrlOverride } from "@/lib/flyover/flag";
import Timeline from "../timeline";

const FlyoverEngine = dynamic(() => import("./flyover-engine"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[60vh] w-full items-center justify-center rounded-2xl bg-[color:var(--color-surface)] text-sm text-[color:var(--color-fg-muted)]"
      aria-label="Loading flyover"
    >
      Loading flyover…
    </div>
  ),
});

type Props = { experiences: Experience[] };

export default function FlyoverSection({ experiences }: Props) {
  // Treat prefers-reduced-motion as a hard opt-out: render the existing
  // timeline rather than load Mapbox at all. Saves bundle weight and avoids
  // any camera motion entirely for users who asked for less.
  const [reduced, setReduced] = useState<boolean | null>(null);
  const [forceFlyover] = useState(
    () =>
      typeof window !== "undefined" &&
      resolveUrlOverride(window.location.search) === true,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduced === null) {
    return (
      <div
        className="flex h-[40vh] w-full items-center justify-center rounded-2xl bg-[color:var(--color-surface)] text-sm text-[color:var(--color-fg-muted)]"
        aria-hidden="true"
      />
    );
  }
  if (reduced && !forceFlyover) return <Timeline items={experiences} />;
  return <FlyoverEngine experiences={experiences} />;
}
