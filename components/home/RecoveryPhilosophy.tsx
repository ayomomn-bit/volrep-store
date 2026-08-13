"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

const BACKGROUND_URL =
  "https://cdn.shopify.com/s/files/1/1010/7476/4088/files/VOLREP-Section-3-Background.webp?v=1786449309";

// Tailwind's transition-delay scale — literal strings so the JIT scanner
// picks them up even though they're selected dynamically below.
const REVEAL_DELAYS = ["delay-0", "delay-100", "delay-200", "delay-300"];

function revealClass(visible: boolean, step: number) {
  return `${REVEAL_DELAYS[step]} transition-all duration-700 ease-out ${
    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
  }`;
}

// The source photo is wide (~1.87:1) and only roughly matches this
// section's own aspect at desktop heights — at mobile/tablet heights the
// section is much narrower than the photo, so object-cover crops in hard.
// object-position is shifted per breakpoint to keep the person + VOLREP PRM
// (positioned right-of-center in the source) in frame rather than centering
// blindly and risking cropping the subject out.
export function RecoveryPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="recovery-philosophy-heading"
      className="relative isolate mx-4 flex h-[600px] items-start overflow-hidden rounded-[20px] bg-ink pt-14 sm:mx-6 sm:h-[650px] sm:items-center sm:pt-0 lg:mx-0 lg:h-[760px] lg:rounded-none"
    >
      <Image
        src={BACKGROUND_URL}
        alt="A person using the VOLREP PRM™ during a recovery session at home"
        fill
        sizes="100vw"
        className="recovery-bg-zoom object-cover object-[60%_38%] sm:object-[65%_center] lg:object-center"
      />

      {/* Exact overlay recipe: rgba(0,0,0,.72) → .45 → .15 → transparent,
          left to right — improves contrast without visibly darkening the
          photo (its own left third is already a clean, dark wall). */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.72), rgba(0,0,0,0.45), rgba(0,0,0,0.15), transparent)",
        }}
      />

      <Container className="relative z-10">
        <div className="max-w-[420px]">
          <p
            className={`flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-paper/70 ${revealClass(visible, 0)}`}
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-volt" />
            VOLREP<span aria-hidden="true">™</span> / Recovery
          </p>

          <h2
            id="recovery-philosophy-heading"
            className={`mt-5 text-4xl uppercase leading-[0.92] tracking-[-0.035em] text-paper sm:text-5xl lg:text-6xl ${revealClass(visible, 1)}`}
          >
            Recovery isn&apos;t
            <br />
            an afterthought.
          </h2>

          <p
            className={`mt-6 max-w-[420px] text-base leading-relaxed text-paper/75 sm:text-lg ${revealClass(visible, 2)}`}
          >
            It&apos;s part of how you move, train, work, and live every day.
          </p>

          <div className={`mt-8 ${revealClass(visible, 3)}`}>
            <Link
              href="/products/volrep-prm"
              className="group relative inline-flex w-fit items-center gap-2 rounded-sm text-sm font-medium text-paper transition-colors duration-300 ease-out hover:text-volt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Explore Recovery
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
