import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LegalSection } from "@/components/legal/LegalSection";
import { SupportCallout } from "@/components/legal/SupportCallout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you use the VOLREP website and place an order.",
};

const LINK_CLASSNAME = "font-semibold text-foreground underline decoration-volt decoration-2 underline-offset-4 transition-colors duration-300 ease-out hover:text-volt";

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Terms"
      title="Terms & Conditions"
      description="The terms that apply when you use the VOLREP website and place an order with us."
    >
      <LegalSection title="Website Use">
        <p>
          By using this website, you agree to use it only for lawful purposes and in a way that doesn&apos;t restrict
          or inhibit anyone else&apos;s use of it.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable Use">
        <p>
          When using this website, you agree not to misuse it — including attempting to gain unauthorized access to
          any part of the site, interfering with its normal operation, or using it to transmit anything unlawful,
          harmful, or fraudulent.
        </p>
      </LegalSection>

      <LegalSection title="Product Information">
        <p>
          We aim to describe our products as accurately as possible. Colors, dimensions, and other details may
          vary slightly from what&apos;s shown on your screen.
        </p>
      </LegalSection>

      <LegalSection title="Pricing">
        <p>
          All prices are listed on the website and are subject to change without notice. We reserve the right to
          correct any pricing errors.
        </p>
      </LegalSection>

      <LegalSection title="Orders & Payments">
        <p>
          Placing an order is an offer to purchase a product, which we may accept, refuse, or cancel. Payments are
          processed securely through our checkout provider.
        </p>
      </LegalSection>

      <LegalSection title="Shipping">
        <p>
          Handling and delivery estimates are outlined in our{" "}
          <Link href="/shipping" className={LINK_CLASSNAME}>
            Shipping Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Returns & Refunds">
        <p>
          Return and refund details are outlined in our{" "}
          <Link href="/returns" className={LINK_CLASSNAME}>
            Return & Refund Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Intellectual Property">
        <p>
          All content on this website, including the VOLREP name, logo, product designs, images, and text, belongs
          to VOLREP and may not be used without permission.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, VOLREP is not liable for any indirect, incidental, or
          consequential damages arising from your use of this website or our products.
        </p>
      </LegalSection>

      <LegalSection title="Changes to These Terms">
        <p>
          We may update these Terms & Conditions at any time. Continued use of the website after changes are
          posted means you accept the updated terms.
        </p>
      </LegalSection>

      <LegalSection title="Governing Law">
        <p>
          These Terms & Conditions are governed by the laws applicable to VOLREP&apos;s operation of this website. If
          any provision of these terms is found to be unenforceable, the remaining provisions will continue to
          apply in full.
        </p>
      </LegalSection>

      <p className="text-xs leading-relaxed text-muted-foreground">
        These terms are provided for general informational purposes and do not constitute legal advice.
      </p>

      <SupportCallout>Questions about these terms? Contact us at</SupportCallout>
    </LegalPageLayout>
  );
}
