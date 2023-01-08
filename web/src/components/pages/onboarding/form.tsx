import { PersonalStep, personalStepFormSchema } from "./steps/personal";
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { CompanyStep, companyStepFormSchema } from "./steps/company";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "src/services/account";
import { signIn } from "next-auth/react";
import { notify } from "src/helpers/toast";

const onboardingFormSchema = z.object({
  personal: personalStepFormSchema,
  company: companyStepFormSchema
})

export type OnboardingFormData = z.infer<typeof onboardingFormSchema>

type OnboardingFormProps = {
  step: number
  setStep: (step: number) => void
}

export const OnboardingForm = ({ step, setStep }: OnboardingFormProps) => {
  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingFormSchema)
  })

  const onNextStep = () => {
    setStep(step + 1)
  }

  const onPrevStep = () => {
    setStep(step - 1)
  }

  const { mutateAsync: handleCreateAccount } = useMutation(createAccount, {
    onSuccess: (_, variables) => {
      notify('success', 'Conta criada com sucesso!, você será redirecionado(a) para o painel da sua empresa.')

      setTimeout(async () => {
        await signIn("credentials", {
          callbackUrl: "/company/dashboard",
          email: variables.user.email,
          password: variables.user.password
        })
      }, 3000)
    }
  })

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      await handleCreateAccount({
        user: {
          firstName: data.personal.firstName,
          lastName: data.personal.lastName,
          email: data.personal.email,
          password: data.personal.password,
        },
        company: {
          name: data.company.companyName,
          themeColor: data.company.color,
          slug: data.company.slug,
          logo: data.company?.logo?.length ? data.company.logo[0] : undefined
        }
      })
    } catch (err) {
      notify('error', err)
    }
  }

  const onSubmitForm = methods.handleSubmit(onSubmit)

  return (
    <>
      <FormProvider {...methods}>
      {step === 1 && <PersonalStep onNextStep={onNextStep} />}
      {step === 2 && <CompanyStep onPrevStep={onPrevStep} onSubmitForm={onSubmitForm} />}
      </FormProvider>
  </>
  )
}