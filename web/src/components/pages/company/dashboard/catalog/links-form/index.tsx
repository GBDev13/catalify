import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import clsx from "clsx"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { FiPlus, FiX } from "react-icons/fi"
import { Button } from "src/components/ui/Button"
import { Input } from "src/components/ui/Input"
import { Tooltip } from "src/components/ui/Tooltip"
import { LIMITS } from "src/constants/constants"
import { companyKeys } from "src/constants/query-keys"
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid"
import { getCompanyLinks, updateCompanyLinks } from "src/services/company"
import { useCompany } from "src/store/company"
import { z } from "zod"

const linksFormSchema = z.object({
  links: z.array(z.object({
    value: z.string().url({
      message: 'Insira um link válido'
    })
  }, {
    required_error: 'Insira um link'
  }))
}).superRefine((data, ctx) => {
  let repeatedIndex: number[] = []
  const repeated = data.links.filter((x, i, a) => {
    if(a.findIndex(y => y.value === x.value) !== i) {
      repeatedIndex.push(i)
      return true
    }
    return false
  })
  if(repeated.length > 0) {
    repeatedIndex.forEach(x => {
      ctx.addIssue({
        code: "custom",
        message: "Link repetido",
        path: [`links.${x}.value`]
      })
    })
  }
})

type LinksFormData = z.infer<typeof linksFormSchema>

export const LinksForm = () => {
  const companyId = useCompany(s => s.company?.id);
  const currentSubscription = useCompany(s => s.currentSubscription);

  const subscriptionIsValid = isSubscriptionValid(currentSubscription!)

  const { control, handleSubmit, register, reset, setError, formState: { errors, isDirty, isSubmitting } } = useForm<LinksFormData>({
    resolver: zodResolver(linksFormSchema)
  })

  const queryClient = useQueryClient();

  const { data: existentLinks } = useQuery(companyKeys.companyLinks(companyId!), () => getCompanyLinks(companyId!), {
    enabled: !!companyId,
    onSuccess: (data) => {
      reset({
        links: data.map(x => ({ value: x.url }))
      })
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links'
  });

  const { mutateAsync: handleUpdateLinks } = useMutation((links: string[]) => toast.promise(updateCompanyLinks(companyId!, links), {
    loading: 'Salvando...',
    success: 'Links salvos com sucesso!',
    error: (error) => error?.response?.data?.message ?? 'Erro ao salvar links'
  }), {
    onSuccess: () => {
      queryClient.invalidateQueries(companyKeys.companyLinks(companyId!))
    }
  })

  const linksLimit = subscriptionIsValid ? LIMITS.PREMIUM.MAX_CONTACT_LINKS : LIMITS.FREE.MAX_CONTACT_LINKS

  const onSubmit = async (data: LinksFormData) => {
    if (data.links.length > linksLimit) {
      setError('links', {
        type: 'custom',
        message: `Você atingiu o limite de links. Limite: ${linksLimit}`
      })
      return;
    }
    try {
      await handleUpdateLinks(data.links.map(x => x.value))
    } catch {}
  }

  const handleAddLink = () => {
    append({ value: '' })
  }

  const handleRemoveLink = (index: number) => {
    remove(index)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        {fields.length <= 0 && (
          <p className="text-center px-14 text-slate-500">
            {existentLinks && existentLinks?.length > 0 ? (
              <>Você removeu todos os links</>
            ) : (
              <>
                Você ainda não adicionou nenhum link. Crie seu primeiro link clicando <span className="text-indigo-500 font-semibold cursor-pointer" onClick={handleAddLink}>aqui</span>
              </>
            )}
            
          </p>
        )}
        {fields.map((item, index) => {
          const isLast = index === fields.length - 1;
          const currentPos = index + 1;
          return (
            <div className="flex items-center gap-2 " key={item.id}>
              <Input
                className="flex-1"
                label={`Link ${currentPos}`}
                placeholder="Ex: https://www.instagram.com"
                {...register(`links.${index}.value` as const)}
                defaultValue={item.value}
                error={errors.links?.[index]?.value}
              />

              <div className={clsx("grid grid-cols-1 gap-2", { "grid-cols-2": isLast })}>
                <Tooltip content={`Remover Link ${currentPos}`}>
                  <button className="h-7 w-7 rounded-full mt-[24px] flex items-center justify-center border border-indigo-500 transition-colors  text-indigo-500 hover:bg-indigo-500 hover:text-white" type="button" onClick={() => handleRemoveLink(index)}>
                    <FiX size={15} />
                  </button>
                </Tooltip>
                {isLast && (
                  <Tooltip content={`Adicionar novo link`}>
                    <button className="h-7 w-7 rounded-full mt-[24px] flex items-center justify-center border border-indigo-500 transition-colors  text-indigo-500 hover:bg-indigo-500 hover:text-white" type="button" onClick={handleAddLink}>
                      <FiPlus size={15} />
                    </button>
                  </Tooltip>
                )}
              </div>
            </div>
          );
        })}
        {errors?.links?.message && <span className="text-red-400 text-xs mt-2">{errors?.links?.message}</span>}
      </div>

      {isDirty && <Button size="MEDIUM" className="ml-auto mt-8" type="submit" isLoading={isSubmitting}>Salvar</Button>}
    </form>
  )
}