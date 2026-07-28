"use client";

import { useState } from "react";
import Link from "next/link";

export default function ConsentStep({
  onAgree,
  submitting,
  error,
}: {
  onAgree: () => void;
  submitting: boolean;
  error?: string;
}) {
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <h1 className="text-[28px] sm:text-[32px] font-serif tracking-[-0.5px] text-near-black leading-tight">
        Before we start
      </h1>
      <p className="mt-4 text-sm text-stone leading-relaxed max-w-[60ch]">
        This questionnaire asks about your family, career, finances, goals, and how you think about risk, so we can
        get to know you before your first meeting.
      </p>

      <div className="mt-6 space-y-4 text-sm text-near-black leading-relaxed max-w-[60ch]">
        <div>
          <p className="font-medium">What we collect</p>
          <p className="mt-1 text-stone">
            Contact details, household and family information, career and income, an approximate picture of your
            assets and liabilities, your goals, and your attitudes toward risk and working with an advisor. We never
            ask for Social Security numbers, government ID numbers, account numbers, or account login credentials on
            this site — that information is collected securely later, during account opening.
          </p>
        </div>
        <div>
          <p className="font-medium">How it&apos;s used</p>
          <p className="mt-1 text-stone">
            Solely to prepare for your first meeting and, if you choose to move forward, to help build a financial
            plan and portfolio suited to your situation. It is not sold or shared for marketing purposes.
          </p>
        </div>
        <div>
          <p className="font-medium">Your progress</p>
          <p className="mt-1 text-stone">
            Nothing is saved until you agree below. After that, your answers are saved automatically as you go, and
            you can pick up later from an emailed link.
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-stone">
        See our{" "}
        <Link href="/privacy-policy" className="text-forest hover:text-deep-forest underline">
          Privacy Policy
        </Link>{" "}
        for the full detail on how we handle personal information.
      </p>

      <label className="mt-6 flex items-start gap-3 rounded-sm border border-near-black/15 bg-warm-gray/50 p-4 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-0.5 accent-deep-forest"
        />
        <span className="text-sm text-near-black">
          I have read the above and agree to Reciprocal Wealth collecting and storing this information as
          described.
        </span>
      </label>

      {error && (
        <p role="alert" data-testid="form-error" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={!checked || submitting}
        onClick={onAgree}
        className="mt-6 inline-flex items-center justify-center min-h-11 rounded-sm bg-forest px-6 text-sm font-medium text-white transition-colors hover:bg-deep-forest disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {submitting ? "Starting…" : "I agree, continue"}
      </button>
    </div>
  );
}
