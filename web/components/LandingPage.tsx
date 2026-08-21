"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/brutalist/navbar";
import { HeroSection } from "@/components/brutalist/hero-section";
import { FeatureGrid } from "@/components/brutalist/feature-grid";
import { AboutSection } from "@/components/brutalist/about-section";
import { StudioProofSection } from "@/components/brutalist/studio-proof-section";
import { DeploySection } from "@/components/brutalist/deploy-section";
import { Footer } from "@/components/brutalist/footer";

export function LandingPage() {
  useEffect(() => {
    document.body.classList.add("is-landing");
    return () => document.body.classList.remove("is-landing");
  }, []);

  return (
    <div className="min-h-screen dot-grid-bg">
      <div className="flex min-h-svh flex-col">
        <Navbar />
        <HeroSection />
      </div>
      <main>
        <FeatureGrid />
        <AboutSection />
        <StudioProofSection />
        <DeploySection />
      </main>
      <Footer />
    </div>
  );
}
