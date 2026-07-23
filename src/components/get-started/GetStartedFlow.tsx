"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SECTION_META, type StepId } from "@/data/get-started-meta";
import ConsentStep from "./ConsentStep";
import WelcomeStep from "./WelcomeStep";
import CompletionStep from "./CompletionStep";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";
import Section5 from "./Section5";
import Section6 from "./Section6";
import Section7 from "./Section7";
import { IntakeData, getStr } from "./fields";

const SECTION_COMPONENTS: Record<string, React.ComponentType<{
  data: IntakeData;
  setField: (name: string, value: string | string[]) => void;
  errors: Record<string, string>;
}>> = {
  "1": Section1,
  "2": Section2,
  "3": Section3,
  "4": Section4,
  "5": Section5,
  "6": Section6,
  "7": Section7,
};

const CONTENT_STEPS: StepId[] = ["welcome", "1", "2", "3", "4", "5", "6", "7"];
const AUTOSAVE_DEBOUNCE_MS = 600;

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function GetStartedFlow() {
  const searchParams = useSearchParams();

  const [phase, setPhase] = useState<"loading" | "consent" | "flow" | "complete">("loading");
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<IntakeData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [consentSubmitting, setConsentSubmitting] = useState(false);
  const [consentError, setConsentError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [banner, setBanner] = useState<string>();
  const [showSaveModal, setShowSaveModal] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentStep = CONTENT_STEPS[stepIndex];

  // Load existing draft (session cookie) on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/get-started/session");
        const body = await res.json();
        if (cancelled) return;

        if (body.ok && body.draft) {
          setData(body.draft.data || {});
          if (body.draft.submittedAt) {
            setPhase("complete");
            return;
          }
          const idx = CONTENT_STEPS.indexOf(body.draft.currentStep as StepId);
          setStepIndex(idx >= 0 ? idx : 0);
          setPhase("flow");
          if (searchParams.get("resumed") === "1") {
            setBanner("Welcome back — we've restored your progress.");
          }
        } else {
          setPhase("consent");
          if (searchParams.get("resume_error") === "1") {
            setBanner("That link is invalid or has expired. Please start again below.");
          }
        }
      } catch {
        if (!cancelled) setPhase("consent");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send the respondent back to the top of the page on every step change,
  // so a long section (e.g. the asset table) doesn't leave them scrolled
  // mid-page when the next section loads.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stepIndex, phase]);

  const saveNow = useCallback(async (step: StepId, payload: IntakeData) => {
    setSaveStatus("saving");
    try {
      const email = typeof payload.email === "string" ? payload.email : undefined;
      const res = await fetch("/api/get-started/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, data: payload, email }),
      });
      const body = await res.json();
      setSaveStatus(body.ok ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    }
  }, []);

  function setField(name: string, value: string | string[]) {
    setData((prev) => {
      const next = { ...prev, [name]: value };
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveNow(currentStep, next);
      }, AUTOSAVE_DEBOUNCE_MS);
      return next;
    });
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleConsent() {
    setConsentSubmitting(true);
    setConsentError(undefined);
    try {
      const res = await fetch("/api/get-started/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: true }),
      });
      const body = await res.json();
      if (!body.ok) {
        setConsentError(body.error || "Something went wrong. Please try again.");
        return;
      }
      setData(body.draft?.data || {});
      setPhase("flow");
      setStepIndex(0);
    } catch {
      setConsentError("Something went wrong. Please try again.");
    } finally {
      setConsentSubmitting(false);
    }
  }

  function validateSection1(): boolean {
    const required: [string, string][] = [
      ["first_name", "first name"],
      ["middle_name", "middle name"],
      ["last_name", "last name"],
    ];
    const missing: string[] = [];
    const nextErrors: Record<string, string> = {};
    required.forEach(([name, label]) => {
      if (!getStr(data, name).trim()) {
        missing.push(label);
        nextErrors[name] = "Required";
      }
    });
    setErrors(nextErrors);
    if (missing.length) {
      setBanner(`Please enter your ${missing.join(", ")} before continuing.`);
      return false;
    }
    return true;
  }

  async function goNext() {
    if (currentStep === "1" && !validateSection1()) return;
    setBanner(undefined);

    if (saveTimer.current) clearTimeout(saveTimer.current);
    await saveNow(currentStep, data);

    if (currentStep === "7") {
      await handleSubmit();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, CONTENT_STEPS.length - 1));
  }

  function goBack() {
    setBanner(undefined);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(undefined);
    try {
      const res = await fetch("/api/get-started/submit", { method: "POST" });
      const body = await res.json();
      if (!body.ok) {
        setSubmitError(body.error || "Something went wrong submitting your questionnaire.");
        return;
      }
      setPhase("complete");
    } catch {
      setSubmitError(
        "Something went wrong submitting your questionnaire. Your progress is saved — please try again in a moment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === "loading") {
    return <div className="py-24 text-center text-sm text-stone">Loading…</div>;
  }

  if (phase === "consent") {
    return (
      <div className="mx-auto max-w-[640px] px-6 py-16 sm:py-24">
        {banner && (
          <p role="status" className="mb-6 text-sm text-forest">
            {banner}
          </p>
        )}
        <ConsentStep onAgree={handleConsent} submitting={consentSubmitting} error={consentError} />
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div className="mx-auto max-w-[640px] px-6 py-16 sm:py-24">
        <CompletionStep data={data} />
      </div>
    );
  }

  const isWelcome = currentStep === "welcome";
  const meta = SECTION_META[currentStep];
  const progressPct = isWelcome ? 0 : (stepIndex / (CONTENT_STEPS.length - 1)) * 100;
  const SectionComponent = SECTION_COMPONENTS[currentStep];

  return (
    <div className="pb-28">
      <div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-sm border-b border-near-black/10">
        <div className="mx-auto max-w-[720px] px-6 py-4">
          <p className="text-right text-[11px] uppercase tracking-wide text-stone mb-1.5">
            {isWelcome ? "Welcome" : `Section ${currentStep} of 7`}
          </p>
          <div className="h-[3px] rounded-full bg-warm-gray overflow-hidden">
            <div
              className="h-full bg-forest transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[720px] px-6 py-10">
        {banner && (
          <p role="status" className="mb-6 text-sm text-forest">
            {banner}
          </p>
        )}

        {isWelcome ? (
          <WelcomeStep />
        ) : (
          <>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-forest mb-2">
              Section {currentStep}
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-serif tracking-[-0.5px] text-near-black">
              {meta.title}
            </h2>
            <p className="mt-2 text-sm text-stone max-w-[60ch] mb-8">{meta.subtitle}</p>
            {SectionComponent && <SectionComponent data={data} setField={setField} errors={errors} />}
          </>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-near-black/10 z-30">
        <div className="mx-auto max-w-[720px] px-6 py-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="min-h-11 px-4 text-sm font-medium text-near-black rounded-sm border border-near-black/15 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-warm-gray transition-colors cursor-pointer"
          >
            Back
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-stone">
              {saveStatus === "saving" && "Saving…"}
              {saveStatus === "saved" && "Saved"}
              {saveStatus === "error" && "Couldn't save just now"}
            </span>
            {!isWelcome && (
              <button
                type="button"
                onClick={() => setShowSaveModal(true)}
                className="hidden sm:inline text-xs text-forest hover:text-deep-forest underline min-h-11"
              >
                Save & finish later
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={submitting}
            className="min-h-11 px-6 text-sm font-medium text-white bg-forest rounded-sm hover:bg-deep-forest disabled:opacity-60 transition-colors cursor-pointer"
          >
            {isWelcome ? "Begin" : currentStep === "7" ? (submitting ? "Submitting…" : "Submit") : "Continue"}
          </button>
        </div>
        {submitError && (
          <p role="alert" data-testid="form-error" className="text-center text-xs text-red-700 pb-2">
            {submitError}
          </p>
        )}
      </footer>

      {showSaveModal && (
        <SaveAndResumeModal
          email={getStr(data, "email")}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}

function SaveAndResumeModal({ email: initialEmail, onClose }: { email: string; onClose: () => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string>();

  async function send() {
    setStatus("sending");
    setError(undefined);
    try {
      const res = await fetch("/api/get-started/resume-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: "" }),
      });
      const body = await res.json();
      if (!body.ok) {
        setError(body.error || "Something went wrong sending your link.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Something went wrong sending your link.");
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-near-black/40 px-6">
      <div className="w-full max-w-[420px] rounded-sm bg-white p-6 shadow-lg">
        {status === "sent" ? (
          <>
            <h3 className="text-base font-medium text-near-black">Check your inbox</h3>
            <p className="mt-2 text-sm text-stone">
              We&rsquo;ve sent a link to {email} — click it any time to pick up where you left off.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 min-h-11 px-5 text-sm font-medium text-white bg-forest rounded-sm hover:bg-deep-forest transition-colors cursor-pointer"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h3 className="text-base font-medium text-near-black">Save & finish later</h3>
            <p className="mt-2 text-sm text-stone">
              We&rsquo;ll email you a link to pick up right where you left off.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-4 w-full min-h-11 rounded-sm border border-near-black/15 px-3 py-2.5 text-sm outline-none focus:border-forest"
            />
            {error && (
              <p role="alert" data-testid="form-error" className="mt-2 text-xs text-red-700">
                {error}
              </p>
            )}
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={send}
                disabled={status === "sending" || !email}
                className="min-h-11 px-5 text-sm font-medium text-white bg-forest rounded-sm hover:bg-deep-forest disabled:opacity-60 transition-colors cursor-pointer"
              >
                {status === "sending" ? "Sending…" : "Email me a link"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 px-4 text-sm text-stone hover:text-near-black transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
