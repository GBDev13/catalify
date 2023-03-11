declare namespace Admin {
  export type Company = {
    id: string;
    slug: string;
    name: string;
    createdAt: string;
    owner: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    }
    subscription: Company.Subscription[]
    quantities: {
      products: number;
      categories: number;
      orders: number
    }
  }

  export type File = {
    id: string;
    fileName: string;
    fileUrl: string;
    key: string;
    productId: string | null;
    createdAt: string;
  }
}