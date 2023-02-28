import Link from "next/link";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { Button } from "src/components/ui/Button";
import ConfettiExplosion from 'react-confetti-explosion';
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsExploding(true);
    }, 400);

    return () => clearTimeout(timeout);
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[url('/images/success-pattern.png')]">
      <DashboardSEO title="Pedido Confirmado" />
      <div className="bg-white text-center flex flex-col p-6 rounded-md shadow-sm w-full max-w-[600px]">
        <img src="/images/success-star.svg" className="w-[100px] mx-auto mb-4" />
        <h1 className="text-4xl mb-3 text-indigo-500 font-semibold">Parabéns!</h1>
        <p className="text-slate-500 font-light">
          Você acaba de adquirir o <span className="text-indigo-500 font-normal">plano premium</span>! Agora você tem acesso ilimitado a todos os recursos. Aproveite ao máximo todos os benefícios e comece a alcançar seus objetivos agora.
        </p>

        <Link href="/dashboard">
          <Button size="WIDE" className="mt-6">Continuar para o painel</Button>
        </Link>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {isExploding && (
          <ConfettiExplosion
            force={0.85}
            duration={3000}
            particleCount={300}
            width={window.innerWidth}
            colors={
              [
                "#6366f1",
                "#818cf8",
                "#c7d2fe",
                "#4f46e5",
                "#e0e7ff"
              ]
            }
          />
        )}
      </div>
    </main>
  )
}