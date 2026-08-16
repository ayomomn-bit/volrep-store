"use client";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// Controlled by ProductInfo so AddToCart can read the current quantity
// alongside the selected variant.
export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
}) {
  return (
    <div
      role="group"
      aria-label="Quantity"
      className="inline-flex h-16 shrink-0 items-stretch overflow-hidden rounded-2xl border border-ink/20 bg-white"
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className={`flex w-12 items-center justify-center text-lg text-ink transition-colors duration-200 ease-out hover:bg-ink/[0.04] ${FOCUS_RING} disabled:pointer-events-none disabled:opacity-25`}
      >
        −
      </button>
      <span aria-live="polite" className="flex min-w-16 items-center justify-center text-sm font-medium text-ink">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        className={`flex w-12 items-center justify-center text-lg text-ink transition-colors duration-200 ease-out hover:bg-ink/[0.04] ${FOCUS_RING}`}
      >
        +
      </button>
    </div>
  );
}
