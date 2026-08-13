"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/layout/Container";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Testimonial = {
  name: string;
  quote: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Michael R.",
    quote:
      "The best recovery tool I've ever owned. I use it after every workout and my recovery has never felt better.",
  },
  {
    name: "Sarah K.",
    quote: "I used to wake up with back pain almost every morning. After using VOLREP daily, the difference is incredible.",
  },
  {
    name: "Daniel T.",
    quote: "The build quality is premium, it's quiet, powerful, and became part of my daily routine.",
  },
];

type TrustItem = {
  value: string;
  label: string;
};

const TRUST_ITEMS: TrustItem[] = [
  { value: "95,000+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "30-Day", label: "Money Back Guarantee" },
  { value: "2-Year", label: "Warranty" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const trustLogosRef = useRef<HTMLDivElement>(null);
  const trustWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 80%" },
        });
      }

      const cards = gsap.utils.toArray<HTMLElement>(".testimonial-card");
      if (cards.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 32,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          // GSAP's inline styles otherwise outrank the CSS hover:-translate-y-2
          // utility indefinitely (inline beats class specificity), so the lift
          // would silently stop working the moment a card finishes revealing.
          // clearProps hands the property back to CSS once the tween is done;
          // the transition-transform class (added here, not up front) keeps
          // that hand-off from fighting this reveal tween's own inline writes.
          clearProps: "all",
          onComplete: () => cards.forEach((card) => card.classList.add("transition-transform")),
          scrollTrigger: { trigger: cardsWrapperRef.current, start: "top 85%" },
        });
      }

      if (trustLogosRef.current) {
        gsap.from(trustLogosRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: trustLogosRef.current, start: "top 90%" },
        });
      }

      const trustItems = gsap.utils.toArray<HTMLElement>(".trust-item");
      if (trustItems.length) {
        gsap.from(trustItems, {
          opacity: 0,
          y: 18,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: trustWrapperRef.current, start: "top 90%" },
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} aria-labelledby="testimonials-heading" className="relative bg-background py-16 sm:py-20 lg:py-24">
      <Container>
        <div ref={headerRef} className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-volt" />
            VOLREP<span aria-hidden="true">™</span> / Reviews
          </p>

          <h2
            id="testimonials-heading"
            className="mt-5 text-5xl uppercase leading-[0.9] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-7xl"
          >
            Loved by Athletes.
            <br />
            Trusted Every Day.
          </h2>

          <p className="mx-auto mt-8 max-w-[600px] text-sm text-muted-foreground sm:text-base">
            Join thousands of people who use VOLREP to recover faster, reduce muscle tension, and feel better every
            day.
          </p>

          <div className="mt-9 flex flex-col items-center gap-2">
            <span aria-hidden="true" className="text-lg tracking-[0.2em] text-foreground">
              ★★★★★
            </span>
            <span className="sr-only">Rated 4.9 out of 5 stars</span>
            <span className="text-sm font-semibold text-foreground">4.9/5 Rating</span>
            <span className="text-xs text-muted-foreground">Based on 2,000+ verified customers</span>
          </div>
        </div>

        <div ref={cardsWrapperRef} className="mt-10 sm:mt-12 lg:mt-14">
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="testimonial-card flex min-h-[420px] w-full shrink-0 snap-center flex-col rounded-[24px] border border-black/[0.06] bg-white p-10 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-[box-shadow,border-color] duration-[350ms] ease-out hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)] sm:w-[47%] lg:min-h-[400px] lg:w-auto lg:shrink lg:snap-align-none"
              >
                <div
                  aria-hidden="true"
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-black/[0.06] bg-muted text-base font-semibold text-muted-foreground lg:h-16 lg:w-16 lg:text-sm"
                >
                  {getInitials(testimonial.name)}
                </div>

                <span aria-hidden="true" className="mt-6 text-base tracking-[0.2em] text-foreground">
                  ★★★★★
                </span>
                <span className="sr-only">Rated 5 out of 5 stars</span>

                <p className="mt-6 max-w-[38ch] text-xl font-medium leading-[1.6] text-foreground lg:text-[18px] lg:leading-[1.65]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="mt-auto pt-8">
                  <p className="text-[16px] font-semibold text-foreground">{testimonial.name}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Verified Customer
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={trustLogosRef} className="mt-12 flex flex-col items-center gap-3 text-center sm:mt-14">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-sm tracking-[0.15em] text-foreground">
              ★★★★★
            </span>
            <span className="text-sm font-semibold text-foreground">4.9/5</span>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Trusted by</p>
          <p className="text-sm text-muted-foreground">
            Athletes<span aria-hidden="true" className="mx-2 text-muted-foreground/50">•</span>
            Physiotherapists<span aria-hidden="true" className="mx-2 text-muted-foreground/50">•</span>
            Personal Trainers
          </p>
        </div>

        <div ref={trustWrapperRef} className="mt-12 grid grid-cols-2 gap-y-12 sm:mt-14 lg:grid-cols-4 lg:gap-y-0">
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={item.label}
              className={`trust-item flex flex-col items-center px-6 text-center ${i > 0 ? "lg:border-l lg:border-black/[0.06]" : ""}`}
            >
              <span className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">{item.value}</span>
              <span className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
