import { ParseEditedResponse } from "src/helpers/on-change-existent-variations"
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

export const updateCategory = async (category: Omit<Products.Category, 'slug'>, companyId: string) => {
  return api.put(`/category/${companyId}`, category)
}

export const deleteCategory = async (categoryId: string, companyId: string) => {
  return api.delete(`/category/${companyId}/${categoryId}`)
}

export type CreateProductDto = Omit<Products.Product, 'categories' | 'id' | 'variants' | 'pictures' | 'isVisible'> & {
  images?: File[]
  categoriesIds?: string[]
  variations?: Products.Variation[]
}

export const createProduct = async (createProductDto: CreateProductDto, companyId: string) => {
  const formData = new FormData()

  formData.append('name', createProductDto.name)
  formData.append('description', createProductDto.description)
  formData.append('price', createProductDto.price.toString())

  if(createProductDto?.promoPrice) formData.append('promoPrice', createProductDto.promoPrice.toString())

  if (createProductDto?.categoriesIds) {
    createProductDto.categoriesIds.forEach((category) => {
      formData.append('categoriesIds', category)
    })
  }

  if(createProductDto?.variations) {
    formData.append('variations', JSON.stringify(createProductDto.variations))
  }

  if(createProductDto?.images) {
    createProductDto.images.forEach((image) => {
      formData.append(`images`, image)
    })
  }

  const { data } = await api.post<Products.Product>(`/product/${companyId}`, formData)

  return data
}

export type EditProductDto = Omit<Products.Product, 'categories' | 'id' | 'variants' | 'pictures' | 'isVisible'> & {
  variations?: ParseEditedResponse
  categoriesIds?: string[]
  images?: File[]
  imagesToRemove: string[]
}

export const editProduct = async (productId: string, companyId: string, editProductDto: EditProductDto) => {
  const formData = new FormData()

  formData.append('name', editProductDto.name)
  formData.append('price', editProductDto.price.toString())
  formData.append('description', editProductDto.description)
  if (editProductDto?.promoPrice) formData.append('promoPrice', editProductDto.promoPrice.toString())
  if (editProductDto?.categoriesIds) {
    editProductDto.categoriesIds.forEach((category) => {
      formData.append('categoriesIds', category)
    })
  }
  if(editProductDto?.variations) formData.append('variations', JSON.stringify(editProductDto.variations))

  if(editProductDto.imagesToRemove?.length > 0) {
    editProductDto.imagesToRemove.forEach((image) => {
      formData.append('imagesToRemove', image)
    })
  }

  if(editProductDto?.images) {
    editProductDto.images.forEach((image) => {
      formData.append(`images`, image)
    })
  }

  const response = await api.put(`/product/${companyId}/${productId}`, formData)

  return response
}

export const deleteProduct = async (productId: string, companyId: string) => {
  const res = await api.delete(`/product/${companyId}/${productId}`)
  return res
}

export const getProductById = async (productId: string) => {
  const { data } = await api.get<Products.Product>(`/product/details/${productId}`)
  return data
}

export const toggleHighlight = async (productId: string, companyId: string) => {
  return api.patch(`/product/${companyId}/${productId}/highlight`)
}

export const toggleVisibility = async (productId: string, companyId: string) => {
  return api.patch(`/product/${companyId}/${productId}/visible`)
}

export type ImportProduct = {
  categoriesNames?: string[];
  description: string;
  highlight: boolean
  name: string
  price: number
  promoPrice?: number
  visible: boolean
}

export const importProducts = async (companyId: string, products: ImportProduct[]) => {
  return api.post(`/product/${companyId}/import`, { products })
}

export const getProductsVariantsToCopy = async (companyId: string) => {
  const { data } = await api.get<Products.ProductVariantToCopy[]>(`/product/${companyId}/productsVariantsToCopy`);
  return data
}