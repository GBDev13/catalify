import {
  Category,
  File,
  Product,
  ProductVariant,
  ProductVariantOption,
} from '@prisma/client';

type ProductType = Product & {
  pictures: File[];
  variants: (ProductVariant & { options: ProductVariantOption[] })[];
};

type ProductDetailedType = ProductType & { category: Category };

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

export const productDetailedToWeb = (product: ProductDetailedType) => {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    promoPrice: product?.promoPrice,
    description: product?.description,
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
    category: product?.category?.name
      ? {
          slug: product.category.slug,
          name: product.category.name,
        }
      : undefined,
  };
};
