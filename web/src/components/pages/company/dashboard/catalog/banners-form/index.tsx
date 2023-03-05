import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Button } from "src/components/ui/Button"
import { FileUpload } from "src/components/ui/FileUpload"
import { IMAGE_MAX_SIZE, IMAGE_TYPES, LIMITS } from "src/constants/constants"
import { companyKeys } from "src/constants/query-keys"
import { urlToFile } from "src/helpers/url-to-file"
import { revalidate } from "src/lib/revalidate"
import { getCompanyBanners, UpdateBannerDto, updateCompanyBanners } from "src/services/company"
import { useCompany } from "src/store/company"
import { z } from "zod"
import { BannerItem } from "./banner-item"

const bannersFormSchema = z.object({
  banners: z.array(z.object({
    id: z.string().optional(),
    image: z.custom<File>(),
    link: z.string().url({
      message: 'Link deve ser uma URL válida'
    }).optional().or(z.literal(''))
  }))
  .max(LIMITS.PREMIUM.MAX_BANNERS, {
    message: 'É permitido no máximo 3 banners'
  })
})

export type BannerFormData = z.infer<typeof bannersFormSchema>

export const BannersForm = () => {
  const company = useCompany(state => state.company)
  const companyId = company?.id!
  const companySlug = company?.slug!

  const methods = useForm<BannerFormData>({
    resolver: zodResolver(bannersFormSchema)
  })

  const { control, reset, handleSubmit, formState: { isDirty, errors, isSubmitting } } = methods

  const [initialBanners, setInitialBanners] = useState<UpdateBannerDto[]>([])

  useQuery(companyKeys.companyBanners(companyId!), () => getCompanyBanners(companyId!), {
    onSuccess: async (data) => {
      const banners = await Promise.all(data.map(async (x, i) => {
        const image = await urlToFile(x.picture, `banner-${i}`)
        return {
          image,
          link: x?.url ?? '',
          id: x.id
        }
      }))

      setInitialBanners(banners)

      reset({
        banners
      })
      await revalidate(
        `https://${companySlug}.catalify.com.br`,
        companySlug
      )
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'banners'
  });

  const queryClient = useQueryClient()

  const { mutateAsync: handleUpdateBanners } = useMutation((updateDto: UpdateBannerDto[]) => toast.promise(updateCompanyBanners(companyId!, updateDto), {
    loading: 'Salvando...',
    success: 'Banners salvos com sucesso!',
    error: (error) => error?.response?.data?.message ?? 'Erro ao salvar banners'
  }), {
    onSuccess: () => {
      queryClient.invalidateQueries(companyKeys.companyBanners(companyId!))
    }
  })

  const onSubmit = async (data: BannerFormData) => {
    try {
      await handleUpdateBanners(data.banners)
    } catch {}
  }

  const onDropFile = (files: File[]) => {
    append(files.map(file => ({
      image: file,
      link: ''
    })))
  }

  const handleRemove = (index: number) => {
    remove(index)
  }

  const onCancel = () => {
    reset({
      banners: initialBanners
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="flex gap-1.5 text-xs font-medium text-slate-500 mb-1">
            Clique ou arraste uma imagem para adicionar um novo banner
          </label>
          <FileUpload maxFiles={LIMITS.PREMIUM.MAX_BANNERS} acceptedTypes={IMAGE_TYPES} maxSize={IMAGE_MAX_SIZE * 2} onDrop={onDropFile} />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {fields.length === 0 && initialBanners.length > 0 && (
            <p className="text-center text-slate-500">Você removeu todos os banners</p>
          )}
          {fields.map((field, index) => {
            return <BannerItem field={field} fieldIndex={index} key={field.id} onRemove={handleRemove} />
          })}

          {errors?.banners?.message && (
            <span className="text-red-400 text-xs">{errors.banners.message}</span>
          )}
        </div>

        {isDirty && (
          <div className="ml-auto mt-6 grid grid-cols-2 w-full max-w-[400px] gap-2 md:gap-4">
            <Button onClick={onCancel} size="WIDE" variant="OUTLINE">Cancelar</Button>
            <Button size="WIDE" type="submit" isLoading={isSubmitting}>
              Salvar
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  )
}