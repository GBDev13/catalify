import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { companyStepFormSchema } from "src/components/pages/onboarding/steps/company";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { ControlledColorPicker } from "src/components/ui/ColorPicker/controlled";
import { ControlledFileUpload } from "src/components/ui/FileUpload/controlled";
import { ControlledInput } from "src/components/ui/Input/controlled";
import { ControlledPhoneInput } from "src/components/ui/PhoneInput/controlled";
import { Spinner } from "src/components/ui/Spinner";
import { IMAGE_MAX_SIZE, IMAGE_TYPES } from "src/constants/constants";
import { catalogKeys, companyKeys } from "src/constants/query-keys";
import { urlToFile } from "src/helpers/url-to-file";
import { useUnsavedChangesWarning } from "src/hooks/useUnsavedChangesWarning";
import { getCompanyCatalog } from "src/services/catalog";
import { updateCompany, UpdateCompanyDto } from "src/services/company";
import { useCompany } from "src/store/company";
import { z } from "zod";

type CatalogCompanyFormData = z.infer<typeof companyStepFormSchema>

export default function CatalogCompany() {
  const { data: session } = useSession();
  const { company } = useCompany(s => s)
  const slug = company?.slug!

  const { control, handleSubmit, reset, formState: { isSubmitting, isDirty, dirtyFields } } = useForm<CatalogCompanyFormData>({
    resolver: zodResolver(companyStepFormSchema),
  });

  const [defaultLogo, setDefaultLogo] = useState<File[]>([])

  const { data: catalogInfo, isFetching: catalogInfoIsLoading } = useQuery(catalogKeys.companyCatalog(slug), () => getCompanyCatalog(slug), {
    enabled: !!slug,
    onSuccess: async (data) => {
      const logo = data?.logo ? [await urlToFile(data.logo, `logo-${data.name}`)] : [];
      setDefaultLogo(logo)
      reset({
        color: data.themeColor,
        companyName: data.name,
        slug: data.slug,
        phone: data.phone,
        logo
      })
    }
  });

  const [isEditing, setIsEditing] = useState(false)

  const handleStartEditing = () => {
    if(isEditing) return
    setIsEditing(true)
  }

  const handleCancelEditing = () => {
    setIsEditing(false)

    if(isDirty) {
      reset({
        color: catalogInfo.themeColor,
        companyName: catalogInfo.name,
        slug: catalogInfo.slug,
        logo: defaultLogo,
        phone: catalogInfo.phone
      })
    }
  }

  const queryClient = useQueryClient()

  const { mutateAsync: handleUpdateCompany } = useMutation((updateDto: UpdateCompanyDto) => toast.promise(updateCompany(company?.id!, updateDto), {
    loading: 'Salvando...',
    success: 'Salvo com sucesso!',
    error: (err) => {
      return err?.response?.data?.message || 'Erro ao salvar'
    }
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(companyKeys.userCompanyInfo(session?.user?.id!))
      await queryClient.invalidateQueries(catalogKeys.companyCatalog(slug))
      handleCancelEditing()
    }
  })

  const onSubmit = async (data: CatalogCompanyFormData) => {
    if(!isDirty) {
      handleCancelEditing()
      return
    }

    try {
      await handleUpdateCompany({
        name: data.companyName,
        slug: data.slug,
        themeColor: data.color,
        phone: data.phone,
        logo: dirtyFields?.logo ? data?.logo?.length ? data.logo[0] : null : undefined
      })
    } catch {}
  }

  useUnsavedChangesWarning(isDirty && !isSubmitting)

  return (
    <>
      <DashboardSEO title="Informações da Empresa" />

      <PageTitle title="Informações da Empresa">
        <Button type="button" onClick={handleStartEditing} size="MEDIUM" disabled={isEditing}>
          <FaEdit className="mb-0.5" size={15} />
          Editar
        </Button>
      </PageTitle>

      {catalogInfoIsLoading ? (
        <Spinner />
      ) : (
        <form className="w-full grid grid-cols-2 gap-4 mt-10" onSubmit={handleSubmit(onSubmit)}>
          <ControlledInput disabled={!isEditing} label="Nome da Empresa" placeholder="Empresa" fieldName="companyName" control={control} />
          <ControlledColorPicker disabled={!isEditing} control={control} fieldName="color" label="Cor principal da empresa" />

          <ControlledPhoneInput disabled={!isEditing} label="Whatsapp que irá receber os pedidos" fieldName="phone" control={control} />
          <ControlledInput disabled={!isEditing} tip="Texto que será usado para acessar sua loja através do link do navegador (ex: catalify.com.br/sualoja)" label="Slug da loja" placeholder="sualoja" fieldName="slug" control={control} />

          <div className="col-span-full">
          <label htmlFor="logo" className="block text-xs font-medium text-slate-500 mb-1">Logo da Empresa (opcional)</label>
            <ControlledFileUpload disabled={!isEditing} withPreview previewMode="INSIDE" fieldName="logo" maxFiles={1} control={control} maxSize={IMAGE_MAX_SIZE} acceptedTypes={IMAGE_TYPES} />
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
      )}
    </>
  )
}