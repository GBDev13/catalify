import { CurrentPlan } from "src/components/pages/company/dashboard/plan/current-plan";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";

export default function Plan() {
  return (
    <>
      <DashboardSEO title="Plano" />

      <PageTitle title="Gerenciar Plano">
        <a target="_blank" href={process.env.NEXT_PUBLIC_SUBSCRIPTION_MANAGE_URL} rel="noreferrer">
          <Button variant="OUTLINE">
            Portal do cliente
          </Button>
        </a>
      </PageTitle>

      <section>
        <CurrentPlan />
      </section>      
    </>
  )
}