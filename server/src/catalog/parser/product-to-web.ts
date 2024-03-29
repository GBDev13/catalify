import {
  Category,
  File,
  Product,
  ProductVariant,
  ProductVariantOption,
  Stock,
} from '@prisma/client';

import { convert } from 'html-to-text';

type DetailedStock = Stock & {
  productVariantOption: ProductVariantOption;
  productVariantOption2: ProductVariantOption;
};

type ProductType = Product & {
  pictures: File[];
  variants: (ProductVariant & { options: ProductVariantOption[] })[];
  stock: DetailedStock[];
  hasStock: boolean;
  categories: Category[];
};

type ProductDetailedType = ProductType;

export const productToWeb = (
  product: ProductType,
  hasSubscription: boolean,
) => {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    promoPrice: product?.promoPrice,
    picture: product?.pictures?.length
      ? product.pictures[0]?.fileUrl
      : undefined,
    hasStock: hasSubscription ? product.hasStock : true,
  };
};

export const productStockToWeb = (stock: DetailedStock[]) => {
  if (!stock || stock?.length <= 0) return null;

  const withoutVariants =
    stock.length === 1 &&
    !stock[0].productVariantOptionId &&
    !stock[0].productVariantOptionId2;

  if (withoutVariants) {
    return stock[0].quantity;
  }

  return stock.map((x) => {
    return {
      quantity: x.quantity,
      variants: [x.productVariantOptionId, x.productVariantOptionId2],
    };
  });
};

export const productDetailedToWeb = (
  product: Omit<ProductDetailedType, 'hasStock'>,
) => {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    promoPrice: product?.promoPrice,
    description: product?.description,
    ...(!!product?.description && {
      rawDescription: convert(product.description),
    }),
    pictures: product?.pictures?.map((x) => x.fileUrl),
    variants: product?.variants
      ? product.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          options: variant.options.map((option) => ({
            id: option.id,
            name: option.name,
          })),
        }))
      : undefined,
    categories:
      product?.categories?.length > 0
        ? product?.categories?.map((category) => ({
            slug: category.slug,
            name: category.name,
          }))
        : undefined,
    stock: productStockToWeb(product?.stock),
  };
};
