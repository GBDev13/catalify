import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { checkColorReadability } from "src/helpers/check-color-readability";
import { getFormattedPrices } from "src/helpers/getFormattedPrices";
import { useCatalog } from "src/store/catalog";

type ProductItemProps = {
  product: Products.CatalogProduct
}

export const ProductItem = ({ product }: ProductItemProps) => {
  const { colors, info } = useCatalog();

  const { formattedPrice, formattedPromoPrice, promoPercentage } = getFormattedPrices(product.price, product.promoPrice);

  const priceColor = colors?.primary ? checkColorReadability('#ffff', colors.primary, '#00000') : undefined

  return (
    <Link href={`/produtos/${product.slug}`} className={clsx("flex flex-col border hover:!border-primary overflow-hidden transition-colors rounded-lg p-4 border-primaryLight", {
      "grayscale": !product.hasStock
    })}>
      {!product.hasStock && (
        <span className="absolute z-10 text-xs top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl-lg">Sem estoque</span>
      )}
      <div className="group w-full h-200 overflow-hidden">
        <Image height={200} width={200} src={product?.picture ?? '/images/product-placeholder.svg'} alt={product.name} className={clsx("w-full object-contain h-[200px] group-hover:scale-110 transition-all duration-300", {
          "!object-cover": info?.config?.imageFitMode === 'cover',
        })} />
      </div>
      <strong title={product.name} className="text-sm my-2 font-normal text-gray-500 block line-clamp-2">{product.name}</strong>
      <div className="flex items-center gap-2 justify-center mt-auto">
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
}