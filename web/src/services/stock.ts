import api from "src/lib/axios"

export const getStockOptions = async (companyId: string) => {
  const { data } = await api.get<Stock.StockOption[]>(`/stock/${companyId}/stock-options`)
  return data
}