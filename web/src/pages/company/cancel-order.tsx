import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { Button } from "src/components/ui/Button";
import { createSubscriptionCheckout } from "src/services/payment";

export default function CancelPage() {
  const { data: session, status } = useSession()

  const checkoutIsDisabled = status !== 'authenticated';

  const { mutate: handleCheckoutPremium, isLoading } = useMutation(() => toast.promise(createSubscriptionCheckout(session?.user?.email!), {
    loading: "Criando sessão de pagamento...",
    success: "Sessão criada com sucesso!",
    error: (err) => err?.response?.data?.message || "Erro ao criar sessão de pagamento"
  }), {
    onSuccess: (checkoutUrl) => {
      window.location.href = checkoutUrl;
    }
  })

  const onCheckout = () => {
    if(checkoutIsDisabled) return;
    handleCheckoutPremium();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[url('/images/success-pattern.png')]">
      <DashboardSEO title="Checkout Cancelado" />

      <div className="bg-white text-center flex flex-col p-6 rounded-md shadow-sm w-full max-w-[600px]">
        <h1 className="text-4xl mb-3 text-indigo-500 font-semibold">Oops!</h1>
        <p className="text-slate-500 font-light">
          Parece que você cancelou o checkout do seu plano. Se você ainda deseja adquirir o plano premium, basta clicar no botão abaixo e continuar o checkout.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Link href="/company/dashboard">
            <Button size="WIDE" variant="OUTLINE">Continuar para o painel</Button>
          </Link>
          <Button size="WIDE" className="flex-1" isLoading={isLoading} disabled={checkoutIsDisabled} onClick={onCheckout}>Voltar ao Checkout</Button>
        </div>
      </div>
    </main>
  )
}