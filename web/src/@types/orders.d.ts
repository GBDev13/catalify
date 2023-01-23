declare namespace Orders {
  export type OrderStatus = "PENDING" | "EXPIRED" | "FINISHED"

  export type OrderProduct = {
    price: number;
    promoPrice?: number;
    quantity: number;
    id: string;
    name: string;
    picture?: string
    variants?: string[]
  }

  export type Order = {
    id: string;
    buyerName: string;
    buyerPhone: string;
    status: OrderStatus
    expiresAt: string
    createdAt: string
    products: OrderProduct[]
  }
}