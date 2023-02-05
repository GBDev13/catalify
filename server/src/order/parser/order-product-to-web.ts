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

  const storedProduct = (product ?? orderProd) as any;

  return {
    id: storedProduct.id,
    name: storedProduct.name,
    price: orderProd.price,
    promoPrice: orderProd?.promoPrice,
    quantity: orderProd.quantity,
    variants: orderProd?.selectedVariants
      ? orderProd.selectedVariants.map((variant) => variant.name)
      : undefined,
    picture: product?.pictures?.length
      ? storedProduct.pictures[0]?.fileUrl
      : undefined,
  };
};
