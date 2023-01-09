import api from "src/lib/axios"

type CatalogProductsResponse = {
  products: Products.CatalogProduct[]
  highlights: Products.CatalogProduct[]
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