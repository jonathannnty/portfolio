"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-fg-muted)] transition-colors hover:text-[color:var(--color-primary-700)]"
    >
      <ArrowUp className="h-3.5 w-3.5" />
      Back to top
    </button>
  );
}
