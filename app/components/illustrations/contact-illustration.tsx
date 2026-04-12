"use client";

/**
 * Contact page illustration — two speech bubbles ("Hello!" + "Hi!")
 * positioned like the reference screenshot: the larger "Hello!" sits
 * upper-right and the smaller "Hi!" overlaps it from the lower-left.
 *
 * On mount both bubbles scale + fade in with a staggered back-ease,
 * then each floats up/down independently on a gentle looping tween.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function ContactIllustration() {
  const helloRef = useRef<HTMLDivElement>(null);
  const hiRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* ── Entrance — staggered scale-up from slightly below ── */
    animate(helloRef.current!, {
      scale:   [0.72, 1],
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 560,
      ease: "outBack",
    });

    animate(hiRef.current!, {
      scale:   [0.72, 1],
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 560,
      delay: 140,
      ease: "outBack",
    });

    /* ── Continuous float — different speeds so they drift out of phase ── */
    animate(helloRef.current!, {
      translateY: [0, -9],
      duration: 2600,
      delay: 560,
      loop: true,
      alternate: true,
      ease: "inOutSine",
    });

    animate(hiRef.current!, {
      translateY: [0, -6],
      duration: 2000,
      delay: 700,
      loop: true,
      alternate: true,
      ease: "inOutSine",
    });
  }, []);

  return (
    /* Container sized to hold both bubbles with their natural overlap */
    <div className="relative select-none" style={{ width: 300, height: 196 }}>

      {/* Hello! — larger bubble, anchored top-right */}
      <div
        ref={helloRef}
        className="absolute"
        style={{ top: 0, right: 0, width: 204, opacity: 0 }}
      >
        <Image
          src="/images/Hello Speech Bubble.svg"
          alt="Hello!"
          width={204}
          height={119}
          priority
          draggable={false}
        />
      </div>

      {/* Hi! — smaller bubble, anchored bottom-left, overlaps Hello */}
      <div
        ref={hiRef}
        className="absolute"
        style={{ bottom: 0, left: 0, width: 136, opacity: 0 }}
      >
        <Image
          src="/images/Hi Speech Bubble.svg"
          alt="Hi!"
          width={136}
          height={84}
          priority
          draggable={false}
        />
      </div>

    </div>
  );
}
