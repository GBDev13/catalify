declare namespace Catalog {
  export type Order = {
    buyerName: string;
    buyerPhone: string;
    id: string
    createdAt: string;
    products: {
      id: string;
      name: string;
      promoPrice?: number;
      price: number;
      quantity: number;
      picture?: string
      variants?: string[]
    }[]
  }
}