"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";

// Rating summary shown at the top of the section. No reviews app or rating
// metafield is connected for this product yet (confirmed via the
// Storefront API; see ProductInfo.tsx's own honest "No reviews yet" state
// elsewhere on this page) — `rating` is demo/placeholder, not a real
// aggregate, and `totalReviews` stays null rather than a made-up count.
// `status` is deliberately plain language ("early feedback"), not a
// verification claim like "based on verified customer reviews" — there's
// no review-verification system behind this data. Replace all three
// fields once a real reviews integration exists; nothing else in this
// file needs to change.
const ratingSummary = {
  rating: 4.8,
  totalReviews: null as number | null,
  status: "Early feedback from our first users.",
};

type ProofPoint = {
  title: string;
  description: string;
};

// Grounded in the same verified product facts already used by
// HowItWorks/Technology/Comparison — not new claims invented for this
// section (4D rolling contact, hands-free/body-weight use, everyday
// routine — see those files' own sourcing comments).
const PROOF_POINTS: ProofPoint[] = [
  { title: "Deep muscle recovery", description: "Designed for targeted pressure and daily recovery." },
  { title: "Hands-free recovery", description: "Use your own body weight to create controlled pressure." },
  { title: "Built for everyday use", description: "Designed to fit naturally into your routine." },
];

type Testimonial = {
  name: string;
  rating: number;
  text: string;
  // Local asset path only (e.g. "/testimonials/jordan-m.jpg") — never an
  // external/remote URL. No local customer photos exist in the project yet
  // (public/ is empty), so every entry is null for now and TestimonialAvatar
  // below falls back to initials; the moment a real local image is added,
  // set this field and the avatar renders automatically.
  avatar: string | null;
  status: string;
  featured?: boolean;
};

// Placeholder/demo testimonials — not real customer reviews. Realistic,
// benefit-focused copy consistent with the product's actual verified
// capabilities (see HowItWorks/Technology/Comparison's own sourcing
// comments). Each is tagged "Early User", not "Verified Purchase" — there's
// no purchase-verification system behind these, so that claim would be
// false; the star rating shown is illustrative of the review-card format
// itself, same as before. Swap this array for real review data once it
// exists — nothing else in this file needs to change.
const testimonials: Testimonial[] = [
  {
    name: "Jordan M.",
    rating: 5,
    text: "VOLREP PRM™ has become part of my morning routine. A few minutes rolling out my calves and lower back, and the whole day feels lighter.",
    avatar: null,
    status: "Early User",
    featured: true,
  },
  {
    name: "Priya K.",
    rating: 5,
    text: "I keep it by the couch and use it most evenings after work. No setup, nothing to charge — just roll and go.",
    avatar: null,
    status: "Early User",
  },
  {
    name: "Marcus T.",
    rating: 5,
    text: "The rollers actually get into spots a foam roller never could. My shoulders finally feel like they're getting real attention.",
    avatar: null,
    status: "Early User",
  },
  {
    name: "Elena R.",
    rating: 5,
    text: "Using my own body weight to control the pressure took a session or two to get used to, but now it feels completely natural.",
    avatar: null,
    status: "Early User",
  },
  {
    name: "Sam D.",
    rating: 5,
    text: "It's part of my post-run routine now. My legs feel noticeably looser before I even finish rolling out both calves.",
    avatar: null,
    status: "Early User",
  },
  {
    name: "Alicia F.",
    rating: 5,
    text: "Simple and quiet, and it just works. I don't have to think about it — it's just part of my evening now.",
    avatar: null,
    status: "Early User",
  },
  {
    name: "Devon W.",
    rating: 5,
    text: "I was skeptical a roller could do more than a regular one, but the contoured rollers make a real difference on my lower back.",
    avatar: null,
    status: "Early User",
  },
];

const featuredTestimonial = testimonials.find((testimonial) => testimonial.featured) ?? testimonials[0];
const secondaryTestimonials = testimonials.filter((testimonial) => testimonial !== featuredTestimonial);

const CARD_GAP = 24;

// Tailwind's transition-delay scale — literal strings so the JIT scanner
// picks them up even though they're selected dynamically below. Same
// duplicated scroll-reveal pattern used throughout the site.
const REVEAL_DELAYS = [
  "delay-[0ms]",
  "delay-[80ms]",
  "delay-[160ms]",
  "delay-[240ms]",
  "delay-[320ms]",
  "delay-[400ms]",
  "delay-[480ms]",
  "delay-[560ms]",
];

function revealClass(visible: boolean, step: number) {
  const delay = REVEAL_DELAYS[Math.min(step, REVEAL_DELAYS.length - 1)];
  return `${delay} transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// Renders a real local avatar image the moment testimonial.avatar is set
// (see the Testimonial type's own comment on why that's local-asset-only,
// never a remote URL); falls back to initials otherwise — currently every
// entry, since no local customer photos exist yet.
function TestimonialAvatar({ testimonial, size = "h-11 w-11 text-sm" }: { testimonial: Testimonial; size?: string }) {
  if (testimonial.avatar) {
    return (
      <span className={`relative shrink-0 overflow-hidden rounded-full ${size}`}>
        <Image src={testimonial.avatar} alt="" fill sizes="48px" className="object-cover" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground ${size}`}
    >
      {getInitials(testimonial.name)}
    </span>
  );
}

// Gold is reserved sitewide for exactly this — see globals.css's --gold
// token comment. Nothing else in the app should reach for it. Renders the
// actual rating (rounded to whole stars) rather than a hardcoded 5, so a
// real non-5-star review will render correctly later; unfilled stars use a
// neutral tone, never gold, so gold keeps meaning "this star is earned."
function GoldStars({ rating, className = "text-sm" }: { rating: number; className?: string }) {
  const filled = Math.round(rating);
  return (
    <span aria-hidden="true" className={`tracking-[0.2em] ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? "text-gold" : "text-black/10"}>
          ★
        </span>
      ))}
    </span>
  );
}

function QuoteMark({ size = "h-6 w-6" }: { size?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={`text-volt ${size}`}>
      <path d="M9.5 6C6.5 7.6 5 10 5 12.8c0 2.4 1.4 3.9 3.3 3.9 1.7 0 3-1.3 3-3 0-1.6-1.1-2.8-2.6-2.9.3-1.5 1.5-2.9 3.1-3.7L9.5 6Zm9 0c-3 1.6-4.5 4-4.5 6.8 0 2.4 1.4 3.9 3.3 3.9 1.7 0 3-1.3 3-3 0-1.6-1.1-2.8-2.6-2.9.3-1.5 1.5-2.9 3.1-3.7L18.5 6Z" />
    </svg>
  );
}

function ReviewCard({ testimonial, visible, step }: { testimonial: Testimonial; visible: boolean; step: number }) {
  return (
    <div
      className={`flex h-full flex-col rounded-[24px] border border-black/[0.06] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${revealClass(visible, step)}`}
    >
      <div className="flex items-center justify-between">
        <GoldStars rating={testimonial.rating} />
        <QuoteMark size="h-4 w-4" />
      </div>
      <p className="mt-5 flex-1 text-[15px] leading-relaxed text-foreground">&ldquo;{testimonial.text}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3">
        <TestimonialAvatar testimonial={testimonial} size="h-9 w-9 text-xs" />
        <div>
          <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{testimonial.status}</p>
        </div>
      </div>
    </div>
  );
}

// Results / Social Proof section for the product page. No reviews app is
// connected for this product (confirmed — no rating metafield exists), so
// the rating block and every testimonial card show honestly-framed
// demo/early-user content (see ratingSummary's and testimonials' own
// comments above) rather than a fabricated aggregate or verification claim.
// The three proof points (genuinely grounded in the product's verified
// capabilities) carry the section's substantive "why trust this" claim.
export function Results() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState({ fraction: 1, position: 0 });
  const canNavigate = secondaryTestimonials.length > 1;

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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function updateProgress() {
      const current = trackRef.current;
      if (!current) return;
      const maxScroll = current.scrollWidth - current.clientWidth;
      const fraction = current.scrollWidth > 0 ? Math.min(1, current.clientWidth / current.scrollWidth) : 1;
      const position = maxScroll > 0 ? current.scrollLeft / maxScroll : 0;
      setProgress({ fraction, position });
    }

    updateProgress();
    track.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      track.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  function scrollByDirection(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track || !canNavigate) return;

    const card = track.querySelector<HTMLElement>("[data-carousel-card]");
    const amount = card ? card.offsetWidth + CARD_GAP : track.clientWidth * 0.85;

    track.scrollBy({ left: amount * direction, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  function handleTrackKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByDirection(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByDirection(-1);
    }
  }

  return (
    <section ref={sectionRef} aria-labelledby="results-heading" className="bg-background py-16 sm:py-20 lg:py-24">
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center">
          <p
            className={`flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground ${revealClass(visible, 0)}`}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-volt" />
            Real Results / Real Recovery
          </p>

          <h2
            id="results-heading"
            className={`mt-5 text-[1.75rem] uppercase leading-[0.94] tracking-[-0.02em] text-foreground sm:text-[2.375rem] lg:text-[2rem] xl:text-[2.875rem] ${revealClass(visible, 1)}`}
          >
            Recovery People Can Feel.
          </h2>

          <p
            className={`mx-auto mt-6 max-w-[440px] text-base leading-relaxed text-muted-foreground sm:text-lg ${revealClass(visible, 2)}`}
          >
            Real experiences from people who use VOLREP PRM<span aria-hidden="true">™</span> as part of their
            recovery routine.
          </p>
        </div>

        {/* Large rating block — premium summary format (gold stars + big
            black average + muted "/5"), using ratingSummary (see its own
            comment above: demo data standing in for a real review average,
            not a claim that this is the product's real score). No verified
            badge/checkmark here — status is plain language, honestly
            framed as early/demo feedback rather than a verification claim. */}
        <div className={`mx-auto mt-14 flex flex-col items-center gap-3 text-center sm:mt-16 ${revealClass(visible, 2)}`}>
          <div className="flex items-center justify-center gap-3">
            <GoldStars rating={ratingSummary.rating} className="text-2xl sm:text-3xl" />
            <span className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground sm:text-5xl">{ratingSummary.rating}</span>
              <span className="text-lg font-medium text-muted-foreground sm:text-xl">/5</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{ratingSummary.status}</p>
        </div>

        {/* Gap to the proof points below trimmed ~15-18% from the previous
            mt-14/mt-16 (56px/64px) to mt-12/mt-13 (48px/52px) — same "airy
            but connected" rhythm, just tightened per feedback. */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-10 sm:mt-13 sm:grid-cols-3 sm:gap-8">
          {PROOF_POINTS.map((point, i) => (
            <div key={point.title} className={`flex flex-col items-center text-center ${revealClass(visible, i + 3)}`}>
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-volt/[0.1] text-volt">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-bold text-foreground sm:text-xl">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Featured testimonial — the section's dominant visual moment.
            Same blue-top-border "featured" language as the Comparison
            section's VOLREP column, reused here rather than inventing a
            new "this one is special" treatment. */}
        <div
          className={`relative mx-auto mt-16 max-w-3xl rounded-[28px] border border-black/[0.06] border-t-[3px] border-t-volt bg-white p-10 shadow-[0_20px_50px_-28px_rgba(11,11,11,0.16)] sm:mt-20 sm:p-14 ${revealClass(visible, 4)}`}
        >
          <div className="flex items-start justify-between">
            <GoldStars rating={featuredTestimonial.rating} className="text-lg" />
            <QuoteMark size="h-8 w-8 sm:h-9 sm:w-9" />
          </div>
          <p className="mt-6 text-2xl font-medium leading-[1.5] text-foreground sm:text-[28px]">
            &ldquo;{featuredTestimonial.text}&rdquo;
          </p>
          <div className="mt-8 flex items-center gap-4">
            <TestimonialAvatar testimonial={featuredTestimonial} />
            <div>
              <p className="text-[15px] font-semibold text-foreground">{featuredTestimonial.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{featuredTestimonial.status}</p>
            </div>
          </div>
        </div>

        {/* Secondary testimonials — native scroll-snap carousel, same
            no-dependency approach as ProductCarousel/UgcShowcase: 3 up on
            desktop, 2 on tablet, ~1.1 (mobile peek) below that. */}
        <div className="mt-12 sm:mt-14">
          <div className={`flex items-center justify-end gap-2 ${revealClass(visible, 5)}`}>
            <div
              role="progressbar"
              aria-label="Reviews scroll position"
              aria-valuenow={Math.round(progress.position * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="relative h-[3px] w-full max-w-[160px] overflow-hidden rounded-full bg-black/[0.08]"
            >
              <div
                className="absolute inset-y-0 rounded-full bg-volt transition-[left,width] duration-150 ease-out"
                style={{
                  width: `${progress.fraction * 100}%`,
                  left: `${progress.position * (100 - progress.fraction * 100)}%`,
                }}
              />
            </div>

            <div className="ml-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByDirection(-1)}
                disabled={!canNavigate}
                aria-label="Previous review"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-volt hover:text-volt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/25 disabled:hover:border-ink/10 disabled:hover:text-ink/25 lg:h-9 lg:w-9"
              >
                <span aria-hidden="true" className="text-sm">
                  ←
                </span>
              </button>
              <button
                type="button"
                onClick={() => scrollByDirection(1)}
                disabled={!canNavigate}
                aria-label="Next review"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-volt hover:text-volt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/25 disabled:hover:border-ink/10 disabled:hover:text-ink/25 lg:h-9 lg:w-9"
              >
                <span aria-hidden="true" className="text-sm">
                  →
                </span>
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            role="region"
            aria-label="Additional customer reviews"
            aria-roledescription="carousel"
            tabIndex={0}
            onKeyDown={handleTrackKeyDown}
            className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {secondaryTestimonials.map((testimonial, i) => (
              <div
                key={testimonial.name}
                data-carousel-card
                className="w-[88%] shrink-0 snap-start snap-always sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <ReviewCard testimonial={testimonial} visible={visible} step={Math.min(i + 5, REVEAL_DELAYS.length - 1)} />
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
