import { ReactNode, useEffect } from "react"
import { Footer } from "src/components/pages/catalog/footer"
import { Header } from "src/components/pages/catalog/header"
import { CatalogInfo, useCatalog } from "src/store/catalog";
import Head from "next/head";
import { NextSeo } from 'next-seo';
import dynamic from "next/dynamic";
import { ExampleBanner } from "src/components/pages/catalog/example-banner";
import { FloatingWhatsApp } from "src/components/pages/catalog/floating-whatsapp.";
const CartSidebar = dynamic(() => import("src/components/pages/shared/CartSidebar"), { ssr: false });

type CatalogLayoutProps = {
  children: ReactNode
  title: string
  withoutLayout?: boolean
  catalogData: CatalogInfo
}

export const CatalogLayout = ({ catalogData, title, children, withoutLayout = false }: CatalogLayoutProps) => {
  const { setCatalogInfo, setCatalogColors } = useCatalog()

  useEffect(() => {
    setCatalogInfo(catalogData)
    setCatalogColors(catalogData.themeColor)
  }, [catalogData, setCatalogColors, setCatalogInfo])

  const favicon = catalogData?.config?.favicon;

  if(withoutLayout) return (
    <main className="w-screen min-h-screen h-screen bg-white overflow-y-auto flex flex-col">
      <NextSeo
        titleTemplate={`${catalogData.name} - %s`}
        title={title}
      />

      {!!favicon && (
        <Head>
          <link rel="icon" href={favicon} />
        </Head>
      )}
      {children}
    </main>
  )

  return (
    <>
      <NextSeo
        titleTemplate={`${catalogData.name} - %s`}
        title={title}
      />
      <main className="w-screen min-h-screen h-screen bg-white overflow-y-auto flex flex-col">
        {catalogData.isExample && <ExampleBanner />}
        <CartSidebar />

        {catalogData?.config?.withFloatingButton && <FloatingWhatsApp />}

        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col">
          <Header />
          
          {children}
        </div>
        <Footer />

        {!!favicon && (
          <Head>
            <link rel="icon" href={favicon} />
          </Head>
        )}
      </main>
    </>
  )
}