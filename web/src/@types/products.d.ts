declare namespace Products {
  export type Category = {
    id: string
    name: string
  }

  export type Product = {
    id: string
    name: string
    description: string
    price: number
    category: Products.Category
  }

  export type Variation = {
    name: string
    options: string[]
  }
}