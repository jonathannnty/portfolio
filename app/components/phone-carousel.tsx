"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhoneCarouselProps {
  images: { src: string; alt: string }[];
}

export function PhoneCarousel({ images }: PhoneCarouselProps) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function go(i: number) {
    setIndex((i + images.length) % images.length);
  }

  return (
    <div className="my-6 select-none">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => go(index - 1)}
          aria-label="Previous screen"
          className="brushed flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--color-surface)] text-[color:var(--color-fg-muted)] transition hover:text-[color:var(--color-fg)]"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Container holds its size from the image; AnimatePresence layers fade on top */}
        <div ref={containerRef} className="relative w-52">
          {/* Invisible anchor keeps the container sized to the image */}
          <Image
            src={images[index].src}
            alt=""
            aria-hidden
            width={0}
            height={0}
            sizes="208px"
            className="invisible h-auto w-full"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) go(index + 1);
                else if (info.offset.x > 50) go(index - 1);
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <div className="overflow-hidden rounded-[var(--radius-lg)] bg-[color:var(--color-primary-50)]">
                <Image
                  src={images[index].src}
                  alt={images[index].alt}
                  width={0}
                  height={0}
                  sizes="208px"
                  className="pointer-events-none h-auto w-full"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => go(index + 1)}
          aria-label="Next screen"
          className="brushed flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--color-surface)] text-[color:var(--color-fg-muted)] transition hover:text-[color:var(--color-fg)]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2.5">
        <div className="flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to screen ${i + 1}`}
              className={`brushed h-1.5 rounded-full transition-all duration-200 ${
                i === index
                  ? "w-4 bg-[color:var(--color-accent)]"
                  : "w-1.5 bg-[color:var(--color-primary-300)]"
              }`}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-[color:var(--color-fg-muted)]">
          {index + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}
