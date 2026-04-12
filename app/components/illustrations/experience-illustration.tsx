"use client";

/**
 * Experience / Timeline section illustration — the SuitcasePaper asset.
 *
 * Animations:
 *   • Entrance  — scale + fade with back-ease
 *   • Float     — gentle up/down oscillation loop
 *   • Sway      — slow left/right drift to give it a "carried" feel
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function ExperienceIllustration() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Entrance */
    animate(ref.current!, {
      scale:      [0.82, 1],
      opacity:    [0, 1],
      translateY: [12, 0],
      duration:   600,
      ease:       "outBack",
    });

    /* Vertical float loop */
    animate(ref.current!, {
      translateY: [0, -8],
      duration:   2600,
      delay:      650,
      loop:       true,
      alternate:  true,
      ease:       "inOutSine",
    });

    /* Gentle lateral sway — slightly slower so it drifts out of phase with float */
    animate(ref.current!, {
      translateX: [0, 5],
      duration:   3400,
      delay:      650,
      loop:       true,
      alternate:  true,
      ease:       "inOutSine",
    });
  }, []);

  return (
    <div
      ref={ref}
      className="select-none scale-150"
      style={{ width: 260, opacity: 0 }}
    >
      <Image
        src="/images/SuitcasePaper.svg"
        alt="Suitcase with documents"
        width={260}
        height={112}
        priority
        draggable={false}
      />
    </div>
  );
}
