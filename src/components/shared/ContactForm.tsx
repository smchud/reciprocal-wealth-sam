"use client";

import { useState } from "react";

interface ContactFormProps {
  theme?: "light" | "dark";
}

export default function ContactForm({ theme = "light" }: ContactFormProps) {
  const [clientType, setClientType] = useState("");
  const [hearAbout, setHearAbout] = useState("");

  const isDark = theme === "dark";
  const inputClasses = isDark
    ? "bg-white/5 border-white/15 text-white placeholder-white/40 focus:border-forest-50"
    : "bg-white border-near-black/10 text-near-black placeholder-stone focus:border-forest";

  const labelClasses = isDark
    ? "text-white/70"
    : "text-near-black";

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${labelClasses}`}>
            Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            className={`w-full rounded-sm border px-3 py-2.5 text-sm outline-none transition-colors ${inputClasses}`}
          />
        </div>
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${labelClasses}`}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className={`w-full rounded-sm border px-3 py-2.5 text-sm outline-none transition-colors ${inputClasses}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${labelClasses}`}>
            Phone
          </label>
          <input
            type="tel"
            placeholder="(617) 555-0000"
            className={`w-full rounded-sm border px-3 py-2.5 text-sm outline-none transition-colors ${inputClasses}`}
          />
        </div>
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${labelClasses}`}>
            New or Existing Client
          </label>
          <select
            value={clientType}
            onChange={(e) => setClientType(e.target.value)}
            className={`w-full rounded-sm border px-3 py-2.5 text-sm outline-none transition-colors cursor-pointer ${inputClasses}`}
          >
            <option value="">Select one</option>
            <option value="new">New Client</option>
            <option value="existing">Existing Client</option>
          </select>
        </div>
      </div>

      {clientType === "new" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${labelClasses}`}>
              How did you hear about us?
            </label>
            <select
              value={hearAbout}
              onChange={(e) => setHearAbout(e.target.value)}
              className={`w-full rounded-sm border px-3 py-2.5 text-sm outline-none transition-colors cursor-pointer ${inputClasses}`}
            >
              <option value="">Select one</option>
              <option value="search">Internet search</option>
              <option value="referral">Referral</option>
              <option value="other">Other</option>
            </select>
          </div>
          {hearAbout === "referral" && (
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${labelClasses}`}>
                Who referred you?
              </label>
              <input
                type="text"
                placeholder="Referral name"
                className={`w-full rounded-sm border px-3 py-2.5 text-sm outline-none transition-colors ${inputClasses}`}
              />
            </div>
          )}
        </div>
      )}

      <div>
        <label className={`block text-xs font-medium mb-1.5 ${labelClasses}`}>
          Question or Comment
        </label>
        <textarea
          rows={4}
          placeholder="How can we help?"
          className={`w-full rounded-sm border px-3 py-2.5 text-sm outline-none transition-colors resize-none ${inputClasses}`}
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-sm bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-deep-forest cursor-pointer"
      >
        Send Message
      </button>
    </form>
  );
}
