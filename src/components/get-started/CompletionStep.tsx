"use client";

import { PRIORITIES_LABELS, TIME_HORIZON_LABELS } from "@/data/get-started-meta";
import { IntakeData, getArr, getStr } from "./fields";

export default function CompletionStep({ data }: { data: IntakeData }) {
  const firstName = getStr(data, "first_name") || "there";
  const rawPriorities = getArr(data, "priorities");
  const priorities = rawPriorities.map((v) => PRIORITIES_LABELS[v] || v);
  const topGoal = rawPriorities.length > 0 ? PRIORITIES_LABELS[rawPriorities[0]] || rawPriorities[0] : "";
  const timeHorizon = TIME_HORIZON_LABELS[getStr(data, "time_horizon")];
  const majorExpenditures = getStr(data, "major_expenditures").trim();

  const hasRecap = priorities.length > 0 || topGoal || timeHorizon || majorExpenditures;

  return (
    <div>
      <h2 className="text-[26px] sm:text-[30px] font-serif tracking-[-0.5px] text-near-black leading-tight">
        Thank you, {firstName}.
      </h2>
      <p className="mt-3 text-sm text-stone leading-relaxed max-w-[56ch]">
        We&rsquo;ve received your answers. Here&rsquo;s a quick recap of what you told us.
      </p>

      {hasRecap && (
        <div className="mt-6 rounded-sm border border-near-black/10 bg-warm-gray/50 p-5 space-y-3 text-sm text-near-black">
          {priorities.length > 0 && (
            <p>
              <span className="font-medium">Priorities (in order of importance):</span> {priorities.join(", ")}
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

      <h3 className="mt-8 text-base font-medium text-near-black">What happens next</h3>
      <div className="mt-4 space-y-3 text-sm text-near-black leading-relaxed max-w-[56ch]">
        <p>
          After we review your questionnaire, we&rsquo;ll reach out — usually within two business days — to begin
          onboarding.
        </p>
        <p>
          From there, you&rsquo;ll receive two separate items from us: an account-opening invitation, and the
          advisory agreement to review and e-sign.
        </p>
        <p>Your Form ADV brochure is provided and acknowledged as part of account opening.</p>
      </div>
    </div>
  );
}
