import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LegalSection } from "@/components/legal/LegalSection";
import { SupportCallout } from "@/components/legal/SupportCallout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How VOLREP collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Privacy"
      title="Privacy Policy"
      description="How VOLREP collects, uses, and protects the information you share with us."
    >
      <LegalSection title="Information We Collect">
        <p>
          When you place an order or contact us, you may provide information such as your name, email address,
          shipping address, and payment details. Payment details are handled directly by our checkout and payment
          providers and are not stored on VOLREP&apos;s own systems.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Your Information">
        <p>
          We use the information you provide to process and fulfill orders, communicate with you about your
          purchase, respond to support requests, and improve the VOLREP shopping experience.
        </p>
      </LegalSection>

      <LegalSection title="Cookies & Analytics">
        <p>
          Like most websites, VOLREP may use cookies and similar technologies to help the site function properly
          and to understand general website usage. You can control cookies through your browser settings.
        </p>
      </LegalSection>

      <LegalSection title="Data Security">
        <p>
          We take reasonable measures to help protect the information you share with us. No method of
          transmission or storage is completely secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="Sharing Your Information">
        <p>
          We share information only as needed to fulfill your order and operate our store — for example, with the
          services that process payments and deliver your package. We do not sell your personal information.
        </p>
      </LegalSection>

      <LegalSection title="Your Rights & Requests">
        <p>
          You can contact us at any time to ask what information we hold about you, request a correction, or
          request that it be deleted, subject to anything we&apos;re required to retain for orders already placed.
        </p>
      </LegalSection>

      <LegalSection title="Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page.</p>
      </LegalSection>

      <p className="text-xs leading-relaxed text-muted-foreground">
        This policy is provided for general informational purposes and does not constitute legal advice.
      </p>

      <SupportCallout>Questions about this policy or your information? Contact us at</SupportCallout>
    </LegalPageLayout>
  );
}
