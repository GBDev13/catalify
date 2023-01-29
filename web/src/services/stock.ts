import api from "src/lib/axios"

export const getCompanyStock = async (companyId: string) => {
  const { data } = await api.get(`/stock/${companyId}`)
  return data
}

export const getStockOptions = async (companyId: string) => {
  const { data } = await api.get<Stock.StockOption[]>(`/stock/${companyId}/stock-options`)
  return data
}

export type StockDto = {
  stockQuantity: {
    quantity: number;
    stockOptionId1?: string;
    stockOptionId2?: string;
  }[]
}

export const createProductStock = async (companyId: string, productId: string, stock: StockDto) => {
  const { data } = await api.post<Stock.StockTotalItem[]>(`/stock/${companyId}/product/${productId}`, stock)
  return data
}

export const deleteProductStock = async (companyId: string, productId: string) => {
  const { data } = await api.delete<Stock.StockTotalItem[]>(`/stock/${companyId}/product/${productId}`)
  return data
}

export const getProductStock = async (companyId: string, productId: string) => {
  const { data } = await api.get<Stock.StockDetailedItem[]>(`/stock/${companyId}/product/${productId}`)
  return data
}

export type UpdateStockDto = {
  stockQuantity: {
    quantity: number;
    productStockId: string;
  }[]
}

export const updateProductStock = async (companyId: string, productId: string, stock: UpdateStockDto) => {
  const { data } = await api.put(`/stock/${companyId}/product/${productId}`, stock)
  return data
}