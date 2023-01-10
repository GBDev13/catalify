import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { checkColorReadability } from "src/helpers/check-color-readability"
import { formatPrice } from "src/helpers/format-price"
import { getFormattedPrices } from "src/helpers/getFormattedPrices"
import { useCatalog } from "src/store/catalog"

type ProductsListProps = {
  title: string
  products: Products.CatalogProduct[]
}

export const ProductsList = ({ products, title }: ProductsListProps) => {
  const { colors, info: { slug } } = useCatalog();
  return (
    <section>
      <h3 className="text-3xl font-semibold text-primary my-10 text-center">{title}</h3>

      <div className={clsx("grid gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] text-center", {
        "grid-cols-1 lg:grid-cols-2": products.length === 1,
      })}>
        {products.map(product => {
          const { formattedPrice, formattedPromoPrice, promoPercentage } = getFormattedPrices(product.price, product.promoPrice);

          const priceColor = colors?.primary ? checkColorReadability('#ffff', colors.primary, '#00000') : undefined

          return (
            <Link href={`/${slug}/produtos/${product.slug}`} key={product.id} className="border hover:!border-primary transition-colors rounded-lg p-4 border-primaryLight">
              <div className="group w-full h-200 overflow-hidden">
                <Image height={200} width={200} src={product.picture} alt={product.name} className="w-full object-contain h-[200px] group-hover:scale-110 transition-all duration-300" />
              </div>
              <strong title={product.name} className="text-sm my-2 font-normal text-gray-500 block line-clamp-2">{product.name}</strong>
              <div className="flex items-center gap-2 justify-center">
                {product?.promoPrice && (
                  <span className="text-xs text-gray-400 line-through">{formattedPrice}</span>
                )}
                <span className="text-xl font-semibold text-center block" style={{ color: priceColor }}>{product?.promoPrice ? formattedPromoPrice : formattedPrice}</span>
                {promoPercentage && (
                  <span className="px-2 rounded-full text-sm text-white bg-primary">{promoPercentage}%</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}