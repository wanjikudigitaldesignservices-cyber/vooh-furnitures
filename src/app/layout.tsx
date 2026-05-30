import type { Metadata } from "next";
import { Playfair_Display, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vooh Furnitures | Crafted for How You Live",
  description: "From our Nairobi HQ to Kisumu, Mombasa, Kericho, and Eldoret — Vooh Furnitures brings craftsmanship and comfort to every home and office.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} ${spaceMono.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col relative overflow-x-hidden">
        <Providers>
          <Navbar />
          <CartDrawer />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
        
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
