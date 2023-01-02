import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { ReactNode } from "react"
import { companyKeys } from "src/constants/query-keys"
import { getUserCompany } from "src/services/company"
import { useCompany } from "src/store/company"

type GlobalStateProps = {
  children: ReactNode
}

export const GlobalState = ({ children }: GlobalStateProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id!

  const { setCompany } = useCompany()

  useQuery(companyKeys.userCompanyInfo(userId), getUserCompany, {
    enabled: !!userId,
    onSuccess(data) {
      setCompany(data)
    },
  })

  return (
    <>
      {children}
    </>
  )
}