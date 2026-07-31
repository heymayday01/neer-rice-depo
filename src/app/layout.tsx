import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { MotionProvider } from "@/components/site/motion-provider";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neer Rice Depo · Farm-Direct Organic & Heirloom Grains",
  description:
    "Authentic, unpolished, single-origin heirloom grains and naturally aged Basmati sourced directly from verified organic farming cooperatives across India.",
  keywords: [
    "organic rice",
    "heirloom grains",
    "basmati",
    "sona masoori",
    "black rice",
    "indrayani",
    "farm direct rice",
    "low GI rice",
    "Neer Rice Depo",
  ],
  authors: [{ name: "Neer Rice Depo" }],
  icons: {
    icon: "/neer-logo.jpg",
  },
  openGraph: {
    title: "Neer Rice Depo · Farm-Direct Organic & Heirloom Grains",
    description:
      "Pristine Indian organic & heirloom grains, naturally aged and pesticide-free, delivered farm-direct to your doorstep.",
    siteName: "Neer Rice Depo",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${playfair.variable} ${jakarta.variable} antialiased`}
      >
        <MotionProvider>
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors />
        </MotionProvider>
      </body>
    </html>
  );
}
