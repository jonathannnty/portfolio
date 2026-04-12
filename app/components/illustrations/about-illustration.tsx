"use client";

/**
 * About page illustration — a blob character surrounded by sporadic
 * speech bubbles that independently fade in and out via anime.js.
 */

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function AboutIllustration() {
  const b1 = useRef<SVGGElement>(null);
  const b2 = useRef<SVGGElement>(null);
  const b3 = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bubbles = [
      { ref: b1, duration: 2000, delay: 200 },
      { ref: b2, duration: 2500, delay: 1100 },
      { ref: b3, duration: 1800, delay: 1900 },
    ];

    bubbles.forEach(({ ref, duration, delay }) => {
      if (!ref.current) return;
      animate(ref.current, {
        opacity: [0, 1],
        duration,
        delay,
        loop: true,
        alternate: true,
        ease: "inOutSine",
      });
    });
  }, []);

  return (
    <></>
  );
}
