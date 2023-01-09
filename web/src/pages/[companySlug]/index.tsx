import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { HomeBanners } from "src/components/pages/catalog/home-banners";
import { ProductsList } from "src/components/pages/catalog/products-list";
import { CatalogLayout } from "src/components/ui/Layouts/CatalogLayout";
import { catalogKeys } from "src/constants/query-keys";
import { getCompanyCatalog, getCompanyCatalogCategories, getCompanyCatalogProducts } from "src/services/catalog";

export default function CompanyHome() {
  const { query } = useRouter()
  const slug = query.companySlug as string

  const { data: productsList } = useQuery(catalogKeys.companyProducts(slug), () => getCompanyCatalogProducts(slug), {
    enabled: !!slug
  })

  return (
    <CatalogLayout>
      <HomeBanners />
      {productsList?.highlights && productsList?.highlights.length > 0 && <ProductsList products={productsList?.highlights} title="Destaques" />}
      {productsList?.products && productsList?.products.length > 0 && <ProductsList products={productsList?.products} title="Novidades" />}
      <Link href={`/${slug}/produtos`} className="mx-auto mt-10">
        <button className="bg-primary text-white px-4 py-2 rounded-full hover:brightness-105 transition-all">Ver todos os produtos</button>
      </Link>
    </CatalogLayout>
  );
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
  await queryClient.prefetchQuery(catalogKeys.companyProducts(slug), () => getCompanyCatalogProducts(slug))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}