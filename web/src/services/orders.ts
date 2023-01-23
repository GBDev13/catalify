import api from "src/lib/axios"

export const getOrders = async (companyId: string) => {
  const { data } = await api.get<Orders.Order[]>(`/order/${companyId}/all`)
  return data
}

export const getOrderById = async (orderId: string) => {
  const { data } = await api.get<Orders.Order>(`/order/${orderId}`)
  return data
}

export const completeOrder = async (orderId: string) => {
  const { data } = await api.patch(`/order/${orderId}/complete`)
  return data
}