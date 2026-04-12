"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { animate } from "animejs";

interface Props {
  src: string;
  alt: string;
}

/**
 * Wraps a thumbnail image with a click-to-expand lightbox.
 *
 * The overlay is portaled to document.body so it escapes any parent
 * <button> or overflow:hidden container (e.g. the timeline card).
 * Click propagation on the thumbnail is stopped so the parent card
 * toggle does not fire.
 */
export default function ImageLightbox({ src, alt }: Props) {
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);
  const imgRef                = useRef<HTMLDivElement>(null);
  const backdropRef           = useRef<HTMLDivElement>(null);
  const closing               = useRef(false);

  /* Need the DOM to be available for createPortal */
  useEffect(() => { setMounted(true); }, []);

  /* Lock body scroll while open + Escape key to close */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* Entrance animation after overlay mounts */
  useEffect(() => {
    if (!open) return;
    closing.current = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    if (backdropRef.current) {
      animate(backdropRef.current, {
        opacity:  [0, 1],
        duration: 260,
        ease:     "outQuad",
      });
    }
    if (imgRef.current) {
      animate(imgRef.current, {
        scale:    [0.5, 1],
        opacity:  [0, 1],
        duration: 400,
        ease:     "outBack",
      });
    }
  }, [open]);

  const handleOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    // Stop the native event too — React 17+ delegates to the root, so
    // stopPropagation() alone doesn't always block the parent <button> click.
    if ("nativeEvent" in e) e.nativeEvent.stopImmediatePropagation();
    setOpen(true);
  };

  const close = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (closing.current) return;
    closing.current = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setOpen(false); closing.current = false; return; }

    if (imgRef.current) {
      animate(imgRef.current, {
        scale:    [1, 0.5],
        opacity:  [1, 0],
        duration: 260,
        ease:     "inBack",
      });
    }
    if (backdropRef.current) {
      animate(backdropRef.current, {
        opacity:    [1, 0],
        duration:   260,
        ease:       "outQuad",
        onComplete: () => { setOpen(false); closing.current = false; },
      });
    }
  };

  const overlay = open ? (
    <div
      ref={backdropRef}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (e.target === e.currentTarget) close(e);
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      style={{ opacity: 0 }}
    >
      <div
        ref={imgRef}
        onClick={(e) => e.stopPropagation()}
        className="relative"
        style={{ opacity: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="block max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
        />

        <button
          type="button"
          onClick={close}
          aria-label="Close photo"
          className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-bg)] shadow-md text-[color:var(--color-fg)] transition-colors hover:text-[color:var(--color-primary-700)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Thumbnail — fill parent container, stop clicks from bubbling to card */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Expand photo: ${alt}`}
        onClick={handleOpen}
        onKeyDown={(e) => e.key === "Enter" && handleOpen(e)}
        className="absolute inset-0 cursor-zoom-in"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 640px) 20vw, 40vw"
        />
      </div>

      {/* Portal — renders at document.body, outside any parent button */}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
