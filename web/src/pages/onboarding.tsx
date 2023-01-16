import { useState } from "react";
import { Stepper } from "../components/ui/Stepper/index.tsx";
import { OnboardingForm } from "../components/pages/onboarding/form";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Pricing } from "src/components/pages/onboarding/pricing";
import clsx from "clsx";

export default function Onboarding() {
  const [step, setStep] = useState(1)

  return (
    <main className={clsx("min-h-screen min-w-screen grid gap-4 grid-cols-1 grid-rows-[1.5fr,1fr] md:grid-cols-[1.5fr,1fr] md:grid-rows-1", {
      "grid-rows-[1fr,200px]": step >= 2,
    })}>
      <section className={clsx("flex flex-col items-center justify-start w-full p-10 md:py-20 md:px-8 max-w-[750px] mx-auto", {
        "!px-4": step >= 2
      })}>
        {step <= 2 ? (
          <>
            <div className="w-full mb-8 md:mb-20">
              <Stepper currentStep={step} steps={["Dados da Conta", "Dados da Empresa"]} />
            </div>

            <OnboardingForm setStep={setStep} step={step} />
          </>
        ) : (
          <div className="w-full">
            <div className="self-start">
              <h2 className="font-semibold text-2xl"><span className="text-indigo-500">Parabéns!</span> Sua conta foi criada com sucesso</h2>
              <p className="text-slate-500">Agora você pode escolher entre o nossos planos para aproveitar ao máximo nossos recursos e ferramentas. </p>
            </div>

            <Pricing />
          </div>
        )}
      </section>

      <section className="w-full h-full bg-[url('/images/onboarding.png')] bg-center bg-no-repeat bg-cover" />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (session) {
    return {
      redirect: {
        destination: "/company/dashboard",
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}