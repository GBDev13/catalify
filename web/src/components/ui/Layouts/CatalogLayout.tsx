import { ReactNode } from "react"
import { Footer } from "src/components/pages/catalog/footer"
import { Header } from "src/components/pages/catalog/header"
import { useRouter } from "next/router";
import { useCatalog } from "src/store/catalog";
import { getCompanyCatalog } from "src/services/catalog";
import { useQuery } from "@tanstack/react-query";
import { catalogKeys } from "src/constants/query-keys";
import { CartSidebar } from "src/components/pages/shared/CartSidebar";
import Head from "next/head";
import { NextSeo } from 'next-seo';

type CatalogLayoutProps = {
  children: ReactNode
  title: string
}

export const CatalogLayout = ({ title, children }: CatalogLayoutProps) => {
  const router = useRouter();
  const slug = String(router.query.companySlug ?? '');

  const { setCatalogInfo, setCatalogColors, info } = useCatalog()

  useQuery(catalogKeys.companyCatalog(slug), () => getCompanyCatalog(slug), {
    onSuccess: (data) => {
      setCatalogInfo(data)
      setCatalogColors(data.themeColor)
    }
  });

  return (
    <>
      <NextSeo
        titleTemplate={`${info.name} - %s`}
        title={title}
      />
      <main className="w-screen min-h-screen h-screen bg-white overflow-y-auto flex flex-col">
        <CartSidebar />

        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col">
          <Header />
          
          {children}
        </div>
        <Footer />

        {info?.logo && (
          <Head>
            <link rel="icon" href={info.logo} />
          </Head>
        )}
      </main>
    </>
  )
}