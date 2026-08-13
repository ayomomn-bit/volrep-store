import { Hero } from "@/components/home/Hero";
import { BestSellers } from "@/components/home/BestSellers";
import { RecoveryPhilosophy } from "@/components/home/RecoveryPhilosophy";
import { RecoverEverywhere } from "@/components/home/RecoverEverywhere";
import { WhyVolrep } from "@/components/home/WhyVolrep";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Newsletter } from "@/components/home/Newsletter";

// Homepage is statically generated; revalidate periodically so Shopify
// product data (price, image, catalog) doesn't go stale between deploys.
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <Hero />
      <BestSellers />
      <RecoveryPhilosophy />
      <RecoverEverywhere />
      <WhyVolrep />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Newsletter />
    </>
  );
}
