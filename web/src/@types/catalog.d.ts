declare namespace Catalog {
  export type OrderStatus = "PENDING" | "FINISHED" | "EXPIRED";

  export type Order = {
    companyId: string;
    buyerName: string;
    buyerPhone: string;
    id: string
    createdAt: string;
    status: OrderStatus
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