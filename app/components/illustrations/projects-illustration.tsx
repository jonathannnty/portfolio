"use client";

/**
 * Projects page illustration — Computer monitor, keyboard, and mouse
 * assets composed to match the reference screenshot.
 *
 * Layout (320 × 230 container):
 *   Computer  — upper area, slight right-offset (mimics the angled 3-D look)
 *   Keyboard  — bottom-left, spans most of the width
 *   Mouse     — bottom-right, beside the keyboard
 *
 * Animations (anime.js):
 *   • Entrance  — all three scale + fade in with staggered back-ease
 *   • Computer  — slow vertical float loop
 *   • Mouse     — drifts diagonally as if being nudged by a hand
 *   • Keyboard  — micro press-bob, like someone typing
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function ProjectsIllustration() {
  const computerRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const mouseRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* ── Entrance — staggered scale-up ─────────────────── */
    animate(computerRef.current!, {
      scale:      [0.78, 1],
      opacity:    [0, 1],
      translateY: [14, 0],
      duration:   620,
      ease:       "outBack",
    });
    animate(keyboardRef.current!, {
      scale:      [0.78, 1],
      opacity:    [0, 1],
      translateY: [10, 0],
      duration:   580,
      delay:      130,
      ease:       "outBack",
    });
    animate(mouseRef.current!, {
      scale:      [0.78, 1],
      opacity:    [0, 1],
      translateY: [10, 0],
      duration:   580,
      delay:      230,
      ease:       "outBack",
    });

    /* ── Computer — gentle vertical float ───────────────── */
    animate(computerRef.current!, {
      translateY: [0, -8],
      duration:   2800,
      delay:      700,
      loop:       true,
      alternate:  true,
      ease:       "inOutSine",
    });

    /* ── Mouse — small diagonal drift (cursor movement) ─── */
    animate(mouseRef.current!, {
      translateX: [0, 7],
      translateY: [0, -5],
      duration:   2000,
      delay:      900,
      loop:       true,
      alternate:  true,
      ease:       "inOutQuad",
    });

    /* ── Keyboard — micro press-bob ─────────────────────── */
    animate(keyboardRef.current!, {
      translateY: [0, 2.5],
      duration:   1400,
      delay:      800,
      loop:       true,
      alternate:  true,
      ease:       "inOutSine",
    });
  }, []);

  return (
    /* 320 × 230 px canvas — hidden below lg by Section */
    <div className="relative select-none" style={{ width: 320, height: 230 }}>

      {/* Computer — upper area, offset right to show the 3-D angle */}
      <div
        ref={computerRef}
        className="absolute"
        style={{ top: 0, left: 32, width: 212, opacity: 0 }}
      >
        <Image
          src="/images/Computer.svg"
          alt="Computer"
          width={212}
          height={190}
          priority
          draggable={false}
        />
      </div>

      {/* Keyboard — bottom-left, spans most of the width */}
      <div
        ref={keyboardRef}
        className="absolute"
        style={{ bottom: -6, left: -20, width: 218, opacity: 0 }}
      >
        <Image
          src="/images/Keyboard.svg"
          alt="Keyboard"
          width={218}
          height={51}
          priority
          draggable={false}
        />
      </div>

      {/* Mouse — bottom-right, beside the keyboard */}
      <div
        ref={mouseRef}
        className="absolute"
        style={{ bottom: -10, right: 60, width: 52, opacity: 0 }}
      >
        <Image
          src="/images/Mouse.svg"
          alt="Mouse"
          width={52}
          height={47}
          priority
          draggable={false}
        />
      </div>

    </div>
  );
}
