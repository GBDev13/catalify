declare namespace Stock {
  export type StockOptionVariants = {
    id: string;
    name: string;
    options: {
      id: string;
      name: string;
    }[]
  }

  export type StockOption = {
    id: string;
    name: string;
    variants: StockOptionVariants[]
  }

  export type StockTotalItem = {
    id: string;
    productName: string;
    total: number;
    hasVariants: boolean;
  }

  type StockVariantOption = {
    createdAt: string;
    name: string;
    productVariant: {
      name: string;
      id: string;
    }
  };

  export type StockDetailedItem = {
    id: string;
    productId: string;
    productVariantOptionId?: string;
    productVariantOption?: StockVariantOption;
    productVariantOptionId2?: string;
    productVariantOption2?: StockVariantOption;
    quantity: number;
    createdAt: string;
  }
}