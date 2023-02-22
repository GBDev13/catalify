
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Button } from "src/components/ui/Button"
import { ControlledInput } from "src/components/ui/Input/controlled"
import { forgotPassword } from "src/services/account"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string({
    required_error: "Email é obrigatório"
  }).email({
    message: "Email inválido"
  }),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const EmailStep = () => {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const { mutateAsync: handleForgotPassword } = useMutation((email: string) => toast.promise(forgotPassword(email), {
    loading: "Enviando recuperação...",
    success: "Enviamos um email de recuperação de senha para você, verifique sua caixa de entrada",
    error: "Erro ao enviar email"
  }, {
    duration: 8000
  }))

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      handleForgotPassword(data.email)
    } catch { }
  }
  return (
    <>
      <h1 className="text-4xl font-semibold">
        Esqueci a senha
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-10">
        <ControlledInput control={control} fieldName="email" type="email" label="Email da sua conta" placeholder="usuario@email.com" />
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link href="/login">
            <Button type="submit" size="WIDE" variant="OUTLINE">
              Voltar
            </Button>
          </Link>
          <Button isLoading={isSubmitting} type="submit" size="WIDE">
            Enviar
          </Button>
        </div>
      </form>
    </>
  )
}