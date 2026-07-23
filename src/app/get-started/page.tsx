import type { Metadata } from "next";
import { Suspense } from "react";
import GetStartedFlow from "@/components/get-started/GetStartedFlow";

const description =
  "Tell us about your goals, finances, and how you think about risk so we can prepare for your first meeting.";

export const metadata: Metadata = {
  title: "Become a Client",
  description,
  openGraph: { title: "Become a Client", description, images: ["/images/og-default.png"] },
};

export default function GetStartedPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-stone">Loading…</div>}>
      <GetStartedFlow />
    </Suspense>
  );
}
