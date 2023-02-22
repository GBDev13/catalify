
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Button } from "src/components/ui/Button"
import { ControlledInput } from "src/components/ui/Input/controlled"
import { resetPassword } from "src/services/account"
import { z } from "zod"

const newPasswordSchema = z.object({
  password: z.string({
    required_error: "Senha é obrigatória"
  }).min(6, {
    message: "Senha deve ter no mínimo 6 caracteres"
  }).max(20, {
    message: "Senha deve ter no máximo 20 caracteres"
  }),
  confirmPassword: z.string({
    required_error: "Confirmação de senha é obrigatória"
  })
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Senhas não conferem",
      path: ["confirmPassword"]
    });
  }
});

type NewPasswordFormData = z.infer<typeof newPasswordSchema>

export const NewPasswordStep = () => {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema)
  })

  const router = useRouter()
  const token = router.query.token as string

  const { mutateAsync: handleResetPassword } = useMutation((password: string) => toast.promise(resetPassword(token!, password), {
    loading: "Redefinindo senha...",
    success: "Senha redefinida com sucesso!",
    error: "Erro ao redefinir senha"
  }), {
    onSuccess: () => router.push("/login")
  })

  const onSubmit = async (data: NewPasswordFormData) => {
    try {
      await handleResetPassword(data.password)
    } catch { }
  }
  return (
    <>
      <h1 className="text-4xl font-semibold">
        Redefinir senha
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ControlledInput label="Senha" fieldName="password" placeholder="No mínimo 6 caracteres" type="password" control={control} />
          <ControlledInput label="Confirmação da Senha" fieldName="confirmPassword" placeholder="Confirme a senha" type="password" control={control} />
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link href="/login">
            <Button type="submit" size="WIDE" variant="OUTLINE">
              Cancelar
            </Button>
          </Link>
          <Button isLoading={isSubmitting} type="submit" size="WIDE">
            Redefinir
          </Button>
        </div>
      </form>
    </>
  )
}