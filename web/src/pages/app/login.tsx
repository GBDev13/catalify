import { zodResolver } from "@hookform/resolvers/zod"
import { GetServerSideProps } from "next"
import { getSession, signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { Logo } from "src/assets/Logo"
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO"
import { Button } from "src/components/ui/Button"
import { Divider } from "src/components/ui/Divider"
import { ControlledInput } from "src/components/ui/Input/controlled"
import { notify } from "src/helpers/toast"
import { z } from "zod"

const loginFormSchema = z.object({
  email: z.string({
    required_error: "Email é obrigatório"
  }).email({
    message: "Email inválido"
  }),
  password: z.string({
    required_error: "Senha é obrigatória"
  })
})

type LoginFormData = z.infer<typeof loginFormSchema>

export default function Login() {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema)
  })

  const router = useRouter()

  const handleLogin = async (data: LoginFormData) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password
    })

    if(res?.ok) {
      const shouldShowPlans = !!localStorage.getItem("catalify:showPlans")
      if(shouldShowPlans) {
        localStorage.removeItem("catalify:showPlans")
        await router.push("/onboarding/plans")
        return
      }
      await router.push("/dashboard")
    } else {
      notify("error", res?.error ?? "Email ou senha incorretos")
    }
  }

  return (
    <main className="w-screen h-screen grid grid-cols-1 grid-rows-[1.5fr,1fr] md:grid-rows-1 md:grid-cols-2">
      <DashboardSEO title="Entrar" />

      <section className="p-8 flex flex-col items-center">
        <div className="w-full max-w-[600px] mt-10 md:mt-20">
          <Link href="/">
            <Logo className="w-[180px] !text-indigo-500 mb-20" />
          </Link>
          <h1 className="text-4xl font-semibold">Entrar</h1>
          <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-3 mt-10">
            <ControlledInput control={control} fieldName="email" type="email" label="Email" placeholder="usuario@email.com" />
            <ControlledInput control={control} fieldName="password" type="password" label="Senha" placeholder="******" />
            <Button isLoading={isSubmitting} type="submit" className="ml-auto mt-3">Entrar</Button>
          </form>

          <Divider className="my-8" />

          <div className="flex items-center justify-between">
            <Link href="/esqueci-a-senha" className="text-slate-400 text-sm hover:text-indigo-500 transition-colors">
              Esqueceu sua senha?
            </Link>
            <Link href="/onboarding" className="text-slate-400 text-sm hover:text-indigo-500 transition-colors">
              Criar sua conta
            </Link>
          </div>
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