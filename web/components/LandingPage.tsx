"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/brutalist/navbar";
import { HeroSection } from "@/components/brutalist/hero-section";
import { FeatureGrid } from "@/components/brutalist/feature-grid";
import { AboutSection } from "@/components/brutalist/about-section";
import { PricingSection } from "@/components/brutalist/pricing-section";
import { GlitchMarquee } from "@/components/brutalist/glitch-marquee";
import { Footer } from "@/components/brutalist/footer";

export function LandingPage() {
  useEffect(() => {
    document.body.classList.add("is-landing");
    return () => document.body.classList.remove("is-landing");
  }, []);

  return (
    <div className="min-h-screen dot-grid-bg">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureGrid />
        <AboutSection />
        <PricingSection />
        <GlitchMarquee />
      </main>
      <Footer />
    </div>
  );
}
