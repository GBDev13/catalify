import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiPlus, FiX } from "react-icons/fi";
import { Button } from "src/components/ui/Button"
import { Dialog } from "src/components/ui/Dialog"
import { Input } from "src/components/ui/Input";
import { Tooltip } from "src/components/ui/Tooltip";
import { LIMITS } from "src/constants/constants";
import { companyKeys } from "src/constants/query-keys";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { getCompanyLinksPageLinks, updateCompanyLinksPageLinks, UpdateLinksDto } from "src/services/company";
import { revalidatePath } from "src/services/revalidate";
import { useCompany } from "src/store/company";
import { z } from "zod"

const linksFormSchema = z.object({
  links: z.array(z.object({
    originalId: z.string().optional(),
    title: z.string().max(
      40, {
        message: 'O título deve ter no máximo 40 caracteres'
      }
    ),
    url: z.string().url({
      message: 'Insira um link válido'
    })
  }, {
    required_error: 'Insira um link'
  }))
}).superRefine((data, ctx) => {
  let repeatedIndex: number[] = []
  const repeated = data.links.filter((x, i, a) => {
    if(a.findIndex(y => y.url === x.url) !== i) {
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
        path: [`links.${x}.url`]
      })
    })
  }
})

type LinksFormData = z.infer<typeof linksFormSchema>

const ManageLinksForm = () => {
  const companyId = useCompany(s => s.company?.id);
  const companySlug = useCompany(s => s.company?.slug);
  const { control, handleSubmit, register, reset, setError, formState: { errors, isDirty, isSubmitting } } = useForm<LinksFormData>({
    resolver: zodResolver(linksFormSchema)
  })

  const queryClient = useQueryClient();

  const { data: existentLinks } = useQuery(companyKeys.companyLinksPageLinks(companyId!), () => getCompanyLinksPageLinks(companyId!), {
    enabled: !!companyId,
    onSuccess: (data) => {
      reset({
        links: data.map(x => ({
          originalId: x.id,
          title: x.title,
          url: x.url
        }))
      })
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links'
  });

  const { mutateAsync: handleUpdateLinks } = useMutation((links: UpdateLinksDto[]) => toast.promise(updateCompanyLinksPageLinks(companyId!, links), {
    loading: 'Salvando...',
    success: 'Links salvos com sucesso!',
    error: (error) => error?.response?.data?.message ?? 'Erro ao salvar links'
  }), {
    onSuccess: async () => {
      queryClient.invalidateQueries(companyKeys.companyLinksPageLinks(companyId!))
      await revalidatePath(`/links/${companySlug}`)
    }
  })

  const onSubmit = async (data: LinksFormData) => {
    if (data.links.length > LIMITS.PREMIUM.MAX_LINKS_PAGE_LINKS) {
      setError('links', {
        type: 'custom',
        message: `Você atingiu o limite de links. Limite: ${LIMITS.PREMIUM.MAX_LINKS_PAGE_LINKS}`
      })
      return;
    }
    try {
      await handleUpdateLinks(data.links)
    } catch {}
  }

  const handleAddLink = () => {
    append({ title: '', url: '' })
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
              <div className="grid grid-cols-2 w-full gap-2">
                <Input
                  label={`Titulo ${currentPos}`}
                  placeholder="Ex: Instagram"
                  {...register(`links.${index}.title` as const)}
                  defaultValue={item.title}
                  error={errors.links?.[index]?.title}
                />
                <Input
                  label={`Link ${currentPos}`}
                  placeholder="Ex: https://www.instagram.com"
                  {...register(`links.${index}.url` as const)}
                  defaultValue={item.url}
                  error={errors.links?.[index]?.url}
                />
              </div>

              <div className={clsx("grid grid-cols-1 gap-2", { "!grid-cols-2": isLast })}>
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

      {isDirty && <Button size="MEDIUM" className="ml-auto mt-8" type="button" onClick={() => handleSubmit(onSubmit)()} isLoading={isSubmitting}>Salvar</Button>}
    </form>
  )
}

export const ManageLinksDialog = () => {
  return (
    <Dialog content={<ManageLinksForm />} title="Gerenciar Links" maxWidth="800px">
      <Button type="button" variant="OUTLINE" className="mr-auto">Gerenciar Links</Button>
    </Dialog>
  )
}