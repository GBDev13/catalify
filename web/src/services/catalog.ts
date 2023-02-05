import api from "src/lib/axios"

type CatalogProductsResponse = {
  products: Products.CatalogProduct[]
  highlights: Products.CatalogProduct[]
}

type CatalogFilteredProductsResponse = {
  products: Products.CatalogProduct[]
  limit: number
  offset: number
  total: number
}

export const getCompanyCatalog = async (slug: string) => {
  const { data } = await api.get(`/catalog/${slug}`)

  return data
}

export const getCompanyCatalogCategories = async (slug: string) => {
  const { data } = await api.get<Products.Category[]>(`/catalog/${slug}/categories`)

  return data
}

export const getCompanyCatalogProducts = async (slug: string) => {
  const { data } = await api.get<CatalogProductsResponse>(`/catalog/${slug}/products`)

  return data
}

export const getCompanyCatalogBanners = async (slug: string) => {
  const { data } = await api.get<Company.Banner[]>(`/catalog/${slug}/banners`)

  return data
}

export const getCompanyCatalogProductBySlug = async (companySlug: string, productSlug: string) => {
  const { data } = await api.get<Products.CatalogProductDetails>(`/catalog/${companySlug}/products/${productSlug}`)

  return data
}

export const getCompanyCatalogFilteredProducts = async (slug: string, page: number, categories: string[], order: string, search: string) => {
  const { data } = await api.get<CatalogFilteredProductsResponse>(`/catalog/${slug}/filtered-products`, {
    params: {
      page,
      categories,
      order,
      search
    }
  })

  return data
}

export type OrderProduct = {
  name: string;
  productId: string;
  price: number;
  promoPrice: number;
  quantity: number;
  selectedVariants?: string[]
}

export const createOrder = async (slug: string, buyerName: string, buyerPhone: string, products: OrderProduct[]) => {
  const { data } = await api.post(`/order/${slug}`, {
    buyerName,
    buyerPhone,
    products
  })

  return data
}

export const getOrderById = async (orderId: string) => {
  const { data } = await api.get<Catalog.Order>(`/order/${orderId}`)
  return data
}

export const completeOrder = async (orderId: string) => {
  const { data } = await api.patch(`/order/${orderId}/complete`)
  return data
}