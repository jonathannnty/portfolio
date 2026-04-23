"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
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

const PLANE_ANIM_MS = 1100;

function SubmitButton() {
  const { pending } = useFormStatus();
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    if (pending) setLaunching(true);
  }, [pending]);

  useEffect(() => {
    if (!launching) return;
    const timer = setTimeout(() => setLaunching(false), PLANE_ANIM_MS);
    return () => clearTimeout(timer);
  }, [launching]);

  const busy = pending || launching;

  return (
    <button
      type="submit"
      className="btn-primary plane-btn"
      disabled={pending}
      data-pending={busy}
    >
      <span>{busy ? "Sending..." : "Send message"}</span>
      <span
        className="plane-launch relative inline-flex h-4 w-4 items-center justify-center"
        aria-hidden
      >
        <Send className="plane-icon relative h-4 w-4" />
        <svg
          className="plane-trail pointer-events-none absolute"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M22 4 Q 6 12 22 20" />
          <path d="M20 2 Q 2 12 20 22" />
          <path d="M18 0 Q -2 12 18 24" />
        </svg>
      </span>
    </button>
  );
}
