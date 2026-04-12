"use client";

import { useEffect } from "react";
import { installScrollReveal } from "@/lib/anim";

/**
 * Mount this once near the root of a page and it will watch for any
 * element with the `reveal` class, applying `is-visible` when it scrolls
 * into view. anim.ts handles the reduced-motion fallback.
 */
export default function RevealProvider() {
  useEffect(() => {
    const cleanup = installScrollReveal(".reveal");
    return cleanup;
  }, []);
  return null;
}
