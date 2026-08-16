"use client";

import { CheckoutButton } from "@/components/cart/CheckoutButton";
import { formatMoney } from "@/lib/shopify/money";
import type { Cart } from "@/lib/shopify/cart";

export function OrderSummary({ cart }: { cart: Cart }) {
  const subtotal = formatMoney(cart.cost.subtotalAmount);

  return (
    <div className="rounded-[24px] border border-ink/10 bg-white p-6 sm:p-8 lg:sticky lg:top-[120px]">
      <h2 className="text-lg font-bold tracking-tight text-ink">Order Summary</h2>

      <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-6 text-base">
        <span className="text-slate">Subtotal</span>
        <span className="font-semibold text-ink">{subtotal}</span>
      </div>

      <p className="mt-2 text-xs text-slate">Shipping and taxes calculated at checkout.</p>

      <CheckoutButton checkoutUrl={cart.checkoutUrl} className="mt-6 h-16 w-full" />
    </div>
  );
}
