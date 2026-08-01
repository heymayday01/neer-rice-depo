import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { MotionProvider } from "@/components/site/motion-provider";

// Fraunces — a "soft serif" with optical sizing; warm, organic, editorial.
// Used for all display headings, product names, prices.
const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Manrope — a modern geometric sans with excellent legibility.
// Used for all body text, UI labels, metadata, buttons.
const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    icon: "/neer-logo-premium.png",
  },
  openGraph: {
    title: "Neer Rice Depo · Farm-Direct Organic & Heirloom Grains",
    description:
      "Pristine Indian organic & heirloom grains, naturally aged and pesticide-free, delivered farm-direct to your doorstep.",
    siteName: "Neer Rice Depo",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Neer Rice",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // prevent zoom for app feel
  userScalable: false, // app-like: no pinch zoom
  viewportFit: "cover", // safe-area insets
  themeColor: "#0a0f0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${manrope.variable} antialiased`}
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
