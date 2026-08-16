"use client";

import { Button } from "@/components/ui/Button";

// Outlined counterpart to AddToCart, same size and hover treatment.
// No checkout flow exists yet — same "stub the handler, wire the real
// mutation later" contract as AddToCart's Storefront Cart API TODO.
export function BuyNowButton({
  variantId,
  quantity,
  available,
}: {
  variantId: string;
  quantity: number;
  available: boolean;
}) {
  function handleBuyNow() {
    // TODO: wire to Shopify checkout (cartCreate + redirect to
    // checkoutUrl) once cart architecture exists.
    console.log("Buy now", { variantId, quantity });
  }

  return (
    <Button
      variant="secondary"
      size="lg"
      disabled={!available}
      onClick={handleBuyNow}
      // See AddToCart for why these need the ! prefix (Button's own
      // transition-colors duration-150 otherwise wins the cascade tie).
      // A thin, full-opacity ink border (vs. the shared Button secondary's
      // border-ink/20) reads as a deliberate premium outline rather than
      // the muted default used elsewhere on the site.
      className="h-16 w-full rounded-2xl border !border-ink bg-white text-base tracking-wide text-ink !transition-[translate,box-shadow,opacity,background-color,color] !duration-[250ms] !ease-out hover:-translate-y-1 hover:!bg-ink hover:!text-paper hover:shadow-[0_22px_48px_-14px_rgba(11,11,11,0.4)]"
    >
      Buy Now
    </Button>
  );
}
