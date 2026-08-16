"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";

// Checkout intentionally isn't a Server Action — it's a plain navigation to
// Shopify's own hosted checkoutUrl (already present on the Cart API's
// response), so there's nothing to mutate here, just a link styled to match
// AddToCart's CTA treatment. Shared by OrderSummary (/cart page) and
// CartDrawer so the "highest-intent purchase action" reads identically
// everywhere it appears.
export function CheckoutButton({
  checkoutUrl,
  label = "Checkout",
  className = "",
}: {
  checkoutUrl: string;
  label?: string;
  className?: string;
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  return (
    <ButtonLink
      href={checkoutUrl}
      variant="primary"
      size="lg"
      onClick={() => setIsCheckingOut(true)}
      aria-disabled={isCheckingOut}
      className={`rounded-2xl !bg-volt text-base tracking-wide !text-white !transition-[background-color,translate,box-shadow,opacity] !duration-[250ms] !ease-out hover:-translate-y-1 hover:!bg-volt-deep hover:shadow-[0_22px_48px_-14px_rgba(11,11,11,0.45)] ${
        isCheckingOut ? "pointer-events-none opacity-70" : ""
      } ${className}`}
    >
      {isCheckingOut ? "Checking out..." : label}
    </ButtonLink>
  );
}
