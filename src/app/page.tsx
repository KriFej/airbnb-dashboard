import { FAQ } from "@/components/landing/FAQ";
import { FeatureSplit } from "@/components/landing/FeatureSplit";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Nav } from "@/components/landing/Nav";
import { Pricing } from "@/components/landing/Pricing";
import { StatsGrid } from "@/components/landing/StatsGrid";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FeatureSplit />
        <StatsGrid />
        <FeaturesGrid />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
