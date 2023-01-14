import { File, OrderProducts, Product } from '@prisma/client';

type OrderProductType = OrderProducts & {
  product: Product & {
    pictures: File[];
  };
};

export const orderProductToWeb = (orderProduct: OrderProductType) => {
  const { product, ...orderProd } = orderProduct;

  return {
    id: product.id,
    name: product.name,
    price: orderProd.price,
    promoPrice: orderProd?.promoPrice,
    quantity: orderProd.quantity,
    picture: product?.pictures?.length
      ? product.pictures[0]?.fileUrl
      : undefined,
  };
};
