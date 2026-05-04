import { FAQ } from "@/components/landing/FAQ";
import { FeatureSplit } from "@/components/landing/FeatureSplit";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Nav } from "@/components/landing/Nav";
import { Pricing } from "@/components/landing/Pricing";
import { StatsGrid } from "@/components/landing/StatsGrid";
import { PcBanner } from "@/components/ui/PcBanner";

export default function LandingPage() {
  return (
    <>
      <PcBanner />
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <StatsGrid />
        <FeaturesGrid />
        <FeatureSplit />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
