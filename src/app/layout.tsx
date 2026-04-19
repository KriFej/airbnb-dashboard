import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://locpilote.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "locpilote — Votre vrai bénéfice net Airbnb & Booking, enfin visible.",
    template: "%s · locpilote",
  },
  description:
    "Le tableau de bord de rentabilité pour les hôtes Airbnb & Booking.com. Suivez votre vrai revenu net, vos dépenses, les frais de plateforme et synchronisez vos calendriers iCal en quelques secondes.",
  keywords: [
    "tableau de bord airbnb",
    "bénéfice net airbnb",
    "revenu booking.com",
    "intégration ical",
    "location courte durée",
    "locpilote",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "locpilote — Votre vrai bénéfice net Airbnb & Booking, enfin visible.",
    description:
      "Suivez votre vrai revenu net, vos dépenses et les frais de plateforme. Synchronisez Airbnb + Booking en un clic.",
    type: "website",
    url: BASE_URL,
    siteName: "locpilote",
    locale: "fr_FR",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "locpilote — tableau de bord de rentabilité Airbnb",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "locpilote — Votre vrai bénéfice net Airbnb & Booking",
    description: "Suivez votre vrai revenu net, vos dépenses et les frais de plateforme.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans bg-bg text-white antialiased">{children}</body>
    </html>
  );
}
