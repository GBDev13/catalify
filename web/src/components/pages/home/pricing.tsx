import { useRouter } from "next/router"
import { Pricing } from "../onboarding/pricing"

export const PricingSection = () => {
  const router = useRouter();

  return (
    <section className="home-container py-16" id="pricing">
      <div className="text-center sm:px-14 -mb-2">
        <h2 className="font-semibold text-4xl">
          Planos que cabem no seu bolso
        </h2>
        <p className="sm:text-lg text-slate-500 mt-2">Oferecemos um plano gratuito e um plano premium. Escolha o que mais se adéqua às necessidades da sua empresa e <span className="text-indigo-500">comece a vender de forma eficiente</span> hoje mesmo com o Catalify.</p>
      </div>
      <Pricing
        onClickFree={() => router.push('/onboarding?plan=free')}
        onClickPaid={() => router.push('/onboarding?plan=premium')}
      />
    </section>
  )
}