import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { ControlledCurrencyInput } from "src/components/ui/CurrencyInput/controlled";
import { ControlledEditor } from "src/components/ui/Editor/controlled";
import { ControlledInput } from "src/components/ui/Input/controlled";
import { ControlledSelect } from "src/components/ui/Select/controlled";
import { productsKey } from "src/constants/query-keys";
import { useUnsavedChangesWarning } from "src/hooks/useUnsavedChangesWarning";
import { getCategories } from "src/services/products";
import { useCompany } from "src/store/company";
import { z } from "zod";

const newProductFormSchema = z.object({
  name: z.string({
    required_error: "O nome do produto é obrigatório",
  }).min(3, {
    message: "O nome do produto deve ter no mínimo 3 caracteres",
  }).max(100, {
    message: "O nome do produto deve ter no máximo 100 caracteres",
  }),
  description: z.string({
    required_error: "A descrição do produto é obrigatória",
  }).min(3, {
    message: "A descrição do produto deve ter no mínimo 3 caracteres",
  }).max(500, {
    message: "A descrição do produto deve ter no máximo 500 caracteres",
  }),
  price: z.number({
    required_error: "O preço do produto é obrigatório",
  }).min(0.01, {
    message: "O preço do produto deve ser maior que R$ 0,01",
  }),
  category: z.object({
    value: z.string(),
    label: z.string(),
  })
  .nullable()
  .default(null)
})

type NewProductFormData = z.infer<typeof newProductFormSchema>

export default function NewProduct() {
  const router = useRouter()

  const { control, handleSubmit, formState: { isSubmitting, isDirty }} = useForm<NewProductFormData>({
    resolver: zodResolver(newProductFormSchema),
    defaultValues: {
      price: 0,
    }
  })

  const onSubmit = (data: NewProductFormData) => {
    console.log({
      ...data,
      price: data.price / 100,
      categoryId: data.category?.value
    })
  }
  const { company } = useCompany()
  const companyId = company?.id

  const { data: categories } = useQuery(productsKey.categories, () => getCategories(companyId!), {
    enabled: !!companyId
  })

  const categoriesOptions = useMemo(() => {
    if(!categories) return []

    return categories.map(category => ({
      value: category.id,
      label: category.name,
    }))
  }, [categories])

  useUnsavedChangesWarning(isDirty)

  const finalSlashIndex = router.asPath.lastIndexOf('/')
  const previousPath = router.asPath.slice(0, finalSlashIndex)

  return (
    <>
      <PageTitle title="Adicionar Produto">
        <Link passHref href={previousPath}>
          <Button size="SMALL" variant="OUTLINE">
            <FiArrowLeft />
            Voltar
          </Button>
        </Link>
      </PageTitle>

      <form className="grid grid-cols-2 gap-16 bg-slate-100 p-8 rounded" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6">Informações do Produto</h4>
          
          <div className="flex flex-col gap-4">
            <ControlledInput control={control} fieldName="name" label="Nome do Produto" placeholder="Camiseta" />
            <ControlledEditor control={control} fieldName="description" label="Descrição do Produto" />
            <ControlledCurrencyInput control={control} fieldName="price" label="Preço do Produto" />
            <ControlledSelect control={control} fieldName="category" label="Categoria (Opcional)" options={categoriesOptions} />
          </div>
        </div>

        <div>
          <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4">Fotos do Produto</h4>
        </div>

        <Button isLoading={isSubmitting} type="submit" className="col-span-full ml-auto">Criar Produto</Button>
      </form>
    </>
  )
}