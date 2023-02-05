import { Product, Stock } from '@prisma/client';

type ProductWithStock = Product & { stock: Stock[] };

export const addStockFlag = (products: ProductWithStock[]) => {
  return products.map((product) => {
    if (
      product.stock.length > 0 &&
      product.stock.every((x) => x.quantity <= 0)
    ) {
      return {
        ...product,
        hasStock: false,
      };
    }

    return {
      ...product,
      hasStock: true,
    };
  });
};
