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
  variations?: Products.Variation[]
}

export const createProduct = async (createProductDto: CreateProductDto, companyId: string) => {
  try {
    const formData = new FormData()

    formData.append('name', createProductDto.name)
    formData.append('description', createProductDto.description)
    formData.append('price', createProductDto.price.toString())

    if(createProductDto?.variations) {
      formData.append('variations', JSON.stringify(createProductDto.variations))
    }

    if(createProductDto.images) {
      createProductDto.images.forEach((image) => {
        formData.append(`images`, image)
      })
    }

    const response = await api.post(`/product/${companyId}`, formData)

    return response
  } catch (err) {
    return err
  }
}

export const deleteProduct = async (productId: string, companyId: string) => {
  const res = await api.delete(`/product/${companyId}/${productId}`)
  return res
}