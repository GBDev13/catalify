import { ReactNode } from "react"
import { Sidebar } from "src/components/pages/company/dashboard/Sidebar"

type CompanyDashboardLayout = {
  children: ReactNode
}

export const CompanyDashboardLayout = ({ children }: CompanyDashboardLayout) => {
  return (
    <main className="flex w-screen">
      <Sidebar />
      <div className="h-screen overflow-y-auto flex-1 p-8">
        {children}
      </div>
    </main>
  )
}