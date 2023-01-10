import { formatPrice } from "./format-price"

export const getFormattedPrices = (price: number, promoPrice?: number) => {
  const promoPercentage = promoPrice ? Math.round((price - promoPrice) / price * 100) : null

  const formattedPrice = formatPrice(price)

  const formattedPromoPrice = promoPrice ? formatPrice(promoPrice ?? 0) : undefined

  return {
    promoPercentage,
    formattedPrice,
    formattedPromoPrice
  }
}