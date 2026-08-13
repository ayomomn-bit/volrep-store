import { NextResponse } from "next/server";
import { shopifyClient } from "@/lib/shopify/client";
import { GET_PRODUCT } from "@/lib/shopify/queries";

export async function GET() {
  const { data, errors } = await shopifyClient.request(GET_PRODUCT, {
    variables: {
      handle: "volrep-prm",
    },
  });

  if (errors) {
    console.error("Shopify API error:", errors);

    return NextResponse.json(
      {
        error: "Shopify request failed",
        details: errors,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}