import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LegalSection } from "@/components/legal/LegalSection";
import { LegalList } from "@/components/legal/LegalList";
import { SupportCallout } from "@/components/legal/SupportCallout";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Processing times, delivery estimates, and the countries VOLREP currently ships to.",
};

const SHIPPING_COUNTRIES = ["United States", "Canada", "United Kingdom", "Australia"];

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Shipping"
      title="Shipping Policy"
      description="Everything you need to know about how your VOLREP order gets to you."
    >
      <LegalSection title="Order Processing">
        <p>Orders are typically processed within 1–2 business days before they&apos;re handed off for delivery.</p>
      </LegalSection>

      <LegalSection title="Shipping Time">
        <p>Once your order has been processed, it typically arrives within 7–12 business days.</p>
      </LegalSection>

      <LegalSection title="Where We Ship">
        <p>VOLREP currently ships to:</p>
        <LegalList items={SHIPPING_COUNTRIES} />
      </LegalSection>

      <LegalSection title="Delivery Estimates">
        <p>
          The timeframes above are estimates, not guarantees. Delivery can be affected by carrier delays, customs
          processing, weather, holidays, and other circumstances outside VOLREP&apos;s control.
        </p>
      </LegalSection>

      <SupportCallout>Questions about your shipment? Reach our team at</SupportCallout>
    </LegalPageLayout>
  );
}
