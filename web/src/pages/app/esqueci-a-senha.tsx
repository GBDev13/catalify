import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Logo } from "src/assets/Logo"
import { EmailStep } from "src/components/pages/forgot-password/steps/email-step"
import { NewPasswordStep } from "src/components/pages/forgot-password/steps/new-password-step"
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO"
import { LandingSEO } from "src/components/pages/shared/LandingSEO"

export default function ForgotPassword() {
  const router = useRouter()

  const token = router.query.token as string

  const [step, setStep] = useState(1)

  useEffect(() => {
    if (token) {
      setStep(2)
    }
  }, [token])

  return (
    <main className="w-screen h-screen grid grid-cols-1 grid-rows-[1.5fr,1fr] md:grid-rows-1 md:grid-cols-2">
      <LandingSEO title="Esqueci a Senha" />

      <section className="p-8 flex flex-col items-center">
        <div className="w-full max-w-[600px] mt-10 md:mt-20">
          <Link href="/">
            <Logo className="w-[180px] !text-indigo-500 mb-20" />
          </Link>

          {step === 1 ? <EmailStep /> : <NewPasswordStep />}
        </div>
      </section>

      <section className="w-full h-full bg-[url('/images/pattern.png')] bg-center bg-no-repeat bg-cover" />
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}