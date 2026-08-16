import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LegalSection } from "@/components/legal/LegalSection";
import { SupportCallout } from "@/components/legal/SupportCallout";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "How VOLREP handles returns, free return shipping, and refund timing.",
};

export default function ReturnsPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Returns"
      title="Return & Refund Policy"
      description="Our return process is simple, and return shipping is on us."
    >
      <LegalSection title="Return Window">
        <p>You may request a return within 7 days after your order has been delivered.</p>
      </LegalSection>

      <LegalSection title="Return Shipping">
        <p>Return shipping is FREE.</p>
      </LegalSection>

      <LegalSection title="Refunds">
        <p>
          Once your returned item has been received and the return is approved, refunds are processed within 7
          days.
        </p>
      </LegalSection>

      <LegalSection title="Starting a Return">
        <p>
          To start a return, contact our support team with your order details and we&apos;ll guide you through the
          next steps.
        </p>
      </LegalSection>

      <SupportCallout>Ready to start a return, or have a question first? Email us at</SupportCallout>
    </LegalPageLayout>
  );
}
