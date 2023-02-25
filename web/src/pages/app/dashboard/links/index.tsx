import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ManageLinksDialog } from "src/components/pages/company/dashboard/links/manage-links-dialog";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { LinksPage } from "src/components/pages/shared/LinksPage";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { ControlledColorPicker } from "src/components/ui/ColorPicker/controlled";
import { ControlledFileUpload } from "src/components/ui/FileUpload/controlled";
import { ControlledInput } from "src/components/ui/Input/controlled";
import { ControlledToggleGroup } from "src/components/ui/ToggleGroup/controlled";
import { IMAGE_MAX_SIZE, IMAGE_TYPES } from "src/constants/constants";
import { companyKeys } from "src/constants/query-keys";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { urlToFile } from "src/helpers/url-to-file";
import { withAuth } from "src/helpers/withAuth";
import { getCompanyLinksPageCustomization, getCompanyLinksPageLinks, updateCompanyLinksPageCustomization, UpdateLinksPageCustomizationDto } from "src/services/company";
import { revalidatePath } from "src/services/revalidate";
import { useCompany } from "src/store/company";
import { z } from "zod";

const linksFormSchema = z.object({
  title: z.string(),
  headline: z.string().optional(),
  textColor: z.string(),
  textColor2: z.string(),
  boxColor: z.string(),
  boxMode: z.enum(['solid', 'outline']),
  background: z.string(),
  background2: z.string(),
  backgroundMode: z.enum(['solid', 'gradient']),
  logoMode: z.enum(['rounded', 'free']),
  logo: z.custom<File[]>().optional()
})

type LinksFormType = z.infer<typeof linksFormSchema>

const boxModeOptions = [
  { label: 'Preenchida', value: 'solid' },
  { label: 'Borda', value: 'outline' }
]

const backgroundModeOptions = [
  { label: 'Sólido', value: 'solid' },
  { label: 'Gradiente', value: 'gradient' }
]

const logoModeOptions = [
  { label: 'Arredondado', value: 'rounded' },
  { label: 'Livre', value: 'free' }
]

function ManageLinksPage() {
  const { company, currentSubscription } = useCompany()
  const companyId = company?.id!;

  const hasSubscription = isSubscriptionValid(currentSubscription!);

  const { control, watch, reset, handleSubmit, formState: { isDirty, dirtyFields, isSubmitting } } = useForm<LinksFormType>({
    mode: 'onChange',
    resolver: zodResolver(linksFormSchema),
  })

  const formData = watch()

  const [initialData, setInitialData] = useState<LinksFormType | null>(null)

  const { data: existentLinks } = useQuery(companyKeys.companyLinksPageLinks(companyId!), () => getCompanyLinksPageLinks(companyId!), {
    enabled: !!companyId && hasSubscription
  })
  
  useQuery(companyKeys.companyLinksPageCustomization(companyId), () => getCompanyLinksPageCustomization(companyId), {
    enabled: !!companyId && hasSubscription,
    onSuccess: async (data) => {
      const logo = data?.logo ? [await urlToFile(data.logo, `logo-${data.title}`)] : [];
      const newData = {
        ...data,
        background: data.bgColor,
        background2: data.bgColor2,
        backgroundMode: data.bgMode,
        headline: data.headLine ?? "",
        logo
      };
      reset(newData)
      setInitialData(newData)
    }
  })

  const queryClient = useQueryClient()

  const { mutateAsync: handleUpdateLinksCustomization } = useMutation((updateDto: UpdateLinksPageCustomizationDto) => toast.promise(updateCompanyLinksPageCustomization(companyId, updateDto), {
    loading: 'Salvando...',
    success: 'Salvo com sucesso!',
    error: (err) => {
      return err?.response?.data?.message || 'Erro ao salvar'
    }
  }), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(companyKeys.companyLinksPageCustomization(companyId))
      await revalidatePath(`/links/${company?.slug}`)
    }
  })

  const onSubmit = async (data: LinksFormType) => {
    try {
      await handleUpdateLinksCustomization({
        bgColor: data.background,
        bgColor2: data.background2,
        bgMode: data.backgroundMode,
        boxColor: data.boxColor,
        boxMode: data.boxMode,
        headLine: data.headline,
        logoMode: data.logoMode,
        textColor: data.textColor,
        textColor2: data.textColor2,
        title: data.title,
        logo: dirtyFields?.logo ? data?.logo?.length ? data.logo[0] : null : undefined
      })
    } catch {}
  }

  const onCancel = () => {
    if (initialData) reset(initialData)
  }

  const logo = formData?.logo?.[0] ? URL.createObjectURL(formData.logo[0]) : undefined;

  if(!hasSubscription) return (
    <>
      <PageTitle title="Gerenciar Página de Links" />

      <h1 className="text-indigo-500 font-semibold text-2xl text-center">
        Desculpe, essa funcionalidade é exclusiva para o plano premium.
      </h1>
      <p className="mt-2 text-center text-slate-500 mx-auto w-full max-w-[1000px]">
      Atualize para o nosso <span className="text-indigo-500">plano premium</span> para ter acesso a essa e muitas outras funcionalidades incríveis. Se você ainda não é um usuário premium, <Link href="./plans" className="text-indigo-500 font-semibold">clique aqui</Link> para saber mais sobre nossos planos e como atualizar.
      </p>
    </>
  )

  return (
    <div className="w-full lg:h-full flex flex-col">
      <DashboardSEO title="Página de Links" />

      <PageTitle title="Gerenciar Página de Links">
        <Link href={`/links/${company?.slug}`} target="_blank">
          <Button variant="OUTLINE">
            Acessar Página de Links
          </Button>
        </Link>
      </PageTitle>

      <section className="w-full grid gap-4 grid-cols-1 lg:grid-cols-[1fr,400px] flex-1">
        <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:h-max" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-span-full">
            <label className="flex gap-1.5 text-xs font-medium text-slate-500 mb-1">Logo (Opcional)</label>
            <ControlledFileUpload
              withPreview
              previewMode="INSIDE"
              control={control}
              fieldName="logo"
              acceptedTypes={IMAGE_TYPES}
              maxSize={IMAGE_MAX_SIZE}
              maxFiles={1}
            />
          </div>
          <ControlledInput control={control} label="Titulo" fieldName="title" />
          <ControlledInput control={control} label="Subtitulo (Opcional)" fieldName="headline" />
          <ControlledColorPicker control={control} label="Cor do Texto" fieldName="textColor" />
          <ControlledColorPicker control={control} label="Cor de Texto 2" fieldName="textColor2" />
          <ControlledColorPicker control={control} label="Cor da Caixa" fieldName="boxColor" />
          <ControlledToggleGroup control={control} type="single" fieldName="boxMode" label="Modo da Caixa" options={boxModeOptions} />
          <ControlledColorPicker control={control} label="Cor de Fundo" fieldName="background" />
          <ControlledColorPicker control={control} label="Cor de Fundo 2" fieldName="background2" />
          <ControlledToggleGroup control={control} type="single" fieldName="backgroundMode" label="Modo de Fundo" options={backgroundModeOptions} />
          <ControlledToggleGroup control={control} type="single" fieldName="logoMode" label="Modo da Logo" options={logoModeOptions} />

          <div className="col-span-full flex items-center justify-end gap-2">
            <ManageLinksDialog />
            {isDirty && (
              <>
                <Button onClick={onCancel} disabled={isSubmitting} variant="OUTLINE">Cancelar</Button>
                <Button isLoading={isSubmitting} type="submit">Salvar Alterações</Button>
              </>
            )}
          </div>
        </form>

        <div className="w-full h-full flex-1 rounded-xl overflow-hidden border border-slate-500 min-h-[800px] lg:min-h-0">
          {!!initialData && <LinksPage
            background={formData?.background}
            background2={formData.background2}
            backgroundMode={formData.backgroundMode}
            title={formData.title}
            headline={formData?.headline}
            logo={logo}
            logoMode={formData?.logoMode}
            textColor={formData?.textColor}
            textColor2={formData?.textColor2}
            boxColor={formData.boxColor}
            boxMode={formData.boxMode}
            links={existentLinks ?? []}
            previewMode
          />}
        </div>
      </section>      
    </div>
  )
}

export const getServerSideProps = withAuth(async (context) => {
  return { props: {} };
});

export default ManageLinksPage;