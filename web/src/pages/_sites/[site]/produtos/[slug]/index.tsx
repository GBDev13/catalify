import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query"
import { GetStaticPaths, GetStaticProps } from "next"
import { FaCartPlus, FaWhatsapp } from "react-icons/fa"
import { ProductSlider } from "src/components/pages/catalog/product/slider/slider"
import { CatalogLayout } from "src/components/ui/Layouts/CatalogLayout"
import { catalogKeys } from "src/constants/query-keys"
import { getCompanyCatalog, getCompanyCatalogCategories, getCompanyCatalogProductBySlug } from "src/services/catalog"
import parse from 'html-react-parser';
import Link from "next/link"
import { getFormattedPrices } from "src/helpers/getFormattedPrices"
import { useCart } from "src/store/cart"
import { toast } from "react-hot-toast"
import { CatalogInfo } from "src/store/catalog"
import { useCallback, useMemo, useState } from "react"
import clsx from "clsx"

type ProductPageProps = {
  companyCatalog: CatalogInfo
  product: Products.CatalogProductDetails
}

export default function Produto({ product, companyCatalog }: ProductPageProps) {
  const { formattedPrice, formattedPromoPrice, promoPercentage } = getFormattedPrices(product?.price!, product?.promoPrice)

  const { addProductToCart, setCartIsOpen, cartItems, setCheckoutFormDialogIsOpen } = useCart();

  const pictures = product?.pictures?.length ? product.pictures : ['/images/product-placeholder.svg']

  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

  const handleSelectVariation = (id: string, value: string) => {
    setSelectedVariations(prevState => ({ ...prevState, [id]: value }))
  }

  const getSelectedVariant = (variantId: string) => {
    const key = variantId as keyof typeof selectedVariations
    return selectedVariations[key] ?? ""
  }

  const buyDisabled = Object.keys(selectedVariations).length !== product?.variants?.length;

  const currentStock = useMemo(() => {
    const stock = product?.stock;
    if (stock === null) return null;

    if(typeof stock === 'number') return stock;

    if (typeof stock === 'object') {
      const stockItem = stock.find(x => {
        return x.variants.filter(x => !!x).every(variant => {
          return Object.values(selectedVariations).includes(variant)
        })
      })

      return stockItem?.quantity ?? 0;
    }

    return null
  }, [product?.stock, selectedVariations])

  const renderStock = useCallback(() => {
    if(product?.variants && product?.variants.length > 0 && Object.values(selectedVariations).length !== product?.variants?.length) return null;
    
    if(typeof currentStock === 'number') {
      if(currentStock === 1) return (
        <span className="text-red-600/60 mt-2 block">
          Última unidade
        </span>
      )

      return (
        <span className="text-gray-600/60 mt-2 block">
          {currentStock <= 0 ? 'Sem estoque' : `Estoque: ${currentStock}`}
        </span>
      )
    }
    return null
  }, [currentStock, product?.variants, selectedVariations])

  const checkoutDisabled = (typeof currentStock === 'number' ? currentStock <= 0 : false) || buyDisabled;

  const handleAddToCart = (silent = false) => {
    if(checkoutDisabled) return;

    const productExistsOnCart = cartItems.find(x => {
      const sameId = x.id === product?.id;
      const sameVariants = x?.variants?.every(variant => {
        const selectedVariant = selectedVariations[variant.id];
        return selectedVariant === variant.optionId;
      })

      return sameId && sameVariants;
    });

    if(typeof currentStock === 'number' && productExistsOnCart && productExistsOnCart.quantity + 1 > currentStock) {
      toast.error('Quantidade máxima atingida')
      return;
    }

    const variants = Object.entries(selectedVariations).map(([variantId, optionId]) => {
      const productVariants = product?.variants ?? [];
      const selectedVariant = productVariants.find(x => x.id === variantId);

      return {
        id: variantId,
        name: selectedVariant?.name ?? '',
        option: selectedVariant?.options?.find(x => x.id === optionId)?.name ?? '',
        optionId,
      }
    });

    addProductToCart({
      id: product?.id!,
      name: product?.name!,
      price: product?.price!,
      promoPrice: product?.promoPrice!,
      slug: product?.slug!,
      picture: product?.pictures ? product?.pictures[0] : undefined,
      variants
    })
    setCartIsOpen(true);

    if(!silent) {
      toast.success('Produto adicionado ao carrinho')
    }
  }

  const handleBuy = () => {
    handleAddToCart(true)
    setCheckoutFormDialogIsOpen(true);
  }

  return (
    <CatalogLayout title={product.name} description={product.rawDescription} openGraph={{
      ...(product.pictures && product.pictures.length > 0 && {
        description: product.rawDescription,
        images: [
          {
            url: product.pictures[0],
            width: 800,
            height: 420,
            alt: product.name
          }
        ]
      })
    }} catalogData={companyCatalog}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr,1.4fr] gap-16 mt-16">
        <ProductSlider pictures={pictures} />
        <section className="md:mt-8">
          {(product?.categories?.length ?? 0) > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-5">
              {product?.categories?.map(category => (
                <Link key={category.slug} href={`/produtos/?category=${category.slug}`} shallow className="bg-primaryLight text-readable px-2 rounded-full text-sm block w-fit">{category?.name?.toUpperCase()}</Link>
              ))}
            </div>
          )}
          <h1 className="font-semibold text-2xl sm:text-4xl text-gray-700">{product?.name}</h1>
          <div className="flex items-center gap-4 mt-5 text-gray-600">
            <strong className="font-semibold text-3xl">{formattedPromoPrice ?? formattedPrice}</strong>
            {product?.promoPrice && <span className="font-semibold bg-primaryLight text-readable px-2 py-0.5 rounded">{promoPercentage}%</span>}
          </div>
          {product?.promoPrice && <span className="text-gray-500 text-lg line-through">{formattedPrice}</span>}

          {renderStock()}

          {product?.variants && product?.variants.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {product?.variants.map((variant, index) => (
                <div className={clsx("flex flex-col", {
                  "col-span-full": product?.variants?.length % 2 !== 0 && index === product?.variants?.length - 1
                })} key={variant.id}>
                  <label htmlFor={variant.id} className="text-gray-400 text-sm mb-1">{variant.name}</label>
                  <select
                    id={variant.id}
                    className="text-sm py-2 pl-6 pr-9 text-center rounded-lg focus:ring-0 border border-gray-400 focus:border-primary text-gray-500"
                    onChange={({ target }) => handleSelectVariation(variant.id, target.value)}
                    value={getSelectedVariant(variant.id)}
                  >
                    <option value="" disabled>Selecione</option>
                    {variant.options.map(option => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 w-full grid grid-cols-1 gap-2 lg:grid-cols-2">
            <button disabled={checkoutDisabled} onClick={() => handleAddToCart()} className="disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed border justify-center flex items-center gap-2 border-primary py-3 px-6 text-primary rounded-md hover:bg-primary hover:text-white transition-all">
              <FaCartPlus />
              Adicionar ao carrinho
            </button>
            <button disabled={checkoutDisabled} onClick={handleBuy} className="disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed bg-whatsapp text-white justify-center flex items-center gap-2 py-3 px-6 rounded-md hover:brightness-105 transition-all">
              <FaWhatsapp />
              Comprar via Whatsapp
            </button>
          </div>
        </section>
      </div>

      {product?.description && (
        <section>
          <h2 className="font-semibold text-3xl text-gray-700 my-10 border-b border-primary pb-6">Detalhes do produto</h2>

          <div className="description prose prose-headings:mt-0 w-full !max-w-full">
            {parse(product.description)}
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

  const slug = params?.site as string
  const productSlug = params?.slug as string

  await queryClient.prefetchQuery(catalogKeys.companyCatalog(slug), () => getCompanyCatalog(slug))
  await queryClient.prefetchQuery(catalogKeys.companyCategories(slug), () => getCompanyCatalogCategories(slug))
  await queryClient.prefetchQuery(catalogKeys.companyProduct(productSlug), () => getCompanyCatalogProductBySlug(slug, productSlug))

  const company = queryClient.getQueryData(catalogKeys.companyCatalog(slug))
  const product = queryClient.getQueryData(catalogKeys.companyProduct(productSlug))

  if(!product) {
    return {
      props: {},
      redirect: {
        destination: `/produtos`
      },
    }
  }

  return {
    props: {
      companyCatalog: company,
      product,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 6, // 6 hours
  }
}