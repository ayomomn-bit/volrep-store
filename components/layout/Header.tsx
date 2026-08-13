"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_LINKS } from "@/lib/navigation";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function CartIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M3.5 5h2l.7 3M6.2 8l1.6 8.2a1.5 1.5 0 0 0 1.47 1.3h7.6a1.5 1.5 0 0 0 1.47-1.2L19.8 8H6.2Z" />
      <circle cx="10" cy="20" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Cart has no backing state yet (no add-to-cart flow exists anywhere in the
// app). This stays a plain constant rather than useState so the badge is
// structurally correct — it renders only when count > 0 — without faking
// interactivity that isn't wired to anything.
const CART_ITEM_COUNT = 0;

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[#ECECEC] bg-white transition-shadow duration-300 ease-out ${
        scrolled ? "shadow-[0_2px_10px_rgba(0,0,0,0.05)]" : "shadow-none"
      }`}
    >
      <Container>
        <div className="grid h-[60px] grid-cols-3 items-center lg:h-[72px]">
          {/* Left: hamburger (<1024px) / logo (≥1024px) */}
          <div className="flex items-center justify-self-start">
            <MobileNav />
            <Link
              href="/"
              aria-label="VOLREP home"
              className={`hidden font-heading text-xl font-bold tracking-tight text-ink lg:inline-flex ${FOCUS_RING} rounded-sm`}
            >
              VOLREP<span aria-hidden="true">™</span>
            </Link>
          </div>

          {/* Center: logo (<1024px) / nav (≥1024px) */}
          <div className="flex items-center justify-self-center">
            <Link
              href="/"
              aria-label="VOLREP home"
              className={`font-heading text-lg font-bold tracking-tight text-ink lg:hidden ${FOCUS_RING} rounded-sm`}
            >
              VOLREP<span aria-hidden="true">™</span>
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-9">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`group relative inline-flex rounded-sm py-2 text-[15px] font-medium tracking-[0.02em] text-ink/70 transition-colors duration-200 ease-out hover:text-ink focus-visible:text-ink ${FOCUS_RING}`}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right: cart */}
          <div className="flex items-center justify-self-end">
            <Link
              href="/products/volrep-prm"
              aria-label={CART_ITEM_COUNT > 0 ? `Cart, ${CART_ITEM_COUNT} items` : "Cart"}
              className={`relative flex h-11 w-11 items-center justify-center rounded-sm text-ink transition-colors duration-200 ease-out hover:text-volt ${FOCUS_RING}`}
            >
              <CartIcon className="h-[22px] w-[22px] lg:h-6 lg:w-6" />
              {CART_ITEM_COUNT > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute right-1.5 top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold leading-none text-white"
                >
                  {CART_ITEM_COUNT}
                </span>
              )}
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
