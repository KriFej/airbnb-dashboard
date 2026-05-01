import { SimulateurClient } from "./SimulateurClient";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Simulateur loi Le Meur 2025 — Impact micro-BIC sur votre Airbnb | locpilote",
  description:
    "Calculez l'impact de la réforme loi Le Meur sur vos revenus de location courte durée. Abattement micro-BIC réduit, nouveau plafond 15 000 €. Simulation gratuite et sans inscription.",
};

export default function SimulateurPage() {
  return (
    <>
      <Nav />
      <SimulateurClient />
      <Footer />
    </>
  );
}
