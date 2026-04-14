"use client";

/**
 * Coursework section illustration — the UCSD Trident asset.
 *
 * Animations:
 *   • Entrance  — scale + fade with back-ease, rises from below
 *   • Float     — slow vertical bob loop
 *   • Pulse     — very subtle scale breath, like a torch flame
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function CourseworkIllustration() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Entrance */
    animate(ref.current!, {
      scale:      [0.80, 1],
      opacity:    [0, 1],
      translateY: [14, 0],
      duration:   600,
      ease:       "outBack",
    });

    /* Vertical float */
    animate(ref.current!, {
      translateY: [0, -9],
      duration:   2800,
      delay:      660,
      loop:       true,
      alternate:  true,
      ease:       "inOutSine",
    });

    /* Scale pulse — subtler than the float so the two motions feel distinct */
    animate(ref.current!, {
      scale:     [1, 1.05],
      duration:  3600,
      delay:     660,
      loop:      true,
      alternate: true,
      ease:      "inOutQuad",
    });
  }, []);

  return (
    <div
      ref={ref}
      className="select-none scale-150 ml-20"
      style={{ width: 130, opacity: 0 }}
    >
      <Image
        src="/images/UCSD.svg"
        alt="UCSD Trident"
        width={130}
        height={147}
        priority
        draggable={false}
      />
    </div>
  );
}
