"use client";

import Script from "next/script";
import { Calendar } from "lucide-react";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export default function CalendlyLink() {
  return (
    <>
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <li className="flex items-center gap-3 text-[color:var(--color-fg-muted)]">
        <Calendar className="h-4 w-4 text-[color:var(--color-primary-600)]" />
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            window.Calendly?.initPopupWidget({
              url: "https://calendly.com/j1ty-ucsd/1-1-meeting",
            });
          }}
          className="hover:text-[color:var(--color-primary-700)]"
        >
          Schedule time with me
        </a>
      </li>
    </>
  );
}
