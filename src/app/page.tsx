import { FAQ } from "@/components/landing/FAQ";
import { FeatureSplit } from "@/components/landing/FeatureSplit";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { LogoRow } from "@/components/landing/LogoRow";
import { Nav } from "@/components/landing/Nav";
import { Pricing } from "@/components/landing/Pricing";
import { StatsGrid } from "@/components/landing/StatsGrid";
import { Testimonials } from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoRow />
        <FeatureSplit />
        <StatsGrid />
        <FeaturesGrid />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
