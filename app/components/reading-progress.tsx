"use client";

import { motion, useSpring, useScroll } from "motion/react";

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, originX: 0 }}
      className="fixed top-0 left-0 right-0 z-[200] h-[3px] bg-[color:var(--color-primary-500)] pointer-events-none"
      aria-hidden
    />
  );
}
