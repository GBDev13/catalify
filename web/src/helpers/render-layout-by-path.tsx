import { ReactNode } from "react";
import { CompanyDashboardLayout } from "src/components/ui/Layouts/CompanyDashboardLayout";

export const renderLayoutByPath = (path: string, component: ReactNode) => {
  if(path.startsWith('/company/dashboard')) {
    return (
      <CompanyDashboardLayout>
        {component}
      </CompanyDashboardLayout>
    )
  }

  return component
}