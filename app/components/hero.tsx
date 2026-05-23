"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useRef } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { site } from "@/content/site";
import { revealStagger } from "@/lib/anim";

type SceneStyle = CSSProperties & Record<`--${string}`, string>;

const fallingLeaves: Array<{ id: string; style: SceneStyle }> = [
  {
    id: "near-canopy",
    style: {
      "--leaf-top": "8%",
      "--leaf-left": "45%",
      "--leaf-scale": "0.32",
      "--leaf-drift": "-12rem",
      "--leaf-drop": "30rem",
      "--leaf-spin": "320deg",
      "--leaf-duration": "9.5s",
      "--leaf-delay": "-1.5s",
    },
  },
  {
    id: "high-branch",
    style: {
      "--leaf-top": "13%",
      "--leaf-left": "60%",
      "--leaf-scale": "0.24",
      "--leaf-drift": "-17rem",
      "--leaf-drop": "34rem",
      "--leaf-spin": "-280deg",
      "--leaf-duration": "11s",
      "--leaf-delay": "-5s",
    },
  },
  {
    id: "outer-edge",
    style: {
      "--leaf-top": "24%",
      "--leaf-left": "72%",
      "--leaf-scale": "0.28",
      "--leaf-drift": "-21rem",
      "--leaf-drop": "29rem",
      "--leaf-spin": "360deg",
      "--leaf-duration": "10.5s",
      "--leaf-delay": "-7s",
    },
  },
  {
    id: "low-branch",
    style: {
      "--leaf-top": "29%",
      "--leaf-left": "50%",
      "--leaf-scale": "0.21",
      "--leaf-drift": "-15rem",
      "--leaf-drop": "27rem",
      "--leaf-spin": "-420deg",
      "--leaf-duration": "12s",
      "--leaf-delay": "-3.2s",
    },
  },
  {
    id: "small-gust",
    style: {
      "--leaf-top": "18%",
      "--leaf-left": "38%",
      "--leaf-scale": "0.18",
      "--leaf-drift": "-10rem",
      "--leaf-drop": "24rem",
      "--leaf-spin": "260deg",
      "--leaf-duration": "8.5s",
      "--leaf-delay": "-6.5s",
    },
  },
];

/**
 * Hero - the first thing visitors see on the home page.
 */
export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Guard against React StrictMode double-invoke: the data attribute persists
    // on the DOM node between the two simulated mount cycles, so the second
    // run sees it and bails out before resetting opacity to 0 again.
    if (root.hasAttribute("data-hero-animated")) return;
    root.setAttribute("data-hero-animated", "");

    revealStagger(root.querySelectorAll(".hero-stagger"), {
      delay: 80,
      duration: 750,
      stagger: 70,
    });
  }, []);

  return (
    <div ref={rootRef} className="hero-gradient relative overflow-hidden">
      <div
        aria-hidden
        className="hero-scene pointer-events-none absolute inset-0"
      >
        <div className="hero-grass-band">
          <Image
            className="hero-grass"
            src="/images/assets/Grass.svg"
            alt=""
            width={2126}
            height={483}
            sizes="100vw"
            preload
          />
        </div>

        <div className="hero-tree-stage">
          <div className="hero-leaf-field">
            {fallingLeaves.map((leaf) => (
              <Image
                key={leaf.id}
                className="hero-leaf"
                src="/images/assets/Leaf.svg"
                alt=""
                width={97}
                height={127}
                style={leaf.style}
              />
            ))}
          </div>

          <Image
            className="hero-tree"
            src="/images/assets/Tree.svg"
            alt=""
            width={940}
            height={998}
            preload
          />
        </div>
      </div>

      <div className="container-page relative z-10 flex min-h-[72vh] flex-col justify-center py-24 sm:pr-[14rem] md:py-32 md:pr-[22rem] lg:pr-[28rem]">
        <span className="hero-stagger eyebrow opacity-100 motion-safe:opacity-0 [letter-spacing:0]">
          Hello - I&apos;m {site.name.split(" ")[0]}
        </span>

        <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-normal text-[color:var(--color-fg)] sm:text-4xl md:text-5xl lg:text-[4rem]">
          <span className="hero-stagger block opacity-100 motion-safe:opacity-0">
            {site.role}
          </span>
        </h1>

        <p className="hero-stagger mt-7 max-w-2xl text-lg leading-relaxed text-[color:var(--color-fg-muted)] opacity-100 motion-safe:opacity-0">
          {site.tagline}
        </p>

        <div className="hero-stagger mt-10 flex flex-wrap items-center gap-4 opacity-100 motion-safe:opacity-0">
          <Link href="/projects" className="btn-primary">
            See my work
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact" className="btn-ghost">
            <Mail className="h-4 w-4" />
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
