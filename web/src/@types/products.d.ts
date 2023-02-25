declare namespace Products {
  export type Category = {
    id: string
    name: string
    slug: string
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
    promoPrice?: number
    isHighlighted?: boolean
    category: Products.Category
    variants: Products.Variant[]
    pictures?: Products.Picture[]
    isVisible: boolean
  }

  export type CatalogProduct = {
    id: string
    slug: string
    name: string
    price: number
    promoPrice: number
    picture?: string
    hasStock: boolean
  }
  
  export type CatalogProductDetails = Omit<CatalogProduct, 'picture'> & {
    description: string
    pictures: string[]
    variants: Products.Variant[]
    category?: {
      name: string;
      slug: string
    }
    stock: number | {
      quantity: number;
      variants: string[]
    }[] | null
  }

  export type ProductVariantToCopy = {
    productName: string;
    variants: {
      name: string;
      options: string[]
    }[]
  }
}