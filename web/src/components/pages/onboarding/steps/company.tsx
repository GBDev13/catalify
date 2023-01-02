import { ControlledInput } from "../../../ui/Input/controlled"
import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Button } from "../../../ui/Button";
import { OnboardingFormData } from "../form";
import { ControlledColorPicker } from "../../../ui/ColorPicker/controlled";
import tailwindColors from 'tailwindcss/colors'

export const companyStepFormSchema = z.object({
  companyName: z.string({
    required_error: "Nome da empresa é obrigatório"
  }).min(3, {
    message: "Nome da empresa deve ter no mínimo 3 caracteres"
  }).max(20, {
    message: "Nome da empresa deve ter no máximo 20 caracteres"
  }),
  color: z.string({
    required_error: "Cor é obrigatória"
  }),
})

type CompanyStepFormData = z.infer<typeof companyStepFormSchema>

type CompanyStepProps = {
  onSubmitForm: () => Promise<void>
  onPrevStep: () => void
}

export const CompanyStep = ({ onPrevStep, onSubmitForm }: CompanyStepProps) => {
  const { setValue, watch } = useFormContext<OnboardingFormData>()

  const initialValue = watch("company")

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<CompanyStepFormData>({
    resolver: zodResolver(companyStepFormSchema),
    defaultValues: initialValue ? initialValue : {
      color: tailwindColors.indigo[500]
    }
  });

  const onSubmit = async (data: CompanyStepFormData) => {
    setValue("company", data)
    await onSubmitForm()
  }
  
  return (
    <>
      <div className="self-start">
        <h2 className="font-semibold text-2xl">Para finalizarmos</h2>
        <p className="text-slate-500">Precisamos que você nos forneça mais alguns detalhes sobre sua empresa.</p>
      </div>
      <form className="w-full grid grid-cols-2 gap-4 mt-10" onSubmit={handleSubmit(onSubmit)}>
        <ControlledInput label="Nome da Empresa" placeholder="Empresa" fieldName="companyName" control={control} />
        <ControlledColorPicker control={control} fieldName="color" label="Cor principal da empresa" />

        <div className="col-span-full flex justify-end gap-4">
          <Button type="button" size="MEDIUM" variant="OUTLINE" onClick={onPrevStep}>Voltar</Button>
          <Button type="submit" size="MEDIUM" disabled={isSubmitting} isLoading={isSubmitting}>Finalizar</Button>
        </div>
      </form>
    </>
  )
}