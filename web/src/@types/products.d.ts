declare namespace Products {
  export type Category = {
    id: string
    name: string
    slug: string
    isEditable?: boolean
    createdAt?: string
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
    categories: Products.Category[]
    variants: Products.Variant[]
    pictures?: Products.Picture[]
    isVisible: boolean
    isEditable?: boolean
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
    rawDescription: string
    pictures: string[]
    variants: Products.Variant[]
    categories?: {
      name: string;
      slug: string
    }[]
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