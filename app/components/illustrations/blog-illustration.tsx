"use client";

/**
 * Blog section illustration — Thoughts (bubbles) + PencilNotes (notebook + pencil).
 *
 * Layout: thought bubbles float on the left, notebook+pencil on the right.
 *
 * Animations:
 *   • Entrance  — both assets scale + fade in with back-ease, staggered by 120ms
 *   • Bubbles   — slow vertical float + subtle scale pulse (like thoughts drifting up)
 *   • Notebook  — gentle lateral sway + float, out of phase with bubbles
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function BlogIllustration() {
  const bubblesRef = useRef<HTMLDivElement>(null);
  const notebookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* ── Entrance — bubbles first, notebook 120ms later ── */
    animate(bubblesRef.current!, {
      opacity:    [0, 1],
      translateY: [12, 0],
      duration:   620,
      ease:       "outBack",
      onComplete: () => {
        /* Start loops only after entrance finishes to avoid property conflicts */
        animate(bubblesRef.current!, {
          translateY: [0, -16],
          duration:   4200,
          loop:       true,
          alternate:  true,
          ease:       "inOutSine",
        });
        animate(bubblesRef.current!, {
          scale:     [1, 1.07],
          duration:  5000,
          loop:      true,
          alternate: true,
          ease:      "inOutQuad",
        });
      },
    });

    animate(notebookRef.current!, {
      opacity:    [0, 1],
      translateY: [12, 0],
      duration:   620,
      delay:      120,
      ease:       "outBack",
      onComplete: () => {
        animate(notebookRef.current!, {
          rotate:    [-2.5, 2.5],
          duration:  2200,
          loop:      true,
          alternate: true,
          ease:      "inOutQuad",
        });
        animate(notebookRef.current!, {
          translateY: [0, -3],
          duration:   2200,
          loop:       true,
          alternate:  true,
          ease:       "inOutQuad",
        });
      },
    });
  }, []);

  return (
    <div className="relative select-none" style={{ width: 320, height: 168 }}>
      {/* Thought bubbles — left */}
      <div
        ref={bubblesRef}
        className="absolute"
        style={{ left: -30, top: 18, opacity: 0 }}
      >
        <Image
          src="/images/Thoughts.svg"
          alt="Thought bubbles"
          width={170}
          height={137}
          priority
          draggable={false}
        />
      </div>

      {/* Pencil + notebook — right */}
      <div
        ref={notebookRef}
        className="absolute"
        style={{ right: 0, top: 0, opacity: 0 }}
      >
        <Image
          src="/images/PencilNotes.svg"
          alt="Pencil and notebook"
          width={170}
          height={152}
          priority
          draggable={false}
        />
      </div>
    </div>
  );
}
