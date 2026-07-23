"use client";

import { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { PRIORITIES_LABELS, TIME_HORIZON_LABELS } from "@/data/get-started-meta";
import { IntakeData, getArr, getStr } from "./fields";

export default function CompletionStep({ data }: { data: IntakeData }) {
  const [path, setPath] = useState<"none" | "advisor" | "altruist">("none");

  const firstName = getStr(data, "first_name") || "there";
  const priorities = getArr(data, "priorities").map((v) => PRIORITIES_LABELS[v] || v);
  const topGoal = getStr(data, "top_goal").trim();
  const timeHorizon = TIME_HORIZON_LABELS[getStr(data, "time_horizon")];
  const majorExpenditures = getStr(data, "major_expenditures").trim();

  const hasRecap = priorities.length > 0 || topGoal || timeHorizon || majorExpenditures;

  return (
    <div>
      <h2 className="text-[26px] sm:text-[30px] font-light tracking-[-0.5px] text-near-black leading-tight">
        Thank you, {firstName}.
      </h2>
      <p className="mt-3 text-sm text-stone leading-relaxed max-w-[56ch]">
        We&rsquo;ve received your answers. Here&rsquo;s a quick recap of what you told us.
      </p>

      {hasRecap && (
        <div className="mt-6 rounded-sm border border-near-black/10 bg-warm-gray/50 p-5 space-y-3 text-sm text-near-black">
          {priorities.length > 0 && (
            <p>
              <span className="font-medium">Priorities:</span> {priorities.join(", ")}
            </p>
          )}
          {topGoal && (
            <p>
              <span className="font-medium">Most important goal:</span> {topGoal}
            </p>
          )}
          {timeHorizon && (
            <p>
              <span className="font-medium">Time horizon:</span> {timeHorizon}
            </p>
          )}
          {majorExpenditures && (
            <p>
              <span className="font-medium">Upcoming major expenditures:</span> {majorExpenditures}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 text-sm text-near-black leading-relaxed max-w-[56ch]">
        <p>We&rsquo;ll review your full responses together at our first meeting.</p>
        <p className="mt-2">
          Reciprocal Wealth will review your answers and reach out within two business days to schedule a first
          meeting.
        </p>
      </div>

      <h3 className="mt-8 text-base font-medium text-near-black">What would you like to do next?</h3>
      <div className="mt-4 grid gap-3">
        <button
          type="button"
          onClick={() => setPath("advisor")}
          className="text-left rounded-sm border border-near-black/15 bg-white p-5 hover:border-deep-forest transition-colors cursor-pointer"
        >
          <h4 className="text-sm font-medium text-near-black">Have Reciprocal Wealth reach out</h4>
          <p className="mt-1 text-sm text-stone">
            We&rsquo;ll review your responses, come prepared with thoughts and questions, and reach out within two
            business days to schedule a first meeting.
          </p>
        </button>

        <a
          href={siteConfig.altruistPortalUrl}
          onClick={() => setPath("altruist")}
          className="rounded-sm border border-near-black/15 bg-white p-5 hover:border-deep-forest transition-colors block"
        >
          <h4 className="text-sm font-medium text-near-black">I&rsquo;m ready — proceed to onboarding</h4>
          <p className="mt-1 text-sm text-stone">
            Continue to Altruist to open your accounts.
          </p>
        </a>
      </div>

      {path === "advisor" && (
        <p role="status" className="mt-4 text-sm text-forest">
          Thank you. We&rsquo;ll review your responses and be in touch within two business days.
        </p>
      )}
    </div>
  );
}
