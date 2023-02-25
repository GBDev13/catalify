import Link from "next/link";
import { useCallback } from "react";
import { PLANS } from "src/components/pages/onboarding/pricing"
import { Button } from "src/components/ui/Button";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { useCompany } from "src/store/company"

export const CurrentPlan = () => {
  const { currentSubscription } = useCompany()

  const subscriptionIsValid = isSubscriptionValid(currentSubscription!)

  const currentPlan = subscriptionIsValid ? PLANS[1] : PLANS[0];

  const renderStatus = useCallback(() => {
    switch(currentSubscription?.status) {
      case 'ACTIVE':
        return <span className="text-slate-100 bg-indigo-500 px-3 py-1 rounded">ATIVO</span>
      case 'CANCELING':
        return (
          <div className="flex flex-col items-center gap-2">
            <span className="text-slate-100 bg-red-500 px-3 py-1 rounded">CANCELADA</span>
            <p className="text-sm text-slate-500">Valida até {new Date(currentSubscription?.expiresAt ?? '').toLocaleDateString()}</p>
          </div>
        )
      default:
        return (
          <Link href="/dashboard/plans">
            <Button>
              Assinar Premium
            </Button>
          </Link>
        )
    }
  }, [currentSubscription?.status])

  return (
    <div className="bg-slate-100 shadow-sm p-4 rounded">
      <div className="flex items-center justify-between flex-col sm:flex-row">
        <div>
          <strong className="text-3xl text-indigo-500">{currentPlan.name}</strong>
          <p className="text-slate-600">{currentPlan.description}</p>
        </div>

        {renderStatus()}
      </div>

      <h4 className="mt-4 mb-2 text-slate-600 font-semibold">Funcionalidades:</h4>
      <ul className="flex flex-wrap gap-2 list-disc marker:text-indigo-500">
        {currentPlan.features.map(feature => (
          <li key={feature} className="rounded-full py-0.5 ml-6 text-slate-500 text-sm font-light">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}