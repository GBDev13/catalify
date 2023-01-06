import api from "src/lib/axios"

export const getProducts = async (companyId: string) => {
  const { data } = await api.get(`/product/${companyId}`)
  return data
}

export const getCategories = async (companyId: string): Promise<Products.Category[]> => {
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

export type CreateProductDto = Omit<Products.Product, 'category' | 'id'> & {
  images: File[]
  categoryId?: string
}

export const createProduct = async (createProductDto: CreateProductDto, companyId: string) => {
  const formData = new FormData()

  formData.append('name', createProductDto.name)
  formData.append('description', createProductDto.description)
  formData.append('price', createProductDto.price.toString())

  if(createProductDto.images) {
    createProductDto.images.forEach((image) => {
      formData.append(`images`, image)
    })
  }

  return api.post(`/product/${companyId}`, formData)
}

export const deleteProduct = async (productId: string, companyId: string) => {
  return api.delete(`/product/${companyId}/${productId}`)
}