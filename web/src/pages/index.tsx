import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { DemoVideoSection } from "src/components/pages/home/demo-video";
import { FeaturesSection } from "src/components/pages/home/features";
import { HomeFooter } from "src/components/pages/home/footer";
import { HomeHeader } from "src/components/pages/home/header";
import { HeroSection } from "src/components/pages/home/hero";
import { PricingSection } from "src/components/pages/home/pricing";

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

      <Head>
        <title>Catalify | Catálogo digital que simplifica suas vendas</title>
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg" />
      </Head>

      <main className="flex flex-col">
        <HomeHeader />
        <HeroSection />
        <FeaturesSection />
        <DemoVideoSection />
        <PricingSection />
        <HomeFooter />
      </main>
    </>
  )
}
