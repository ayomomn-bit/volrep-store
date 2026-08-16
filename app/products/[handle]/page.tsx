import { notFound } from "next/navigation";
import { getProduct } from "@/lib/shopify/products";
import { Comparison } from "@/components/product/Comparison";
import { ProductFAQ } from "@/components/product/FAQ";
import { ProductFinalCTA } from "@/components/product/FinalCTA";
import { HowItWorks } from "@/components/product/HowItWorks";
import { LifestyleBenefits } from "@/components/product/LifestyleBenefits";
import { ProductHero } from "@/components/product/ProductHero";
import { Results } from "@/components/product/Results";
import { Technology } from "@/components/product/Technology";
import { UgcShowcase } from "@/components/product/UgcShowcase";

// Product data (price, availability) can change between deploys — same
// staleness budget as the homepage's catalog fetch.
export const revalidate = 300;

export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductHero product={product} />
      <LifestyleBenefits />
      <HowItWorks />
      <UgcShowcase />
      <Technology product={product} />
      <Comparison product={product} />
      <Results />
      <ProductFAQ />
      <ProductFinalCTA product={product} />
    </>
  );
}
