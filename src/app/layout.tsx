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

const BASE_URL = "https://locfiscal.fr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "LocFiscal — Payez moins d'impôts sur votre Airbnb. LMNP simplifié.",
    template: "%s · LocFiscal",
  },
  description:
    "Micro-BIC ou Régime Réel ? LocFiscal calcule votre imposition LMNP en 30 secondes et vous dit combien vous économisez. Simulateur gratuit, sans inscription.",
  keywords: [
    "LMNP",
    "micro-bic",
    "régime réel",
    "fiscalité airbnb",
    "simulateur lmnp",
    "déclaration lmnp",
    "amortissement lmnp",
    "location meublée non professionnelle",
    "locfiscal",
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
    title: "LocFiscal — Payez moins d'impôts sur votre Airbnb.",
    description:
      "Micro-BIC ou Régime Réel ? Simulateur LMNP 2024 gratuit. Calculez votre économie fiscale en 30 secondes.",
    type: "website",
    url: BASE_URL,
    siteName: "LocFiscal",
    locale: "fr_FR",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "LocFiscal — Simulateur LMNP Micro-BIC vs Régime Réel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LocFiscal — Payez moins d'impôts sur votre Airbnb",
    description: "Simulateur LMNP 2024 gratuit. Micro-BIC ou Régime Réel ?",
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
      name: "LocFiscal",
      url: BASE_URL,
      logo: `${BASE_URL}/favicon.svg`,
      contactPoint: { "@type": "ContactPoint", email: "hello@locfiscal.fr", contactType: "customer support" },
    },
    {
      "@type": "SoftwareApplication",
      name: "LocFiscal",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: BASE_URL,
      description: "Outil de simulation et d'optimisation fiscale LMNP pour les hôtes Airbnb et Booking.com. Micro-BIC vs Régime Réel, calcul d'amortissements, récapitulatif déclaration.",
      offers: [
        { "@type": "Offer", name: "Gratuit", price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Pro", price: "79", priceCurrency: "EUR", billingIncrement: "P1Y" },
        { "@type": "Offer", name: "Expert", price: "149", priceCurrency: "EUR", billingIncrement: "P1Y" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Quelle est la différence entre Micro-BIC et Régime Réel ?", acceptedAnswer: { "@type": "Answer", text: "En Micro-BIC, vous bénéficiez d'un abattement forfaitaire de 50% sur vos revenus bruts. En Régime Réel, vous déduisez toutes vos charges réelles et amortissements. Le Réel est souvent plus avantageux si vos charges dépassent 50% de vos revenus." } },
        { "@type": "Question", name: "Comment sont calculés les amortissements LMNP ?", acceptedAnswer: { "@type": "Answer", text: "Bien : (prix d'achat × 80%) ÷ 25 ans. Mobilier : valeur meubles ÷ 7 ans. Travaux lourds : montant ÷ 10 ans." } },
        { "@type": "Question", name: "Le simulateur LMNP est-il gratuit ?", acceptedAnswer: { "@type": "Answer", text: "Oui. Le simulateur Micro-BIC vs Régime Réel est 100% gratuit, sans inscription, avec résultat immédiat." } },
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
