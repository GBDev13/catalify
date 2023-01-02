import api from "src/lib/axios"

export const getProducts = async (companyId: string) => {
  const { data } = await api.get(`/product/${companyId}`)
  return data
}