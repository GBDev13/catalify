import {
  File,
  OrderProducts,
  Product,
  ProductVariantOption,
} from '@prisma/client';

type OrderProductType = OrderProducts & {
  product: Product & {
    pictures: File[];
  };
  selectedVariants: ProductVariantOption[];
};

export const orderProductToWeb = (orderProduct: OrderProductType) => {
  const { product, ...orderProd } = orderProduct;

  return {
    id: product.id,
    name: product.name,
    price: orderProd.price,
    promoPrice: orderProd?.promoPrice,
    quantity: orderProd.quantity,
    variants: orderProd?.selectedVariants
      ? orderProd.selectedVariants.map((variant) => variant.name)
      : undefined,
    picture: product?.pictures?.length
      ? product.pictures[0]?.fileUrl
      : undefined,
  };
};
