"use client";

/**
 * Awards & Honors section illustration — the Medal asset.
 *
 * Animations:
 *   • Entrance  — scale + fade with back-ease, drops in from above
 *   • Pendulum  — slow ±5 ° rotation loop, transform-origin at the top
 *                 so it swings like a hanging medal on a ribbon
 *   • Shimmer   — subtle scale pulse to mimic a gleam catching the light
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function AwardsIllustration() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Entrance — drops in and scales up */
    animate(ref.current!, {
      scale:      [0.78, 1],
      opacity:    [0, 1],
      translateY: [-10, 0],
      duration:   640,
      ease:       "outBack",
    });

    /* Pendulum swing — transform-origin is "top center" (set via style below) */
    animate(ref.current!, {
      rotate:    [-5, 5],
      duration:  2200,
      delay:     700,
      loop:      true,
      alternate: true,
      ease:      "inOutSine",
    });

    /* Shimmer pulse — scale breathes very slightly */
    animate(ref.current!, {
      scale:     [1, 1.04],
      duration:  3000,
      delay:     700,
      loop:      true,
      alternate: true,
      ease:      "inOutQuad",
    });
  }, []);

  return (
    <div
      ref={ref}
      className="select-none scale-120"
      style={{
        width: 150,
        opacity: 0,
        /* Swing around the top-center so it behaves like a hanging medal */
        transformOrigin: "top center",
      }}
    >
      <Image
        src="/images/Medal.svg"
        alt="Medal"
        width={150}
        height={146}
        priority
        draggable={false}
      />
    </div>
  );
}
