"use client";

import { Button } from "@/components/ui/Button";

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px] shrink-0"
      aria-hidden="true"
    >
      <path d="M3 4h2l1.4 11.2a1.5 1.5 0 0 0 1.5 1.3h9.2a1.5 1.5 0 0 0 1.48-1.24L20 8H6" />
      <circle cx="10" cy="20.5" r="1.25" />
      <circle cx="17" cy="20.5" r="1.25" />
    </svg>
  );
}

// No cart system exists in the app yet (see Header's cart icon, which is
// presentational for the same reason). This wires the correct inputs
// (variant + quantity) and disabled/availability states so a real
// Storefront Cart API mutation can be dropped into handleAddToCart later
// without changing this component's contract.
export function AddToCart({
  variantId,
  quantity,
  available,
}: {
  variantId: string;
  quantity: number;
  available: boolean;
}) {
  function handleAddToCart() {
    // TODO: wire to the Storefront Cart API (cartCreate / cartLinesAdd)
    // once cart architecture exists.
    console.log("Add to cart", { variantId, quantity });
  }

  return (
    <Button
      variant="primary"
      size="lg"
      disabled={!available}
      onClick={handleAddToCart}
      // Button's shared "primary" variant is bg-ink — left untouched since
      // other call sites (e.g. the homepage Hero CTA) should stay black.
      // This is the one deliberate exception: the storefront's single
      // highest-intent purchase action gets the brand's full-strength blue
      // (see globals.css's brand-token comment), with a flat --volt-deep
      // hover — no gradient — for a solid pressed-state feel. !-prefixed
      // because Button's own bg-ink/hover:opacity-90 share the same
      // specificity and would otherwise win the cascade tie (same reason
      // the transition/duration overrides below already needed it).
      className="h-16 flex-1 rounded-2xl !bg-volt text-base tracking-wide !text-white !transition-[background-color,translate,box-shadow,opacity] !duration-[250ms] !ease-out hover:-translate-y-1 hover:!bg-volt-deep hover:shadow-[0_22px_48px_-14px_rgba(11,11,11,0.45)]"
    >
      {available && <CartIcon />}
      {available ? "Add to Cart" : "Sold Out"}
    </Button>
  );
}
