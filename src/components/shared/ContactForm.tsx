"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface ContactFormProps {
  theme?: "light" | "dark";
}

type Status = "idle" | "submitting" | "success" | "error" | "rate-limited";

const FOUNDER_EMAILS = "sam@reciprocalwealth.com or jake@reciprocalwealth.com";
const GENERIC_ERROR = `Something went wrong sending your message. Please email us directly at ${FOUNDER_EMAILS}.`;
const RATE_LIMIT_ERROR = `You've submitted a few times recently. Please email us directly at ${FOUNDER_EMAILS} and we'll get right back to you.`;

export default function ContactForm({ theme = "light" }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const renderedAt = useRef<number | null>(null);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const isDark = theme === "dark";
  const inputClasses = isDark
    ? "bg-white/5 border-white/15 text-white placeholder-white/40 focus:border-forest-50"
    : "bg-white border-near-black/10 text-near-black placeholder-stone focus:border-forest";

  const labelClasses = isDark ? "text-white/70" : "text-near-black";
  const disclaimerClasses = isDark ? "text-white/45" : "text-stone";
  const linkClasses = isDark
    ? "text-forest-50 hover:text-white underline"
    : "text-forest hover:text-deep-forest underline";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      message: String(data.get("message") || ""),
      company: String(data.get("company") || ""), // honeypot
      renderedAt: renderedAt.current,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        setStatus("rate-limited");
        return;
      }

      let body: { ok?: boolean; error?: string } = {};
      try {
        body = await res.json();
      } catch {
        // Non-JSON response (e.g. an edge/firewall page) - fall through to
        // the generic error below.
      }

      if (res.ok && body.ok) {
        setStatus("success");
        form.reset();
        return;
      }

      setErrorMessage(body.error || GENERIC_ERROR);
      setStatus("error");
    } catch {
      setErrorMessage(GENERIC_ERROR);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className={`rounded-sm border p-8 text-center ${
          isDark ? "border-forest-50/30 bg-forest-50/5" : "border-forest/20 bg-forest-10"
        }`}
      >
        <p className={`text-base font-medium ${isDark ? "text-white" : "text-deep-forest"}`}>
          Thank you — your message has been sent.
        </p>
        <p className={`mt-2 text-sm ${isDark ? "text-white/60" : "text-stone"}`}>
          We&rsquo;ll be in touch soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className={`mt-6 text-sm font-medium underline ${linkClasses}`}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(status === "error" || status === "rate-limited") && (
        <div
          role="alert"
          className={`rounded-sm border p-4 text-sm ${
            isDark
              ? "border-red-400/30 bg-red-400/5 text-white/80"
              : "border-red-300 bg-red-50 text-near-black"
          }`}
        >
          {status === "rate-limited" ? RATE_LIMIT_ERROR : errorMessage}
        </div>
      )}

      {/* Honeypot - hidden from sighted users and screen readers, off-screen
          rather than display:none so bots that skip hidden fields still fill it. */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className={`block text-xs font-medium mb-1.5 ${labelClasses}`}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            inputMode="text"
            autoComplete="name"
            placeholder="Your name"
            className={`w-full rounded-sm border px-3 py-2.5 min-h-11 text-sm outline-none transition-colors ${inputClasses}`}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={`block text-xs font-medium mb-1.5 ${labelClasses}`}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`w-full rounded-sm border px-3 py-2.5 min-h-11 text-sm outline-none transition-colors ${inputClasses}`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className={`block text-xs font-medium mb-1.5 ${labelClasses}`}>
          Phone <span className={disclaimerClasses}>(optional)</span>
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(617) 555-0000"
          className={`w-full rounded-sm border px-3 py-2.5 min-h-11 text-sm outline-none transition-colors ${inputClasses}`}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={`block text-xs font-medium mb-1.5 ${labelClasses}`}>
          Question or Comment
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          placeholder="How can we help?"
          className={`w-full rounded-sm border px-3 py-2.5 min-h-11 text-sm outline-none transition-colors resize-none ${inputClasses}`}
        />
      </div>

      <p className={`text-xs leading-relaxed ${disclaimerClasses}`}>
        Please don&rsquo;t include sensitive personal or account information in
        this message. See our{" "}
        <Link href="/disclosures#privacy-disclosures" className={linkClasses}>
          privacy policy
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-sm bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-deep-forest cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
