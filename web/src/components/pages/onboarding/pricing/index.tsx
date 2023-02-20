import { useMutation } from "@tanstack/react-query"
import clsx from "clsx"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"
import { toast } from "react-hot-toast"
import { FiCheck, FiCheckCircle } from "react-icons/fi"
import { Button } from "src/components/ui/Button"
import { formatPrice } from "src/helpers/format-price"
import { createSubscriptionCheckout } from "src/services/payment"

const similarFeatures = [
  'Catalogo digital',
  'Customização de cores e logo',
  'Importação de produtos via CSV',
]

export const PLANS = [
  {
    name: 'Plano gratuito',
    description: 'Continue gratuitamente com acesso a recursos limitados.',
    price: 0,
    features: [
      ...similarFeatures,
      'Até 10 produtos',
      'Até 5 categorias',
      'Até 3 imagens por produto',
      'Até 1 variação por produto',
      'Até 2 links de contato',
      'Suporte básico'
    ]
  },
  {
    name: 'Plano Premium',
    description: 'Com o plano premium, você tem acesso ilimitado a todos os recursos e suporte prioritário.',
    price: 24.90,
    features: [
      ...similarFeatures,
      'Produtos ilimitados',
      'Categorias ilimitadas',
      'Até 5 imagens por produto',
      'Até 2 variações por produto',
      'Até 10 links de contato',
      'Controle de estoque',
      'Destaque de produtos',
      'Página de links customizável',
      '3 Imagens de destaque no catálogo',
      'Suporte prioritário'
    ]
  }
]

type PricingProps = {
  hideFree?: boolean
  onClickFree?: () => void
  onClickPaid?: () => void
}

export const Pricing = ({ hideFree, onClickFree, onClickPaid }: PricingProps) => {
  const { data: session } = useSession()

  const { mutate: handleCheckoutPremium, isLoading } = useMutation(() => toast.promise(createSubscriptionCheckout(session?.user?.email!), {
    loading: "Criando sessão de pagamento...",
    success: "Sessão criada com sucesso!",
    error: (err) => err?.response?.data?.message || "Erro ao criar sessão de pagamento"
  }), {
    onSuccess: (checkoutUrl) => {
      window.location.href = checkoutUrl;
    }
  })

  const router = useRouter()

  const onCheckout = useCallback((isPaid: boolean) => {
    if (isPaid) {
      if(onClickPaid) {
        onClickPaid()
        return
      }
      handleCheckoutPremium()
      return
    }

    if(onClickFree) {
      onClickFree()
      return
    }
    router.push('/company/dashboard')
  }, [handleCheckoutPremium, onClickFree, onClickPaid, router])

  const routerPlan = router.query.plan as string

  useEffect(() => {
    if(routerPlan) {
      onCheckout(routerPlan === 'premium')
    }
  }, [onCheckout, routerPlan])

  return (
    <section className="w-full mt-16 gap-6 flex flex-col-reverse lg:grid lg:grid-cols-2">
      {PLANS.map(plan => {
        const formattedPrice = formatPrice(plan.price)
        const isPaid = plan.price > 0

        const showButton = hideFree ? isPaid : true

        return (
          <div key={plan.name} className="bg-white px-6 py-10 rounded-lg shadow-sm flex flex-col w-full">
            <div className="min-h-[150px]">
              <div className="flex items-center gap-1 mb-4">
                <strong className={clsx("text-3xl font-normal", {
                  "text-indigo-500 !font-semibold": isPaid,
                })}>{formattedPrice}</strong>
                {isPaid && <span className="text-slate-500 text-sm">/ mês</span>}
              </div>
              <h2 className="text-2xl">{plan.name}</h2>
              <p className="text-slate-400 font-light text-sm mt-1">{plan.description}</p>
            </div>

            <div className="mt-4 sm:mt-10">
              <h4>Funcionalidades:</h4>
              <ul className="flex flex-col gap-1.5 mt-2 min-h-[333px]">
                {plan.features.map((feature, index) => (
                  <li key={feature} className="text-slate-400 text-sm font-light flex items-center gap-1">
                    {isPaid ? index > similarFeatures.length - 1 ? (
                      <FiCheckCircle size={18} className="text-indigo-500" />
                    ) : (
                      <FiCheck size={18} className="text-slate-500" />
                    ) : (
                      <FiCheck size={18} className="text-slate-500" />
                    )}
                    {feature}
                  </li>
                ))}
              </ul>

              {showButton && (
                <Button onClick={() => onCheckout(isPaid)} isLoading={isLoading} variant={isPaid ? "PRIMARY" : "OUTLINE"} size="WIDE" className="mt-6">
                  {isPaid ? 'Assinar agora' : 'Continuar'}
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}