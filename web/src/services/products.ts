import api from "src/lib/axios"

export const getProducts = async (companyId: string) => {
  const { data } = await api.get(`/product/${companyId}`)
  return data
}

export const getCategories = async (companyId: string) => {
  const { data } = await api.get(`/category/${companyId}`)
  return data
}

export const createCategory = async (category: string, companyId: string) => {
  return api.post(`/category/${companyId}`, { name: category })
}

export const updateCategory = async (category: Products.Category, companyId: string) => {
  return api.put(`/category/${companyId}`, category)
}

export const deleteCategory = async (categoryId: string, companyId: string) => {
  return api.delete(`/category/${companyId}/${categoryId}`)
}