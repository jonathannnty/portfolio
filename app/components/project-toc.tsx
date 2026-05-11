"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/toc";

export type { Heading };

export function useTOCActiveId(ids: string[]): string {
  const [activeId, setActiveId] = useState(ids[0] ?? "");
  const idsKey = ids.join(",");

  useEffect(() => {
    if (!idsKey) return;
    setActiveId(ids[0] ?? "");

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );

    idsKey.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [idsKey]);

  return activeId;
}
