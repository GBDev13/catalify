import { ControlledInput } from "../../../ui/Input/controlled"
import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Button } from "../../../ui/Button";
import { OnboardingFormData } from "../form";
import { Logo } from "src/assets/Logo";

export const personalStepFormSchema = z.object({
  firstName: z.string({
    required_error: "Nome é obrigatório"
  }).min(3, {
    message: "Nome deve ter no mínimo 3 caracteres"
  }).max(20, {
    message: "Nome deve ter no máximo 20 caracteres"
  }),
  lastName: z.string({
    required_error: "Sobrenome é obrigatório"
  }).min(3, {
    message: "Sobrenome deve ter no mínimo 3 caracteres"
  }).max(20, {
    message: "Sobrenome deve ter no máximo 20 caracteres"
  }),
  email: z.string({
    required_error: "Email é obrigatório"
  }).email({
    message: "Email inválido"
  }),
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

type PersonalStepFormData = z.infer<typeof personalStepFormSchema>

type PersonalStepProps = {
  onNextStep: () => void
}

export const PersonalStep = ({ onNextStep }: PersonalStepProps) => {
  const { setValue, watch } = useFormContext<OnboardingFormData>()

  const initialValue = watch("personal")

  const { control, handleSubmit } = useForm<PersonalStepFormData>({
    resolver: zodResolver(personalStepFormSchema),
    defaultValues: initialValue
  });

  const onSubmit = (data: PersonalStepFormData) => {
    setValue("personal", data)
    onNextStep()
  }
  
  return (
    <>
      <div className="self-start">
        <h2 className="flex items-center gap-2 font-semibold text-2xl">Obrigado por escolher <Logo className="!text-indigo-500" /></h2>
        <p className="text-slate-500">Para começar, precisamos que você nos forneça alguns dados sobre a sua conta.</p>
      </div>
      <form className="w-full grid grid-cols-2 gap-4 mt-10" onSubmit={handleSubmit(onSubmit)}>
        <ControlledInput label="Nome" placeholder="Gabriel" fieldName="firstName" control={control} />
        <ControlledInput label="Sobrenome" placeholder="Pereira" fieldName="lastName" control={control} />
        <ControlledInput className="col-span-full" label="Email" placeholder="gabriel-pereira@email.com" fieldName="email" type="email" control={control} />
        <ControlledInput label="Senha" fieldName="password" placeholder="No mínimo 6 caracteres" type="password" control={control} />
        <ControlledInput label="Confirmação da Senha" fieldName="confirmPassword" placeholder="Confirme a senha" type="password" control={control} />

        <div className="col-span-full flex justify-end">
          <Button type="submit" size="MEDIUM">Próxima etapa</Button>
        </div>
      </form>
    </>
  )
}