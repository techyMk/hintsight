import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
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
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster
            position="bottom-right"
            theme="system"
            toastOptions={{
              classNames: {
                toast:
                  "!bg-card !text-foreground !border !border-border !rounded-xl !shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]",
                description: "!text-muted-foreground",
                actionButton:
                  "!bg-primary !text-primary-foreground !rounded-md !px-2 !py-1 !text-xs",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
