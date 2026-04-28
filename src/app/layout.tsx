import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION ?? "",
    },
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
  manifest: "/manifest.json",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "locpilote",
      url: BASE_URL,
      logo: `${BASE_URL}/favicon.svg`,
      contactPoint: { "@type": "ContactPoint", email: "hello@locpilote.com", contactType: "customer support" },
    },
    {
      "@type": "SoftwareApplication",
      name: "locpilote",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: BASE_URL,
      description: "Tableau de bord de rentabilité pour les hôtes Airbnb et Booking.com. Suivez votre bénéfice net, synchronisez vos calendriers iCal et gérez vos dépenses.",
      offers: [
        { "@type": "Offer", name: "Gratuit", price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Starter", price: "9.90", priceCurrency: "EUR", billingIncrement: "P1M" },
        { "@type": "Offer", name: "Pro", price: "19.90", priceCurrency: "EUR", billingIncrement: "P1M" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Combien coûte locpilote ?", acceptedAnswer: { "@type": "Answer", text: "Trois offres : Starter à 9,90 €/mois (1 à 2 biens), Pro à 19,90 €/mois (3 à 10 biens) et Unlimited sur devis à partir de 11 biens." } },
        { "@type": "Question", name: "C'est quoi un iCal ?", acceptedAnswer: { "@type": "Answer", text: "Un iCal (.ics) est un lien généré par Airbnb et Booking.com pour exporter votre calendrier de réservations. En le collant dans locpilote, vos réservations s'importent automatiquement." } },
        { "@type": "Question", name: "Comment trouver mon URL iCal sur Airbnb ?", acceptedAnswer: { "@type": "Answer", text: "Dans l'app Airbnb : Calendrier → votre logement → Disponibilité → Exporter le calendrier. Copiez l'URL .ics et collez-la dans locpilote." } },
        { "@type": "Question", name: "Où sont stockées mes données ?", acceptedAnswer: { "@type": "Answer", text: "Sur des serveurs Supabase situés en Union européenne, chiffrées et accessibles uniquement par vous." } },
        { "@type": "Question", name: "Est-ce que ça marche avec Booking.com ?", acceptedAnswer: { "@type": "Answer", text: "Oui — toute source iCal (.ics) est compatible : Airbnb, Booking.com, Vrbo, Hostaway, Smoobu, Google Calendar, etc." } },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-bg text-fg antialiased">
        <ThemeProvider>
          {children}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
