import type { Metadata } from "next";
import { SimulateurClient } from "./SimulateurClient";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Simulateur LMNP 2024 — Micro-BIC vs Régime Réel | LocFiscal",
  description:
    "Calculez gratuitement votre imposition LMNP. Micro-BIC ou Régime Réel ? LocFiscal compare les deux et vous dit combien vous économisez.",
};

export default function SimulateurLMNPPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-bg">
        <SimulateurClient />
      </main>
      <Footer />
    </>
  );
}
