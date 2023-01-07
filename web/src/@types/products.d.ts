declare namespace Products {
  export type Category = {
    id: string
    name: string
  }

  export type Variation = {
    name: string
    options: string[]
  }

  export type Variant = {
    id: string;
    name: string;
    options: {
      id: string;
      name: string;
    }[]
  }

  export type Picture = {
    id: string
    url: string
  }

  export type Product = {
    id: string
    name: string
    description: string
    price: number
    category: Products.Category
    variants: Products.Variant[]
    pictures: Products.Picture[]
  }
  
}