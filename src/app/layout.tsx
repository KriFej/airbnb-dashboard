import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "locpilote — Your real Airbnb & Booking net profit, visible.",
  description:
    "The profit dashboard for Airbnb & Booking.com hosts. Track real net revenue, expenses, platform fees and sync both iCal calendars in seconds. Free, no signup.",
  keywords: [
    "airbnb dashboard",
    "airbnb net profit",
    "booking.com revenue",
    "ical integration",
    "short term rental analytics",
    "locpilote",
  ],
  openGraph: {
    title: "locpilote — Your real Airbnb & Booking net profit, visible.",
    description:
      "Track real net revenue, expenses and fees. Sync Airbnb + Booking iCal in one click. Free, no signup.",
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
