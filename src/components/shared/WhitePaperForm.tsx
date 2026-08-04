"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const GENERIC_ERROR =
  "Something went wrong sending your email. Please try again, or reach us at info@reciprocalwealth.com.";

export default function WhitePaperForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const renderedAt = useRef<number | null>(null);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""), // honeypot
      renderedAt: renderedAt.current,
    };

    try {
      const res = await fetch("/api/white-paper/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let body: { ok?: boolean; error?: string } = {};
      try {
        body = await res.json();
      } catch {
        // Non-JSON response (e.g. an edge/firewall page) - fall through.
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
      <div className="rounded-sm border border-forest/20 bg-forest-10 p-8 text-center">
        <p className="text-base font-medium text-deep-forest">
          Check your inbox — your download link is on its way.
        </p>
        <p className="mt-2 text-sm text-stone">
          Click the verification button in the email to download the white
          paper. If you don&rsquo;t see it within a few minutes, check your spam
          folder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <div
          role="alert"
          data-testid="white-paper-error"
          className="rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-near-black"
        >
          {errorMessage}
        </div>
      )}

      {/* Honeypot - hidden from sighted users and screen readers, off-screen
          rather than display:none so bots that skip hidden fields still fill it. */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="white-paper-company">Company</label>
        <input id="white-paper-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="white-paper-email" className="sr-only">
            Email address
          </label>
          <input
            id="white-paper-email"
            name="email"
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-sm border bg-white border-near-black/10 text-near-black placeholder-stone focus:border-forest px-3 py-2.5 min-h-11 text-sm outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-sm bg-forest px-7 py-3 min-h-11 text-sm font-medium text-white transition-colors hover:bg-deep-forest cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
