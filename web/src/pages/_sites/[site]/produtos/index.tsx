import { CheckedState } from "@radix-ui/react-checkbox"
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Checkbox } from "src/components/pages/catalog/checkbox"
import { Pagination } from "src/components/pages/catalog/pagination"
import { ProductItem } from "src/components/pages/catalog/products-list/product-item"
import { CatalogLayout } from "src/components/ui/Layouts/CatalogLayout"
import { Spinner } from "src/components/ui/Spinner"
import { catalogKeys } from "src/constants/query-keys"
import { getCompanyCatalog, getCompanyCatalogCategories, getCompanyCatalogFilteredProducts } from "src/services/catalog"
import { useCatalog } from "src/store/catalog"

export default function Produtos() {
  const [page, setPage] = useState(0);

  const { info } = useCatalog();
  const companySlug = info.slug;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState("recent")

  const router = useRouter();
  const initialSearch = router.query.search as string;
  const initialCategory = router.query.category as string;

  const [search, setSearch] = useState("");

  useEffect(() => {
    setPage(0)
    setSearch(initialSearch);
  }, [initialSearch])

  useEffect(() => {
    setPage(0)
    setSelectedCategories(initialCategory ? [initialCategory] : [])
  }, [initialCategory])

  const { data, isFetching: productsIsLoading } = useQuery(catalogKeys.companyFilteredProducts(companySlug!, page, selectedCategories, selectedOrder, search), () => getCompanyCatalogFilteredProducts(companySlug!, page, selectedCategories, selectedOrder, search), {
    enabled: !!companySlug,
    keepPreviousData: true,
  })

  const { data: categories } = useQuery(catalogKeys.companyCategories(companySlug!), () => getCompanyCatalogCategories(companySlug!), {
    enabled: !!companySlug
  })

  const productsLength = data?.products?.length ?? 0;
  const limit = data?.limit ?? 0;
  const total = data?.total ?? 0;


  const onChangeCategoryCheckbox = (value: CheckedState, categorySlug: string) => {
    setPage(0)
    if (value === true) {
      setSelectedCategories([...selectedCategories, categorySlug])
      return
    }
    setSelectedCategories(selectedCategories.filter(slug => slug !== categorySlug))
  }

  const pageCount = Math.ceil(total / limit);

  const showingLeftCount = data?.offset || 1;
  const showingRightCount = (page + 1) * limit;

  const hasCategories = categories && categories?.length > 0;

  return (
    <CatalogLayout title="Produtos">
      <header className="flex items-center justify-between flex-col-reverse gap-2 sm:gap-0 sm:flex-row">
        <p className="text-sm text-gray-500">
          <strong className="font-semibold text-gray-600">{`Mostrando ${showingLeftCount} - ${showingRightCount >= total ? total : showingRightCount} `}</strong>
          de {total} {total === 1 ? 'produto' : 'produtos'}
        </p>

        <select
          className="text-sm py-2 pl-6 pr-9 text-center rounded focus:ring-0 border border-gray-400 focus:border-primary text-gray-500"
          onChange={({ target }) => setSelectedOrder(target.value)}
          value={selectedOrder}
        >
          <option value="recent">Mais Recentes</option>
          <option value="lowerPrice">Menor preço</option>
          <option value="higherPrice">Maior preço</option>
        </select>
      </header>

      <div className={clsx("grid gap-6 mt-10 grid-cols-1", {
        "md:grid-cols-[0.5fr,2fr]": hasCategories,
      })}>
        {hasCategories && (
          <aside>
            <h2 className="text-gray-500 font-semibold border-b pb-2">Filtros</h2>

            <ul className="flex flex-col gap-2 mt-4">
              {categories?.map(category => (
                <li key={category.id}>
                  <Checkbox label={category.name} checked={selectedCategories.includes(category.slug)} onCheckedChange={(value) => onChangeCategoryCheckbox(value, category.slug)} />
                </li>
              ))}
            </ul>
          </aside>
        )}

        
        <div className={clsx("grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] text-center", {
          "grid-cols-1 lg:grid-cols-2": productsLength === 1,
        })}>

          {productsIsLoading && (
            <div className="col-span-full flex items-center justify-center">
              <Spinner className="w-14 h-14" />
            </div>
          )}

          {data?.products?.map(product => (
            <ProductItem product={product} key={product.slug} />
          ))}

          {!productsIsLoading && productsLength === 0 && (
            <div className="col-span-full flex items-center justify-center">
              <p className="text-gray-500">Nenhum produto encontrado</p>
            </div>
          )}
        </div>

        {productsLength >= limit && (
          <div className="col-span-full">
            <Pagination currentPage={page} setCurrentPage={setPage} pageCount={pageCount} />
          </div>
        )}
      </div>
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
  if(!params) {
    return {
      notFound: true,
      revalidate: 60
    }
  }
  
  const queryClient = new QueryClient()

  const slug = params?.site as string

  await queryClient.prefetchQuery(catalogKeys.companyCatalog(slug), () => getCompanyCatalog(slug))
  await queryClient.prefetchQuery(catalogKeys.companyCategories(slug), () => getCompanyCatalogCategories(slug))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}