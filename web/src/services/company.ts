import api from 'src/lib/axios'

export const getUserCompany = async () => {
  const { data } = await api.get('/company')
  return data
}