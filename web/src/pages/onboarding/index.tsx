import { useCallback, useEffect, useState } from "react";
import { Stepper } from "../../components/ui/Stepper/index.tsx";
import { OnboardingForm } from "../../components/pages/onboarding/form";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Pricing } from "src/components/pages/onboarding/pricing";
import clsx from "clsx";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { useRouter } from "next/router";
import { GoMailRead } from "react-icons/go"
import Link from "next/link";
import { Button } from "src/components/ui/Button";
import jwt_decode from "jwt-decode";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { resendVerificationEmail, verifyEmail } from "src/services/account";

export default function Onboarding() {
  const [step, setStep] = useState(1)

  const router = useRouter();
  const token = router.query.token as string

  const [tokenIsValid, setTokenIsValid] = useState<boolean | null>(null)
  const [tokenIsExpired, setTokenIsExpired] = useState<boolean | null>(null)
  const [tokenResent, setTokenResent] = useState(false)

  const handleProcessToken = (token: string) => {
    setStep(3)
    try {
      const parsedToken = jwt_decode(token) as any;
      const expiresAt = new Date(parsedToken.exp * 1000);

      if(expiresAt < new Date()) {
        setTokenIsExpired(true)
        return
      }

      setTokenIsValid(true)
      setTokenIsExpired(false)
    } catch {
      setTokenIsValid(false)
    }
  }

  const { mutateAsync: handleResendVerificationEmail } = useMutation((oldToken: string) => toast.promise(resendVerificationEmail(oldToken), {
    loading: "Enviando e-mail de verificação",
    success: "E-mail de verificação enviado com sucesso",
    error: (err) =>  err?.response?.data?.message ?? "Ocorreu um erro ao enviar o e-mail de verificação"
  }), {
    onError: () => setTokenResent(false)
  })

  const { mutateAsync: handleVerifyEmail } = useMutation((token: string) => verifyEmail(token), {
    onSuccess: () => {
      console.log('setei')
      localStorage.setItem("catalify:showPlans", "true")
    },
    onError: () => {
      setTokenIsExpired(true)
    }
  })

  useEffect(() => {
    if(tokenIsExpired === false && tokenIsValid) {
      handleVerifyEmail(token)
    }
  }, [handleVerifyEmail, token, tokenIsExpired, tokenIsValid])

  const handleRequestNewToken = useCallback(async () => {
    setTokenResent(true)
    try {
      await handleResendVerificationEmail(token)
    } catch {}
  }, [handleResendVerificationEmail, token])

  const renderLastStep = useCallback(() => {
    if(!token) {
      return (
        <>
          <div className="self-start">
            <h2 className="font-semibold text-2xl"><span className="text-indigo-500">Parabéns!</span> Sua conta foi criada com sucesso</h2>
            <div className="text-indigo-500 flex flex-col items-center my-10">
              <GoMailRead className="w-24 h-24" />
              <span className="font-semibold text-xl">Verifique seu E-mail</span>
            </div>
            <p className="text-slate-500 text-lg text-center">
              Enviamos um e-mail com instruções para você ativar sua conta. Caso não encontre o e-mail, verifique sua caixa de spam.
            </p>
            <Link href="/login">
              <Button className="ml-auto mt-10">
                Ir para o Login
              </Button>
            </Link>
          </div>
        </>
      )
    }
    if(token && tokenIsValid) {
      return (
        <>
          <div className="self-start">
            <h2 className="font-semibold text-2xl"><span className="text-indigo-500">Parabéns!</span> Sua conta foi verificada com sucesso</h2>
            <p className="text-slate-500">
              Clique no botão abaixo para ir para a página de login.
            </p>
            <Link href="/login">
              <Button className="ml-auto mt-10">
                Ir para o Login
              </Button>
            </Link>
          </div>
        </>
      )
    }
    if(token && tokenIsExpired) {
      return (
        <div className="self-start">
          <h2 className="font-semibold text-2xl"><span className="text-indigo-500">Oops!</span> Parece que seu token expirou</h2>
          <p className="text-slate-500">
            Clique no botão abaixo para solicitar um novo token de verificação.
          </p>
          <div className="ml-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/login">
              <Button size="WIDE" variant="OUTLINE">
                Voltar para o login
              </Button>
            </Link>
            <Button size="WIDE" onClick={handleRequestNewToken} disabled={tokenResent}>
              Solicitar Novo Token
            </Button>
          </div>
        </div>
      )
    }
    if(token && tokenIsValid === false) {
      toast.error("Ocorreu um erro ao processar o token")
      router.push("/login")
      return null
    }
  }, [handleRequestNewToken, router, token, tokenIsExpired, tokenIsValid, tokenResent])

  useEffect(() => {
    if(token) {
      handleProcessToken(token)
    }
  }, [token])

  return (
    <main className={clsx("min-h-screen min-w-screen grid gap-4 grid-cols-1 grid-rows-[1.5fr,1fr] md:grid-cols-[1.5fr,1fr] md:grid-rows-1", {
      "grid-rows-[1fr,200px]": step >= 2,
    })}>
      <DashboardSEO title="Onboarding" />

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
            {renderLastStep()}
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