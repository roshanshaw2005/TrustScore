import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

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
  title: {
    default: "TrustScore AI — Startup Validation & Credibility Platform",
    template: "%s | TrustScore AI",
  },
  description: "Build a verifiable credibility profile that investors trust. AI-powered startup validation, due diligence, and investor matching platform.",
  keywords: "startup validation, due diligence, trust score, investor matching, credibility profile, AI verification, fundraising, startup scoring",
  authors: [{ name: "TrustScore AI", url: "https://trustscore.ai" }],
  creator: "TrustScore AI",
  publisher: "TrustScore AI",
  metadataBase: new URL("https://trustscore.ai"),
  alternates: {
    canonical: "/",
  },
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
        alt: "TrustScore AI Platform - Startup Validation & Credibility Score",
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
    creator: "@trustscoreai",
    site: "@trustscoreai",
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#0B0F17",
  colorScheme: "dark",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TrustScore AI",
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  bookmarks: "TrustScore AI — Startup Validation Platform",
  category: "Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0B0F17] text-white font-body" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}