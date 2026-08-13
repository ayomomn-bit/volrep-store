"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

const FILES_BASE = "https://cdn.shopify.com/s/files/1/1010/7476/4088/files";

type PainPoint = {
  title: string;
  description: string;
  span: string;
  image: string;
  objectPosition: string;
};

const PAIN_POINTS: PainPoint[] = [
  {
    title: "Back Recovery",
    description: "Relieve lower back tension after long workdays.",
    span: "lg:col-span-2",
    image: `${FILES_BASE}/Back-recovery.webp`,
    objectPosition: "object-right",
  },
  {
    title: "Neck Relief",
    description: "Ease neck tension built up from long days at a desk.",
    span: "lg:col-span-2",
    image: `${FILES_BASE}/Neck-recovery.webp`,
    objectPosition: "object-right",
  },
  {
    title: "Leg Recovery",
    description: "Support tired legs after training or travel.",
    span: "lg:col-span-2",
    image: `${FILES_BASE}/Leg-recovery.webp`,
    objectPosition: "object-center",
  },
  {
    title: "Shoulder Release",
    description: "Loosen shoulder tension from training and daily strain.",
    span: "lg:col-span-3",
    image: `${FILES_BASE}/Shoulder-recovery.webp`,
    objectPosition: "object-right",
  },
  {
    title: "Foot Massage",
    description: "Give tired feet a moment of relief after a long day.",
    span: "lg:col-span-3",
    image: `${FILES_BASE}/Foot-recovery.webp`,
    objectPosition: "object-center",
  },
];

// Tailwind's transition-delay scale — literal strings so the JIT scanner
// picks them up even though they're selected dynamically below.
const REVEAL_DELAYS = ["delay-0", "delay-100", "delay-200", "delay-300", "delay-500", "delay-700", "delay-1000"];

function revealClass(visible: boolean, step: number) {
  return `${REVEAL_DELAYS[step]} transition-all duration-700 ease-out ${
    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
  }`;
}

export function RecoverEverywhere() {
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
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="recover-everywhere-heading"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 55% at 50% 0%, var(--muted), transparent 70%)" }}
      />

      <Container className="relative">
        <div className={`mx-auto max-w-xl text-center ${revealClass(visible, 0)}`}>
          <h2
            id="recover-everywhere-heading"
            className="text-4xl uppercase leading-[0.95] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-6xl"
          >
            <span className="inline-flex items-center gap-3">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-volt" />
              Recover
            </span>
            <br />
            Everywhere.
          </h2>

          <p className={`mt-5 text-sm text-muted-foreground sm:text-base ${revealClass(visible, 1)}`}>
            Professional recovery designed for every part of your body.
          </p>
        </div>

        <div className="mt-10 max-w-full sm:mt-12 lg:mt-14">
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid lg:grid-cols-6 lg:gap-6">
            {PAIN_POINTS.map((point, i) => (
              <Link
                key={point.title}
                href="/products/volrep-prm"
                className={`group relative block h-[430px] w-[85%] shrink-0 snap-center overflow-hidden rounded-sm bg-ink transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-16px_rgba(11,11,11,0.35),0_0_40px_-12px_rgba(54,143,253,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-[380px] sm:w-auto sm:shrink sm:snap-align-none lg:h-[420px] ${point.span} ${revealClass(visible, Math.min(i + 2, REVEAL_DELAYS.length - 1))}`}
              >
                <Image
                  src={point.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
                  className={`object-cover ${point.objectPosition} transition-transform duration-500 ease-out group-hover:scale-[1.08]`}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p className="text-xl font-semibold tracking-tight text-paper transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:text-2xl">
                    {point.title}
                  </p>
                  <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-paper/70">{point.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-paper">
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-500 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                    Explore
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
