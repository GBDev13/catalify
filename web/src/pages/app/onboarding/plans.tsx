import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Pricing } from "src/components/pages/onboarding/pricing";
import clsx from "clsx";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";

export default function OnboardingPlans() {
  return (
    <main className={clsx("min-h-screen min-w-screen grid gap-4 grid-cols-1 grid-rows-[1.5fr,1fr] md:grid-cols-[1.5fr,1fr] md:grid-rows-1 grid-rows-[1fr,200px]")}>
      <DashboardSEO title="Onboarding" />

      <section className={clsx("flex flex-col items-center justify-start w-full p-10 md:py-20 md:px-8 max-w-[750px] mx-auto !px-4")}>
        <div className="w-full">
            <div className="self-start">
              <h2 className="font-semibold text-2xl"><span className="text-indigo-500">Olá!</span> Parece que esse é seu primeiro acesso</h2>
              <p className="text-slate-500">Por favor, escolha entre os nossos planos para aproveitar ao máximo nossos recursos e ferramentas.</p>
            </div>

            <Pricing />
          </div>
      </section>

      <section className="w-full h-full bg-[url('/images/onboarding.png')] bg-center bg-no-repeat bg-cover" />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}