import { useRouter } from "next/router";
import { useEffect } from "react";
import { Pricing } from "src/components/pages/onboarding/pricing";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { withAuth } from "src/helpers/withAuth";
import { useCompany } from "src/store/company";

function PlansPage() {
  const { currentSubscription } = useCompany()
  const hasSubscription = isSubscriptionValid(currentSubscription!);

  const router = useRouter()

  useEffect(() => {
    if (hasSubscription) {
      router.replace('/dashboard/plan')
    }
  }, [hasSubscription, router])

  if(hasSubscription) return null;

  return (
    <div>
      <DashboardSEO title="Planos" />

      <PageTitle title="Planos" />

      <h2 className="text-center text-slate-600 text-xl sm:text-2xl">
        Escolha o plano que mais se encaixa com a sua empresa
      </h2>

      <div className="-mt-10">
        <Pricing hideFree />
      </div>
    </div>
  )
}

export const getServerSideProps = withAuth(async (context) => {
  return { props: {} };
});

export default PlansPage;