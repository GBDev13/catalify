import api from "src/lib/axios"

export const getCompanies = async () => {
  const { data } = await api.get<Admin.Company[]>("/super/companies")
  return data
}

export const getFiles = async () => {
  const { data } = await api.get<Admin.File[]>("/super/files")
  return data
}