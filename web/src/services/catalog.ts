import api from "src/lib/axios"

export const getCompanyCatalog = async (slug: string) => {
  const { data } = await api.get(`/catalog/${slug}`)

  return data
}

export const getCompanyCatalogCategories = async (slug: string) => {
  const { data } = await api.get<Products.Category[]>(`/catalog/${slug}/categories`)

  return data
}

export const getCompanyCatalogProducts = async (slug: string) => {
  const { data } = await api.get<Products.CatalogProduct[]>(`/catalog/${slug}/products`)

  return data
}