import { ReactNode } from "react"
import { Footer } from "src/components/pages/catalog/footer"
import { Header } from "src/components/pages/catalog/header"
import { useRouter } from "next/router";
import { useCatalog } from "src/store/catalog";
import { getCompanyCatalog } from "src/services/catalog";
import { useQuery } from "@tanstack/react-query";
import { catalogKeys } from "src/constants/query-keys";
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
}

export const CatalogLayout = ({ title, children, withoutLayout = false }: CatalogLayoutProps) => {
  const router = useRouter();
  const slug = String(router.query.site ?? '');

  const { setCatalogInfo, setCatalogColors, info } = useCatalog()

  useQuery(catalogKeys.companyCatalog(slug), () => getCompanyCatalog(slug), {
    enabled: !!slug,
    onSuccess: (data) => {
      setCatalogInfo(data)
      setCatalogColors(data.themeColor)
    }
  });

  const favicon = info?.config?.favicon;

  if(withoutLayout) return (
    <main className="w-screen min-h-screen h-screen bg-white overflow-y-auto flex flex-col">
      <NextSeo
        titleTemplate={`${info.name} - %s`}
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
        titleTemplate={`${info.name} - %s`}
        title={title}
      />
      <main className="w-screen min-h-screen h-screen bg-white overflow-y-auto flex flex-col">
        {info.isExample && <ExampleBanner />}
        <CartSidebar />

        {info?.config?.withFloatingButton && <FloatingWhatsApp />}

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