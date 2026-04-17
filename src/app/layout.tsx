import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Profitly — Your real Airbnb net profit, visible.",
  description:
    "The profit dashboard for Airbnb & Booking hosts. Track real net revenue, expenses, platform fees and sync your iCal calendar in seconds. Free, no signup.",
  keywords: [
    "airbnb dashboard",
    "airbnb net profit",
    "booking.com revenue",
    "ical integration",
    "short term rental analytics",
  ],
  openGraph: {
    title: "Profitly — Your real Airbnb net profit, visible.",
    description:
      "Track real net revenue, expenses and fees. Sync iCal in one click. Free, no signup.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-bg text-white antialiased">{children}</body>
    </html>
  );
}
