import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ThemeByRoute from "@/components/layout/ThemeByRoute";
import { CartProvider } from "@/lib/cart";
import { CurrencyProvider } from "@/lib/currency";
import { ClubProvider } from "@/lib/club";

/* Typography:
   — Anton for display: condensed, heavy, poster-like. The brand voice.
   — Inter for body copy: neutral, quiet, gets out of the way.
   — JetBrains Mono for labels, prices and metadata: technical, catalogue-like. */
const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://nicotine.store"),
  title: {
    default: "NICOTINE — İstanbul street fashion",
    template: "%s — NICOTINE",
  },
  description:
    "NICOTINE is an İstanbul street fashion label. One drop every two months, seven to eight pieces, shipped across Türkiye and Europe.",
  openGraph: {
    title: "NICOTINE — İstanbul street fashion",
    description: "One drop every two months. Seven to eight pieces. Never restocked.",
    type: "website",
    locale: "en_GB",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F6F3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
      <ClubProvider>
        <CurrencyProvider>
        <CartProvider>
          {/* Skip link — the film section is long, keyboard users need an exit */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-mark focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:text-ground"
          >
            Skip to content
          </a>

          <ThemeByRoute />
          <SmoothScroll />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />

          {/* Global film grain — one fixed layer over the whole site */}
          <div
            aria-hidden
            className="grain-layer pointer-events-none fixed inset-0 z-[80] opacity-[0.04]"
          />
        </CartProvider>
        </CurrencyProvider>
      </ClubProvider>
      </body>
    </html>
  );
}
