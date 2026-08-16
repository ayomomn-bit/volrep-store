import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import { PromoBar } from "@/components/layout/PromoBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getGlobalShopData } from "@/lib/shopify/global";
import "./globals.css";

// Official VOLREP typography: Montserrat Bold for headings, Aeonik Regular
// for body. Aeonik isn't available as a font asset in this project, so per
// brand guidance we fall back to Inter for body text.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VOLREP™ | Recover Every Day.",
    template: "%s | VOLREP™",
  },
  description: "VOLREP™ — Recover Every Day. Shop the VOLREP PRM™ Percussive Recovery Massager.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const globalData = await getGlobalShopData();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <CartProvider>
          <PromoBar />
          <Header data={globalData} />
          <main className="flex-1">{children}</main>
          <Footer data={globalData} />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
