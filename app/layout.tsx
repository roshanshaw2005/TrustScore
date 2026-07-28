import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import GoldCoinCursor from "@/components/ui/GoldCoinCursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "TrustScore AI — Startup Validation & Credibility Platform",
  description: "Build a verifiable credibility profile that investors trust. AI-powered startup validation and due diligence platform.",
  keywords: "startup validation, due diligence, trust score, investor matching, credibility profile",
  authors: [{ name: "TrustScore AI" }],
  openGraph: {
    title: "TrustScore AI — Startup Validation & Credibility Platform",
    description: "Build a verifiable credibility profile that investors trust. AI-powered startup validation and due diligence platform.",
    url: "https://trustscore.ai",
    siteName: "TrustScore AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrustScore AI Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustScore AI — Startup Validation & Credibility Platform",
    description: "Build a verifiable credibility profile that investors trust.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#030305",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoldCoinCursor />
        {children}
      </body>
    </html>
  );
}