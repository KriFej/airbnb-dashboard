import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "locpilote — Votre vrai bénéfice net Airbnb & Booking, enfin visible.",
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
  openGraph: {
    title: "locpilote — Votre vrai bénéfice net Airbnb & Booking, enfin visible.",
    description:
      "Suivez votre vrai revenu net, vos dépenses et les frais de plateforme. Synchronisez Airbnb + Booking en un clic.",
    type: "website",
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
