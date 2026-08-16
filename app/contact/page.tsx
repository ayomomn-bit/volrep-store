import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { LegalList } from "@/components/legal/LegalList";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact & Support",
  description: "Get in touch with the VOLREP support team about orders, shipping, returns, or product questions.",
};

const SUPPORT_TOPICS = ["Orders", "Shipping", "Returns", "Product questions", "General support"];

export default function ContactPage() {
  return (
    <LegalPageLayout
      eyebrow="Contact"
      title="How Can We Help?"
      description="Our team is here to help with anything related to your VOLREP order or experience."
    >
      <div className="rounded-[18px] border border-black/[0.06] bg-white px-6 py-8 sm:px-8 sm:py-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Email</p>
        <a
          href="mailto:support@volrep.com"
          className="mt-2 block text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 ease-out hover:text-volt sm:text-3xl"
        >
          support@volrep.com
        </a>
        <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Reach out any time and a member of our team will get back to you.
        </p>

        <ButtonLink href="mailto:support@volrep.com" variant="primary" size="lg" className="mt-6">
          Email Support
        </ButtonLink>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">What We Can Help With</h2>
        <div className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          <LegalList items={SUPPORT_TOPICS} />
        </div>
      </div>
    </LegalPageLayout>
  );
}
