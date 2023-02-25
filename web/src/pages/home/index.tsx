import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { DemoVideoSection } from "src/components/pages/home/demo-video";
import { ExamplesSection } from "src/components/pages/home/examples";
import { FeaturesSection } from "src/components/pages/home/features";
import { HomeFooter } from "src/components/pages/home/footer";
import { HomeHeader } from "src/components/pages/home/header";
import { HeroSection } from "src/components/pages/home/hero";
import { PricingSection } from "src/components/pages/home/pricing";
import { LandingSEO } from "src/components/pages/shared/LandingSEO";

export default function Home() {
  useEffect(() => {
    // @ts-ignore
    if(typeof window.Gradient !== 'undefined') {
    // @ts-ignore
      var gradient = new window.Gradient()
      gradient.initGradient('#gradient-canvas');
    }
  }, [])
  return (
    <>
      <Script src="/scripts/Gradient.js" onLoad={() => {
        // @ts-ignore
        var gradient = new window.Gradient()
        gradient.initGradient('#gradient-canvas');
      }} />

      <LandingSEO title="O melhor catálogo digital para sua loja online" />

      <main className="flex flex-col">
        <HomeHeader />
        <HeroSection />
        <FeaturesSection />
        <DemoVideoSection />
        <ExamplesSection />
        <PricingSection />
        <HomeFooter />
      </main>
    </>
  )
}
