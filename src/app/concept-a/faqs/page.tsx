import FadeIn from "@/components/shared/FadeIn";
import SectionLabel from "@/components/shared/SectionLabel";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { faqs } from "@/data/faqs";

export default function FAQsA() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-[720px]">
          <SectionLabel>FAQs</SectionLabel>
          <h1 className="mt-4 text-[32px] md:text-[36px] font-light tracking-[-1px] text-near-black leading-tight">
            Frequently asked questions
          </h1>
          <p className="mt-5 text-base text-stone leading-relaxed">
            Straightforward answers to the things people ask most.
          </p>
          <FadeIn className="mt-12">
            <FAQAccordion faqs={faqs} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
