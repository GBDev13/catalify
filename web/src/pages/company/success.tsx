import Link from "next/link";
import { Button } from "src/components/ui/Button";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[url('/images/success-pattern.png')]">
      <div className="bg-white text-center flex flex-col p-6 rounded-md shadow-sm w-full max-w-[600px]">
        <img src="/images/success-star.svg" className="w-[100px] mx-auto mb-4" />
        <h1 className="text-4xl mb-3 text-indigo-500 font-semibold">Parabéns!</h1>
        <p className="text-slate-500 font-light">
          Você acaba de adquirir o <span className="text-indigo-500 font-normal">plano premium</span>! Agora você tem acesso ilimitado a todos os recursos. Aproveite ao máximo todos os benefícios e comece a alcançar seus objetivos agora.
        </p>

        <Link href="/company/dashboard">
          <Button size="WIDE" className="mt-6">Continuar para o painel</Button>
        </Link>
      </div>
    </main>
  )
}