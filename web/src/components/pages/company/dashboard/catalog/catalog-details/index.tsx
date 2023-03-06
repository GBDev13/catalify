import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { Button } from "src/components/ui/Button";
import { ControlledFileUpload } from "src/components/ui/FileUpload/controlled";
import { TipIcon } from "src/components/ui/TipIcon";
import { ControlledToggleGroup } from "src/components/ui/ToggleGroup/controlled";
import { FAVICON_MAX_SIZE, IMAGE_TYPES } from "src/constants/constants";
import { companyKeys } from "src/constants/query-keys";
import { urlToFile } from "src/helpers/url-to-file";
import { revalidate } from "src/lib/revalidate";
import { getCompanySiteDetails, updateCompanySiteDetails, UpdateSiteDetailsDto } from "src/services/company";
import { useCompany } from "src/store/company";
import { z } from "zod";

const catalogDetailsSchema = z.object({
  favicon: z.custom<File[]>(),
  withFloatingButton: z.string(),
  imageFitMode: z.enum(["contain", "cover"]),
})

type CatalogDetailsFormData = z.infer<typeof catalogDetailsSchema>

const YES_OR_NO_OPTIONS = [
  { label: "Sim", value: "true" },
  { label: "Não", value: "false" },
];

const IMAGE_FIT_MODE_OPTIONS = [
  { label: "Contido", value: "contain" },
  { label: "Cobrir", value: "cover" },
]

export const CatalogDetails = () => {
  const [isEditing, setIsEditing] = useState(false)

  const { handleSubmit, control, reset, formState: { isSubmitting, dirtyFields } } = useForm<CatalogDetailsFormData>({
    resolver: zodResolver(catalogDetailsSchema)
  });

  const { company } = useCompany()
  const companyId = company?.id!
  const companySlug = company?.slug! 

  const [defaultLogo, setDefaultLogo] = useState<File[]>([])

  const { data: companySiteDetails } = useQuery(companyKeys.companySiteDetails(companyId), () => getCompanySiteDetails(companyId), {
    enabled: !!companyId,
    onSuccess: async (data) => {
      const logo = data?.favicon ? [await urlToFile(data.favicon, 'favicon')] : [];
      setDefaultLogo(logo)
      reset({
        favicon: logo,
        imageFitMode: data?.imageFitMode,
        withFloatingButton: String(data?.withFloatingButton)
      })
    }
  });

  const queryClient = useQueryClient();

  const { mutateAsync: handleUpdateCompanySiteDetails } = useMutation((dto: UpdateSiteDetailsDto) => toast.promise(updateCompanySiteDetails(companyId, dto), {
    loading: 'Salvando...',
    success: 'Salvo com sucesso!',
    error: 'Erro ao salvar'
  }), {
    onSuccess: async () => {
      setIsEditing(false)
      queryClient.invalidateQueries(companyKeys.companySiteDetails(companyId))
      await revalidate(
        `https://${companySlug}.catalify.com.br`,
        companySlug,
        'produtos'
      )
    }
  })

  const onSubmit = async (data: CatalogDetailsFormData) => {
    try {
      await handleUpdateCompanySiteDetails({
        imageFitMode: data.imageFitMode,
        withFloatingButton: data.withFloatingButton === "true",
        favicon: dirtyFields?.favicon ? data?.favicon?.length ? data.favicon[0] : null : undefined
      })
    } catch {}
  }

  const handleStartEditing = () => {
    setIsEditing(true)
  }

  const handleCancelEditing = () => {
    setIsEditing(false)
    reset({
      favicon: defaultLogo,
      imageFitMode: companySiteDetails?.imageFitMode,
      withFloatingButton: String(companySiteDetails?.withFloatingButton)
    })
  }

  return (
    <div className="col-span-full">
      <div className="border-b border-b-slate-300 pb-4 mb-6 flex items-center justify-between gap-2">
        <h4 className="text-2xl font-semibold text-slate-500">Detalhes do catálogo</h4>

        <Button type="button" onClick={handleStartEditing} size="MEDIUM" disabled={isEditing}>
          <FaEdit className="mb-0.5" size={15} />
          Editar Detalhes
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col justify-between">
          <label htmlFor="logo" className="font-medium text-slate-500 mb-1 flex items-center gap-2">
            Favicon
            <TipIcon tip="O favicon é o ícone que aparece na aba do navegador. Ele deve ser quadrado e com no máximo 32x32 pixels." />
          </label>
          <ControlledFileUpload maxDimensions={{ width: 32, height: 32 }} disabled={!isEditing} withPreview previewMode="INSIDE" fieldName="favicon" maxFiles={1} control={control} maxSize={FAVICON_MAX_SIZE} acceptedTypes={IMAGE_TYPES} />
        </div>
        <div className="flex flex-col justify-end gap-4">
          <div>
            <label htmlFor="withFloatingButton" className="font-medium text-slate-500 mb-1 flex items-center gap-2">
              Botão do Whatsapp flutuante
              <TipIcon tip="O botão do Whatsapp flutuante é um botão que aparece no canto inferior direito da tela do usuário ao acessar o catálogo." />
            </label>
            <ControlledToggleGroup
              type="single"
              disabled={!isEditing}
              fieldName="withFloatingButton"
              control={control}
              options={YES_OR_NO_OPTIONS}
            />
          </div>
          <div>
            <label htmlFor="imageFitMode" className="font-medium text-slate-500 mb-1 flex items-center gap-2">
              Modo de ajuste de imagem
              <TipIcon tip={
                <span>
                  O modo de ajuste de imagem é o modo que a imagem do produto será ajustada dentro do espaço disponível.
                  <a className="text-indigo-500 underline" href="https://storage.googleapis.com/catalify-images/static/exemplosmodoajuste.png" target="_blank" rel="noreferrer"> Ver exemplo</a>
                </span>
              } />
            </label>
            <ControlledToggleGroup
              type="single"
              disabled={!isEditing}
              fieldName="imageFitMode"
              control={control}
              options={IMAGE_FIT_MODE_OPTIONS}
            />
          </div>
        </div>
        {isEditing && (
            <div className="grid grid-cols-2 w-full max-w-[400px] ml-auto col-span-full gap-4">
              <Button type="button" variant="OUTLINE" size="WIDE" onClick={handleCancelEditing}>
                Cancelar
              </Button>
              <Button type="submit" size="WIDE" isLoading={isSubmitting}>Salvar</Button>
            </div>
          )}
      </form>   
    </div>
  )
}