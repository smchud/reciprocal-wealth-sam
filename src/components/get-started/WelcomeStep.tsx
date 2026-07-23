"use client";

export default function WelcomeStep() {
  return (
    <div>
      <h1 className="text-[28px] sm:text-[32px] font-serif tracking-[-0.5px] text-near-black leading-tight">
        About You
      </h1>
      <p className="mt-4 text-sm text-near-black leading-relaxed max-w-[56ch]">
        Helping us understand you, your goals, and how we can serve you best.
      </p>

      <div className="mt-6 rounded-r-sm border-l-[3px] border-forest bg-warm-gray/60 p-5 text-sm text-near-black leading-relaxed max-w-[60ch]">
        <p>
          This takes about 15 minutes. There are no right or wrong answers — your honest responses help us build a
          portfolio that fits your life, not a generic one. Anything you&rsquo;re unsure about, leave blank and flag
          it; we&rsquo;ll walk through it together.
        </p>
        <p className="mt-3">
          If it makes sense to move forward after we talk, the next step is an advisory agreement to sign — nothing
          here commits you to that.
        </p>
        <p className="mt-3">
          You can save your progress and finish later any time — we&rsquo;ll email you a link to pick up right where
          you left off.
        </p>
        <p className="mt-3">
          Everything you share is held in strict confidence under our fiduciary duty to you.
        </p>
      </div>
    </div>
  );
}
