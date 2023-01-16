import api from 'src/lib/axios'

export const createSubscriptionCheckout = async (email: string) => {
  const { data } = await api.get('/payment-gateway/subscription/checkout', {
    params: {
      customerEmail: email
    }
  })

  return data
}