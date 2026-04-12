"use server";

import { Resend } from "resend";
import { site } from "@/content/site";
import { ContactFormState } from "./actions.types";

/* ---------- Helpers ---------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

function getEmailDomain(input: string): string | null {
  const match = input.match(/<([^>]+)>/) ?? input.match(/([^\s<>]+@[^\s<>]+)/);
  const email = match?.[1] ?? match?.[0] ?? "";
  const atIndex = email.lastIndexOf("@");
  if (atIndex === -1) return null;
  return email.slice(atIndex + 1).toLowerCase();
}

function getFromAddress(): string {
  const configuredFrom = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!configuredFrom) return DEFAULT_FROM;

  const domain = getEmailDomain(configuredFrom);
  if (!domain) return DEFAULT_FROM;

  if (domain === "resend.dev") return configuredFrom;

  console.warn(
    `[contact] Ignoring CONTACT_FROM_EMAIL because ${domain} is not a verified Resend sender domain.`,
  );
  return DEFAULT_FROM;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ---------- Action ---------- */

export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = (formData.get("name") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const message = (formData.get("message") ?? "").toString().trim();

  // Honeypot: bots tend to fill every field. If this hidden input is
  // populated, fake a success response without actually sending.
  const honeypot = (formData.get("website") ?? "").toString().trim();
  if (honeypot) {
    return {
      status: "success",
      message: "Thanks! Your message is on its way.",
    };
  }

  const fieldErrors: ContactFormState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "Please enter a valid email.";
  if (message.length < 10)
    fieldErrors.message = "Please write at least 10 characters.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[contact] RESEND_API_KEY is not set — email will not be sent.",
    );
    return {
      status: "error",
      message:
        "The contact form isn't fully configured yet. Please email me directly in the meantime.",
    };
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = getFromAddress();

  try {
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 560px;">
          <p style="margin:0 0 8px;"><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
          <hr style="border:none; border-top:1px solid #e5e7e4; margin:16px 0;" />
          <div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</div>
        </div>
      `,
    });

    if (result.error) {
      console.error("[contact] Resend error:", result.error);
      if (
        result.error.statusCode === 403 ||
        result.error.name === "validation_error"
      ) {
        return {
          status: "error",
          message:
            "Email delivery is not set up yet. Please reach out directly by email for now.",
        };
      }
      return {
        status: "error",
        message: "Something went wrong sending your message. Please try again.",
      };
    }

    return {
      status: "success",
      message: "Thanks for reaching out — I'll get back to you soon.",
    };
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again.",
    };
  }
}
