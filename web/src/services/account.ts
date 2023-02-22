import { getBase64 } from "src/helpers/get-base64"
import api from "src/lib/axios"

type CreateAccountDto = {
  user: {
    firstName: string
    lastName: string
    email: string
    password: string
  }
  company: {
    name: string
    themeColor: string
    slug: string
    phone: string
    logo?: File
  }
}

export const createAccount = async (dto: CreateAccountDto) => {
  let companyLogo: string | undefined = undefined

  if (dto.company?.logo) {
    companyLogo = await getBase64(dto.company.logo)
  }

  const { data } = await api.post("/auth/onboarding", {
    ...dto,
    company: {
      ...dto.company,
      logo: companyLogo,
    }
  })
  return data
}

export const forgotPassword = async (email: string) => {
  const { data } = await api.post("/auth/forgot-password", { email })
  return data
}

export const resetPassword = async (token: string, password: string) => {
  const { data } = await api.post("/auth/reset-password", { token, password })
  return data
}