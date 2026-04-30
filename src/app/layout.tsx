import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { ToasterClient } from "@/components/theme/toaster-client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

function resolveMetadataBase(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    try {
      return new URL(explicit);
    } catch {
      // Fall through to Vercel default if the env var is malformed.
    }
  }
  // Vercel sets VERCEL_URL automatically (host only, no protocol).
  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    try {
      return new URL(`https://${vercelHost}`);
    } catch {
      // Fall through to localhost.
    }
  }
  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: "Hintsight — a scoreboard for your judgment",
    template: "%s · Hintsight",
  },
  description:
    "Log a prediction today. On the date you said you'd know by, Hintsight asks what really happened. Over months, you see how good your judgment actually is — not how good you think it is.",
  applicationName: "Hintsight",
  authors: [{ name: "techyMk" }],
  keywords: [
    "calibration",
    "predictions",
    "decision tracking",
    "judgment",
    "forecasting",
    "Brier score",
    "Tetlock",
  ],
  openGraph: {
    type: "website",
    title: "Hintsight — a scoreboard for your judgment",
    description:
      "Predict today. Find out if you were right. Calibrate your judgment over time.",
    siteName: "Hintsight",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hintsight — a scoreboard for your judgment",
    description:
      "Predict today. Find out if you were right. Calibrate your judgment over time.",
    creator: "@techyMk",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon.webp", type: "image/webp" },
    ],
    shortcut: "/icon.webp",
    apple: "/icon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider>
            {children}
            <ToasterClient />
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
