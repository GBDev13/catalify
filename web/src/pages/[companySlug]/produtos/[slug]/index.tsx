import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query"
import { GetStaticPaths, GetStaticProps } from "next"
import { FaCartPlus, FaWhatsapp } from "react-icons/fa"
import { ProductSlider } from "src/components/pages/catalog/product/slider/slider"
import { CatalogLayout } from "src/components/ui/Layouts/CatalogLayout"
import { catalogKeys } from "src/constants/query-keys"
import { getCompanyCatalog, getCompanyCatalogCategories, getCompanyCatalogProductBySlug } from "src/services/catalog"
import parse from 'html-react-parser';
import { useRouter } from "next/router"
import { useCompany } from "src/store/company"
import Link from "next/link"
import { formatPrice } from "src/helpers/format-price"
import { getFormattedPrices } from "src/helpers/getFormattedPrices"
import { useCart } from "src/store/cart"
import { toast } from "react-hot-toast"

const description = `
<h2>Olha que top</h2>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, adipisci <a href="htttps://google.com">testing cool like</a> ex possimus placeat optio eos, sapiente odio libero veritatis! Sit asperiores in repellendus? Sit delectus eligendi vero!</p>
<ul>
<li>teste 1</li>
<li>teste 2</li>
<li>teste 3</li>
</ul>
`

export default function Produto() {
  const { query } = useRouter();

  const companySlug = useCompany(state => state.company?.slug);

  const productSlug = query.slug as string;

  const { data: productData } = useQuery(catalogKeys.companyProduct(productSlug), () => getCompanyCatalogProductBySlug(companySlug!, productSlug), {
    enabled: !!companySlug && !!productSlug,
  })

  const { formattedPrice, formattedPromoPrice, promoPercentage } = getFormattedPrices(productData?.price!, productData?.promoPrice)

  const { addProductToCart } = useCart();

  const handleAddToCart = () => {
    toast.success('Produto adicionado ao carrinho')
    addProductToCart({
      id: productData?.id!,
      name: productData?.name!,
      price: productData?.price!,
      promoPrice: productData?.promoPrice!,
      slug: productData?.slug!,
      picture: productData?.pictures ? productData?.pictures[0] : undefined,
    })
  }

  const handleBuy = () => {
    console.log('buy')
  }

  return (
    <CatalogLayout>
      <div className="grid grid-cols-1 md:grid-cols-[1fr,1.4fr] gap-16 mt-16">
        {productData?.pictures && productData.pictures.length > 0 && <ProductSlider pictures={productData?.pictures} />}
        <section className="md:mt-10">
          {productData?.category && <Link href={`/${companySlug}/categorias/${productData?.category.slug}`} className="bg-primaryLight px-2 rounded-full text-sm mb-4 block w-fit">{productData?.category?.name?.toUpperCase()}</Link>}
          <h1 className="font-semibold text-2xl sm:text-4xl text-gray-700">{productData?.name}</h1>
          <div className="flex items-center gap-4 mt-5 text-gray-600">
            <strong className="font-semibold text-3xl">{formattedPromoPrice ?? formattedPrice}</strong>
            {productData?.promoPrice && <span className="font-semibold bg-primaryLight px-2 py-0.5 rounded">{promoPercentage}%</span>}
          </div>
          {productData?.promoPrice && <span className="text-gray-500 text-lg line-through">{formattedPrice}</span>}

          <div className="mt-10 w-full grid grid-cols-1 gap-2 lg:grid-cols-2">
            <button onClick={handleAddToCart} className="border justify-center flex items-center gap-2 border-primary py-3 px-6 text-primary rounded-md hover:bg-primary hover:text-white transition-all">
              <FaCartPlus />
              Adicionar ao carrinho
            </button>
            <button className="bg-whatsapp text-white justify-center flex items-center gap-2 py-3 px-6 rounded-md hover:brightness-105 transition-all">
              <FaWhatsapp />
              Comprar via Whatsapp
            </button>
          </div>
        </section>
      </div>

      {productData?.description && (
        <section>
          <h2 className="font-semibold text-3xl text-gray-700 my-10 border-b border-primary pb-6">Detalhes do produto</h2>

          <div className="description prose prose-headings:mt-0 w-full !max-w-full">
            {parse(productData.description)}
          </div>
        </section>
      )}
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
  const productSlug = params?.slug as string

  await queryClient.prefetchQuery(catalogKeys.companyCatalog(slug), () => getCompanyCatalog(slug))
  await queryClient.prefetchQuery(catalogKeys.companyCategories(slug), () => getCompanyCatalogCategories(slug))
  await queryClient.prefetchQuery(catalogKeys.companyProduct(productSlug), () => getCompanyCatalogProductBySlug(slug, productSlug))

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}