import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import ProductVariations from "src/components/pages/company/dashboard/products/product-variations";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { ControlledCheckbox } from "src/components/ui/Checkbox/controlled";
import { ControlledCurrencyInput } from "src/components/ui/CurrencyInput/controlled";
import { ControlledEditor } from "src/components/ui/Editor/controlled";
import { ControlledFileUpload } from "src/components/ui/FileUpload/controlled";
import { ControlledInput } from "src/components/ui/Input/controlled";
import { ControlledSelect } from "src/components/ui/Select/controlled";
import { productsKey } from "src/constants/query-keys";
import { useUnsavedChangesWarning } from "src/hooks/useUnsavedChangesWarning";
import { createProduct, CreateProductDto, getCategories } from "src/services/products";
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
  .default(null),
  images: z.array(z.custom<File>(), {
    required_error: "É necessário enviar pelo menos uma imagem",
  }).min(1, {
    message: "É necessário enviar pelo menos uma imagem"
  }),
  hasVariations: z.boolean().optional(),
  variations: z.array(z.object({
    name: z.string({
      required_error: "O nome da variação é obrigatório",
    }).min(3, {
      message: "O nome da variação deve ter no mínimo 3 caracteres",
    }).max(50, {
      message: "O nome da variação deve ter no máximo 50 caracteres",
    }),
    options: z.array(z.object({
      value: z.string({
        required_error: "O valor da opção é obrigatório",
      }).min(1, {
        message: "O nome da variação deve ter no mínimo 3 caracteres",
      }).max(50, {
        message: "O nome da variação deve ter no máximo 50 caracteres",
      }),
    })).max(10, {
      message: "A variação pode ter no máximo 10 opções",
    }),
  })).max(5, {
    message: "O produto pode ter no máximo 5 variações",
  })
})

export type NewProductFormData = z.infer<typeof newProductFormSchema>

export default function NewProduct() {
  const router = useRouter()
  const { company } = useCompany()
  const companyId = company?.id

  const methods = useForm<NewProductFormData>({
    resolver: zodResolver(newProductFormSchema),
    defaultValues: {
      price: 0,
      variations: [],
    }
  })

  const { control, handleSubmit, reset, setValue, formState: { isSubmitting, isDirty }} = methods

  const queryClient = useQueryClient()

  const { mutateAsync: handleCreateProduct } = useMutation((data: CreateProductDto) => toast.promise(createProduct(data, companyId!), {
    loading: 'Criando produto...',
    success: 'Produto criado com sucesso!',
    error: 'Erro ao criar produto',
  }), {
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(productsKey.all)
      router.push('/company/dashboard/products')
    }
  })

  const onSubmit = async (data: NewProductFormData) => {
    await handleCreateProduct({
      categoryId: data.category?.value,
      description: data.description,
      images: data.images,
      name: data.name,
      price: data.price / 100,
      variations: data.variations.length > 0 ? data.variations.map(variation => ({
        name: variation.name,
        options: variation.options.map(option => option.value),
      })) : undefined
    })
  }

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

  useUnsavedChangesWarning(isDirty && !isSubmitting)

  const finalSlashIndex = router.asPath.lastIndexOf('/')
  const previousPath = router.asPath.slice(0, finalSlashIndex)

  const hasVariations = !!methods.watch('hasVariations')

  useEffect(() => {
    if(!hasVariations) {
      setValue('variations', [])
    }
  }, [hasVariations, setValue])

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

      <FormProvider {...methods}>
        <form className="grid bg-slate-100 rounded grid-cols-1 gap-6 p-4 lg:gap-16 lg:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6">Informações do Produto</h4>
            
              <div className="flex flex-col gap-4">
                <ControlledInput control={control} fieldName="name" label="Nome do Produto" placeholder="Camiseta" />
                <ControlledEditor control={control} fieldName="description" label="Descrição do Produto" />
                <ControlledCurrencyInput control={control} fieldName="price" label="Preço do Produto" />
                <ControlledSelect isClearable control={control} fieldName="category" label="Categoria (Opcional)" options={categoriesOptions} />

                <div className="mt-2">
                  <ControlledCheckbox fieldName="hasVariations" control={control} label="O produto possui variações?" />
                </div>

              </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6">Fotos do Produto</h4>
            <ControlledFileUpload control={control} fieldName="images" withPreview isMultiple maxFiles={4} acceptedTypes={{
              'image/jpeg': ['image/jpeg'],
              'image/jpg': ['image/jpg'],
              'image/png': ['image/png'],
              'image/webp': ['image/webp'],
            }} maxSize={5242880} />
            
            {hasVariations && <ProductVariations />}
          </div>

          <Button isLoading={isSubmitting} type="submit" className="col-span-full ml-auto">Criar Produto</Button>
        </form>
      </FormProvider>
    </>
  )
}