import { File, Product } from '@prisma/client';

type ProductType = Product & { pictures: File[] };

export const productToWeb = (product: ProductType) => {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    promoPrice: product?.promoPrice,
    picture: product?.pictures?.length
      ? product.pictures[0]?.fileUrl
      : undefined,
  };
};
