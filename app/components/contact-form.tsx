"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { createTimeline } from "animejs";
import { submitContactMessage } from "@/app/contact/actions";
import {
  initialContactState,
  type ContactFormState,
} from "@/app/contact/actions.types";

export default function ContactForm() {
  const [state, formAction] = useActionState<ContactFormState, FormData>(
    submitContactMessage,
    initialContactState,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Honeypot — hidden from users, often filled by bots */}
      <div className="hidden" aria-hidden>
        <label>
          Do not fill this out:
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field
        label="Your name"
        name="name"
        type="text"
        autoComplete="name"
        error={state.fieldErrors?.name}
      />

      <Field
        label="Your email"
        name="email"
        type="email"
        autoComplete="email"
        error={state.fieldErrors?.email}
      />

      <Field
        label="Message"
        name="message"
        type="textarea"
        error={state.fieldErrors?.message}
      />

      <div className="flex items-center justify-between gap-4">
        <SubmitButton />
        {state.status === "error" && state.message && (
          <p
            role="alert"
            className="flex items-start gap-2 text-sm text-[color:var(--color-danger)]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
            <span>{state.message}</span>
          </p>
        )}
        {state.status === "success" && (
          <p
            role="status"
            className="flex items-start gap-2 text-sm text-[color:var(--color-success)]"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" />
            <span>{state.message}</span>
          </p>
        )}
      </div>
    </form>
  );
}

/* ---------- Pieces ---------- */

type FieldProps = {
  label: string;
  name: string;
  type: "text" | "email" | "textarea";
  autoComplete?: string;
  error?: string;
};

function Field({ label, name, type, autoComplete, error }: FieldProps) {
  const baseClass =
    "w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-base text-[color:var(--color-fg)] shadow-sm transition-colors focus:border-[color:var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-200)]";
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-[color:var(--color-fg)]"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={6}
          autoComplete={autoComplete}
          className={baseClass}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          className={baseClass}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1.5 text-xs text-[color:var(--color-danger)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const btnRef = useRef<HTMLButtonElement>(null);
  const animatingRef = useRef(false);
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (animatingRef.current || !btnRef.current) return;
    animatingRef.current = true;
    setAnimating(true);
    runPlaneAnimation(btnRef.current, () => {
      animatingRef.current = false;
      setAnimating(false);
    });
  };

  return (
    <button
      ref={btnRef}
      type="submit"
      className="paper-plane-btn"
      disabled={pending || animating}
      aria-label={pending ? "Sending message" : "Send message"}
      onClick={handleClick}
    >
      <span className="pp-text">
        {pending ? "Sending..." : "Send message"}
      </span>
      <span className="pp-success" aria-hidden>
        <svg viewBox="0 0 16 16">
          <polyline points="3.75 9 7 12 13 5" />
        </svg>
        Sent!
      </span>
      <svg
        className="pp-trails-svg"
        viewBox="0 0 33 64"
        aria-hidden
      >
        <path d="M26,4 C28,13.3333333 29,22.6666667 29,32 C29,41.3333333 28,50.6666667 26,60" />
        <path d="M6,4 C8,13.3333333 9,22.6666667 9,32 C9,41.3333333 8,50.6666667 6,60" />
      </svg>
      <div className="pp-plane" aria-hidden>
        <div className="pp-left" />
        <div className="pp-right" />
      </div>
    </button>
  );
}

function runPlaneAnimation(btn: HTMLButtonElement, onDone: () => void) {
  // ── Timeline 1: polygon morph + plane fly-off ──────────────────────────
  createTimeline({ defaults: { ease: "linear" } })
    // Step 1 — converge wings toward centre (fold initiation)
    .add(btn, {
      "--pp-left-wing-first-x": 50,
      "--pp-left-wing-first-y": 100,
      "--pp-right-wing-second-x": 50,
      "--pp-right-wing-second-y": 100,
      duration: 200,
      onComplete() {
        // Instant-reshape into 3-D paper-plane configuration
        const s = btn.style;
        s.setProperty("--pp-left-wing-first-y", "0");
        s.setProperty("--pp-left-wing-second-x", "40");
        s.setProperty("--pp-left-wing-second-y", "100");
        s.setProperty("--pp-left-wing-third-x", "0");
        s.setProperty("--pp-left-wing-third-y", "100");
        s.setProperty("--pp-left-body-third-x", "40");
        s.setProperty("--pp-right-wing-first-x", "50");
        s.setProperty("--pp-right-wing-first-y", "0");
        s.setProperty("--pp-right-wing-second-x", "60");
        s.setProperty("--pp-right-wing-second-y", "100");
        s.setProperty("--pp-right-wing-third-x", "100");
        s.setProperty("--pp-right-wing-third-y", "100");
        s.setProperty("--pp-right-body-third-x", "60");
      },
    })
    // Step 2 — tuck wing tips upward
    .add(btn, {
      "--pp-left-wing-third-x": 20,
      "--pp-left-wing-third-y": 90,
      "--pp-left-wing-second-y": 90,
      "--pp-left-body-third-y": 90,
      "--pp-right-wing-third-x": 80,
      "--pp-right-wing-third-y": 90,
      "--pp-right-body-third-y": 90,
      "--pp-right-wing-second-y": 90,
      duration: 200,
    })
    // Step 3 — tilt for launch
    .add(btn, {
      "--pp-rotate": 50,
      "--pp-left-wing-third-y": 95,
      "--pp-left-wing-third-x": 27,
      "--pp-right-body-third-x": 45,
      "--pp-right-wing-second-x": 45,
      "--pp-right-wing-third-x": 60,
      "--pp-right-wing-third-y": 83,
      duration: 250,
    })
    // Step 4 — begin liftoff
    .add(btn, {
      "--pp-rotate": 60,
      "--pp-plane-x": -8,
      "--pp-plane-y": 40,
      duration: 200,
    })
    // Step 5 — fly off screen
    .add(btn, {
      "--pp-rotate": 40,
      "--pp-plane-x": 45,
      "--pp-plane-y": -300,
      "--pp-plane-opacity": 0,
      duration: 375,
      onComplete() {
        setTimeout(() => {
          btn.removeAttribute("style");
          btn.style.opacity = "0";
          btn.style.transform = "translateY(-8px)";
          createTimeline()
            .add(btn, {
              opacity: 1,
              translateY: 0,
              duration: 300,
              ease: "outExpo",
            })
            .call(() => {
              btn.removeAttribute("style");
              onDone();
            });
        }, 1800);
      },
    });

  // ── Timeline 2: text/colour/trail/success (parallel) ──────────────────
  createTimeline({ defaults: { ease: "linear" } })
    // Fade text, collapse border-radius, flash wings darker
    .add(
      btn,
      {
        "--pp-text-opacity": 0,
        "--pp-border-radius": 0,
        "--pp-left-wing-bg": "#512e10",
        "--pp-right-wing-bg": "#512e10",
        duration: 110,
      },
      0,
    )
    // Return wings to base colour
    .add(btn, {
      "--pp-left-wing-bg": "#6e4218",
      "--pp-right-wing-bg": "#6e4218",
      duration: 140,
    })
    // Add body shading (depth illusion)
    .add(
      btn,
      {
        "--pp-left-body-bg": "#512e10",
        "--pp-right-body-bg": "#3a1e08",
        duration: 250,
      },
      350,
    )
    // Reveal trail streaks
    .add(btn, { "--pp-trails-stroke": 171, duration: 220 }, 820)
    // Slide success label in
    .add(
      btn,
      { "--pp-success-opacity": 1, "--pp-success-x": 0, duration: 200 },
      1190,
    )
    // Draw success checkmark
    .add(btn, { "--pp-success-stroke": 0, duration: 150 }, 1390);
}
