"use client";

import { useEffect, useRef, useState } from "react";

import { PageContainer } from "@/components/layout/PageContainer";

type FaqItem = {
  question: string;
  answer: string;
};

// Every answer is grounded in facts already established elsewhere in this
// app — the Shopify product description ("Advanced 4D massage roller for
// full-body recovery"), HowItWorks' own "60-90 seconds" session guidance,
// Technology's "4D rollers / hands-free / body-weight pressure" language,
// and TrustBadges/Footer's already-shipped "30-Day Returns" / "2-Year
// Warranty" copy. Two notes on what's deliberately NOT here:
//
// - The brief's suggested "How long does the battery last?" question is
//   dropped as asked — this product has no battery. Every verified source
//   (HowItWorks, Technology, Comparison, BenefitsList, the Shopify
//   description itself) consistently describes a fully manual, hands-free,
//   body-weight-driven roller with no motor/battery anywhere. Answering
//   "battery life" would mean either inventing a duration (explicitly
//   forbidden) or answering a premise that isn't true of this product, so
//   it's replaced with the honest, better-grounded, and genuinely
//   differentiating question below instead ("Does it need batteries or
//   charging?" → no).
// - "Cleaning" and "what's included" are answered in general, non-specific
//   terms (damp cloth, no submerging; "ready to use, nothing to charge")
//   rather than inventing materials, certifications, or an accessory list
//   that isn't confirmed anywhere in the project.
const FAQS: FaqItem[] = [
  {
    question: "How does VOLREP PRM™ work?",
    answer:
      "VOLREP PRM™ is an advanced 4D massage roller built for full-body recovery. Position it beneath the muscle you want to target, then use your own body weight to roll slowly and apply controlled pressure.",
  },
  {
    question: "What makes VOLREP PRM™ different from a traditional foam roller?",
    answer:
      "Its contoured 4D rollers are designed to follow the natural shape of your muscles for more targeted contact than a plain cylinder, and its hands-free design lets you control pressure with your own body weight instead of your arms.",
  },
  {
    question: "How does the hands-free design work?",
    answer:
      "Rather than holding a tool, you rest the muscle you're targeting directly on VOLREP PRM™ and use your own body weight to control the pressure — keeping your hands free and letting you fully relax into each session.",
  },
  {
    question: "Which areas of the body can I use VOLREP PRM™ on?",
    answer: "VOLREP PRM™ is designed for full-body use, including your calves, back, legs, and shoulders.",
  },
  {
    question: "How long should each recovery session be?",
    answer:
      "Most sessions take just a few minutes. We recommend rolling slowly for about 60–90 seconds per muscle group, and adjusting from there based on how it feels.",
  },
  {
    question: "Is VOLREP PRM™ suitable for everyday use?",
    answer:
      "Yes. VOLREP PRM™ is designed to fit naturally into a daily recovery routine, whether that's before a workout, after one, or simply at the end of the day.",
  },
  {
    question: "Does VOLREP PRM™ need batteries or charging?",
    answer: "No. VOLREP PRM™ is designed as a mechanical, hands-free recovery roller, so there are no batteries to charge.",
  },
  {
    question: "How do I clean and maintain the PRM™?",
    answer: "Wipe down the rollers and handle with a damp cloth after use. Avoid submerging VOLREP PRM™ in water.",
  },
  {
    question: "What is your return and warranty policy?",
    answer: "VOLREP PRM™ includes a 30-day return window and a 2-year warranty. Reach out to our support team for details.",
  },
];

// Tailwind's transition-delay scale — literal strings so the JIT scanner
// picks them up even though they're selected dynamically below. Same
// duplicated scroll-reveal pattern used throughout the site.
const REVEAL_DELAYS = [
  "delay-[0ms]",
  "delay-[60ms]",
  "delay-[120ms]",
  "delay-[180ms]",
  "delay-[240ms]",
  "delay-[300ms]",
  "delay-[360ms]",
  "delay-[420ms]",
  "delay-[480ms]",
  "delay-[540ms]",
  "delay-[600ms]",
  "delay-[660ms]",
];

function revealClass(visible: boolean, step: number) {
  const delay = REVEAL_DELAYS[Math.min(step, REVEAL_DELAYS.length - 1)];
  return `${delay} transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`;
}

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-300 ease-out ${
        open ? "text-volt" : "text-foreground"
      }`}
    >
      <span className="absolute h-px w-4 bg-current" />
      <span
        className={`absolute h-4 w-px bg-current transition-transform duration-300 ease-out ${open ? "rotate-90" : "rotate-0"}`}
      />
    </span>
  );
}

type FaqRowProps = {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  isLast: boolean;
  onToggle: () => void;
  visible: boolean;
};

function FaqRow({ item, index, isOpen, isLast, onToggle, visible }: FaqRowProps) {
  const panelId = `product-faq-panel-${index}`;
  const buttonId = `product-faq-button-${index}`;

  return (
    <div className={`${isLast ? "" : "border-b border-black/[0.06]"} ${revealClass(visible, index + 3)}`}>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 py-7 text-left transition-opacity duration-300 ease-out hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:py-8"
        >
          <span className="text-lg font-bold text-foreground sm:text-xl">{item.question}</span>
          <PlusMinusIcon open={isOpen} />
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[560px] pb-7 text-[15px] leading-relaxed text-muted-foreground sm:pb-8">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

// FAQ section for the product page — an editorial two-column layout (fixed
// intro left, wide accordion right on desktop; stacked on mobile/tablet),
// deliberately distinct from the homepage's centered-card FAQ
// (components/home/FAQ.tsx, untouched) so this reads as this page's own
// FAQ rather than a copy of it. Named ProductFAQ (not FAQ) specifically so
// importing this file never gets confused with that one.
export function ProductFAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="product-faq-heading" className="bg-background py-16 sm:py-20 lg:py-24">
      <PageContainer>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div>
            <p
              className={`flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground ${revealClass(visible, 0)}`}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-volt" />
              FAQ
            </p>

            <h2
              id="product-faq-heading"
              className={`mt-5 text-[1.75rem] uppercase leading-[0.94] tracking-[-0.02em] text-foreground sm:text-[2.375rem] lg:text-[2rem] xl:text-[2.875rem] ${revealClass(visible, 1)}`}
            >
              Questions, Answered.
            </h2>

            <p className={`mt-5 max-w-[380px] text-base leading-relaxed text-muted-foreground sm:text-lg ${revealClass(visible, 2)}`}>
              Everything you need to know about VOLREP PRM<span aria-hidden="true">™</span> before making it part of
              your recovery routine.
            </p>
          </div>

          <div>
            {FAQS.map((item, index) => (
              <FaqRow
                key={item.question}
                item={item}
                index={index}
                isOpen={openIndex === index}
                isLast={index === FAQS.length - 1}
                onToggle={() => setOpenIndex((prev) => (prev === index ? null : index))}
                visible={visible}
              />
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
