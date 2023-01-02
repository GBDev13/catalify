import { useState } from "react";
import { Stepper } from "../components/ui/Stepper/index.tsx";
import { OnboardingForm } from "../components/pages/onboarding/form";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

export default function Onboarding() {
  const [step, setStep] = useState(1)

  return (
    <main className="h-screen w-screen grid gap-4 grid-cols-1 grid-rows-[1.5fr,1fr] md:grid-cols-[1.5fr,1fr] md:grid-rows-1">
      <section className="flex flex-col items-center justify-start w-full p-10 md:py-20 md:px-8 max-w-[750px] mx-auto">
        <div className="w-full mb-8 md:mb-20">
          <Stepper currentStep={step} steps={["Dados da Conta", "Dados da Empresa"]} />
        </div>

        <OnboardingForm setStep={setStep} step={step} />
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