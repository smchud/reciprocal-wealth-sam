"use client";

import { useState } from "react";
import Link from "next/link";
import type { FAQ } from "@/data/faqs";

interface FAQAccordionProps {
  faqs: FAQ[];
  theme?: "light" | "dark";
}

export default function FAQAccordion({
  faqs,
  theme = "light",
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const borderColor =
    theme === "dark" ? "border-white/15" : "border-near-black/10";
  const textColor = theme === "dark" ? "text-white" : "text-near-black";
  const bodyColor = theme === "dark" ? "text-white/70" : "text-stone";

  return (
    <div className={`divide-y ${borderColor}`}>
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className={`border-t ${borderColor}`}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className={`flex w-full items-center justify-between py-5 text-left cursor-pointer ${textColor}`}
            >
              <span className="text-base font-medium pr-8">{faq.question}</span>
              <span
                className={`text-lg transition-transform duration-200 flex-shrink-0 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-[1200px] pb-5" : "max-h-0"
              }`}
            >
              {Array.isArray(faq.answer) &&
                faq.answer.slice(0, -1).map((paragraph, pi) => (
                  <p
                    key={pi}
                    className={`text-sm leading-relaxed mb-3 ${bodyColor}`}
                  >
                    {paragraph}
                  </p>
                ))}
              <p className={`text-sm leading-relaxed ${bodyColor}`}>
                {Array.isArray(faq.answer)
                  ? faq.answer[faq.answer.length - 1]
                  : faq.answer}
                {faq.answerLink && (
                  <>
                    {faq.answerLink.prefix
                      ? ` ${faq.answerLink.prefix} `
                      : " "}
                    <a
                      href={faq.answerLink.href}
                      {...(faq.answerLink.href.startsWith("mailto:") ||
                      faq.answerLink.href.startsWith("/")
                        ? {}
                        : { target: "_blank", rel: "noopener noreferrer" })}
                      className="text-forest hover:text-deep-forest underline transition-colors"
                    >
                      {faq.answerLink.label}
                      {faq.answerLink.srText && (
                        <span className="sr-only">{faq.answerLink.srText}</span>
                      )}
                    </a>
                    {faq.answerLink.suffix}
                  </>
                )}
              </p>
              {faq.cta && (
                <Link
                  href={faq.cta.href}
                  className="mt-3 inline-flex items-center min-h-11 text-sm font-medium text-forest hover:text-deep-forest transition-colors"
                >
                  {faq.cta.label} &rarr;
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
