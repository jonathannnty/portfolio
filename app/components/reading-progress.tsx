"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled  = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setPct(maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[200] h-[3px] bg-[color:var(--color-primary-500)] transition-[width] duration-75 ease-linear pointer-events-none"
      style={{ width: `${pct}%` }}
      aria-hidden
    />
  );
}
