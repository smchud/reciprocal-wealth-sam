"use client";

import { useState } from "react";
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
                isOpen ? "max-h-96 pb-5" : "max-h-0"
              }`}
            >
              <p className={`text-sm leading-relaxed ${bodyColor}`}>
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
