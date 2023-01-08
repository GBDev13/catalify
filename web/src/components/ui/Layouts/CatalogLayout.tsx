import { ReactNode } from "react"
import { Footer } from "src/components/pages/catalog/footer"
import { Header } from "src/components/pages/catalog/header"
import { useRouter } from "next/router";
import { useCatalog } from "src/store/catalog";
import { getCompanyCatalog } from "src/services/catalog";
import { useQuery } from "@tanstack/react-query";
import { catalogKeys } from "src/constants/query-keys";

type CatalogLayoutProps = {
  children: ReactNode
}

export const CatalogLayout = ({ children }: CatalogLayoutProps) => {
  const router = useRouter();
  const slug = String(router.query.companySlug ?? '');

  const { setCatalogInfo, setCatalogColors } = useCatalog()

  useQuery(catalogKeys.companyCatalog(slug), () => getCompanyCatalog(slug), {
    onSuccess: (data) => {
      setCatalogInfo(data)
      setCatalogColors(data.themeColor)
    }
  });

  return (
    <main className="w-screen min-h-screen h-screen bg-white overflow-y-auto flex flex-col">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col">
        <Header />
        
        {children}
      </div>
      <Footer />
    </main>
  )
}