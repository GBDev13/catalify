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
  }
}

export const createAccount = async (dto: CreateAccountDto) => {
  const { data } = await api.post("/auth/onboarding", dto)
  return data
}