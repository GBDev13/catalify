import { dehydrate, QueryClient } from "@tanstack/react-query"
import { GetStaticPaths, GetStaticProps } from "next"
import { CatalogLayout } from "src/components/ui/Layouts/CatalogLayout"
import { catalogKeys } from "src/constants/query-keys"
import { getCompanyCatalog, getCompanyCatalogCategories } from "src/services/catalog"

export default function Produtos() {
  return (
    <CatalogLayout>
      <h1>Produtos</h1>
    </CatalogLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient()

  const slug = params?.companySlug as string

  await queryClient.prefetchQuery(catalogKeys.companyCatalog(slug), () => getCompanyCatalog(slug))
  await queryClient.prefetchQuery(catalogKeys.companyCategories(slug), () => getCompanyCatalogCategories(slug))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}