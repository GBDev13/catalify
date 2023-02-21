import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import ProductVariations from "src/components/pages/company/dashboard/products/product-variations";
import { DashboardSEO } from "src/components/pages/shared/DashboardSEO";
import { PageTitle } from "src/components/pages/shared/PageTitle";
import { Button } from "src/components/ui/Button";
import { ControlledCheckbox } from "src/components/ui/Checkbox/controlled";
import { ControlledCurrencyInput } from "src/components/ui/CurrencyInput/controlled";
import { ConfirmationDialog } from "src/components/ui/Dialog/confirmation";
import { ControlledEditor } from "src/components/ui/Editor/controlled";
import { ControlledFileUpload } from "src/components/ui/FileUpload/controlled";
import { ControlledInput } from "src/components/ui/Input/controlled";
import { ControlledSelect } from "src/components/ui/Select/controlled";
import { IMAGE_MAX_SIZE, IMAGE_TYPES, LIMITS } from "src/constants/constants";
import { productsKey } from "src/constants/query-keys";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { withAuth } from "src/helpers/withAuth";
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
  }).max(800, {
    message: "A descrição do produto deve ter no máximo 800 caracteres",
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
  images: z.array(z.custom<File>()).optional(),
  hasVariations: z.boolean().optional(),
  hasPromoPrice: z.boolean().optional(),
  promoPrice: z.number().optional(),
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
    })).max(LIMITS.FREE.MAX_OPTIONS_PER_VARIATION, {
      message: "A variação pode ter no máximo 10 opções",
    }),
  }))
}).superRefine(({ price, promoPrice, hasPromoPrice }, ctx) => {
  if (!hasPromoPrice) return

  if(!promoPrice || promoPrice <= 0) {
    ctx.addIssue({
      code: "custom",
      message: "O preço promocional é obrigatório",
      path: ["promoPrice"]
    });
    return 
  }
  if (promoPrice >= price) {
    ctx.addIssue({
      code: "custom",
      message: "O preço promocional deve ser menor que o preço original",
      path: ["promoPrice"]
    });
  }
})

export type NewProductFormData = z.infer<typeof newProductFormSchema>

function NewProduct() {
  const router = useRouter()
  const { company, currentSubscription } = useCompany()
  const subscriptionIsValid = isSubscriptionValid(currentSubscription!)

  const companyId = company?.id

  const methods = useForm<NewProductFormData>({
    resolver: zodResolver(newProductFormSchema),
    defaultValues: {
      price: 0,
      promoPrice: 0,
      variations: [],
    }
  })

  const { control, handleSubmit, reset, setValue, setError, formState: { isSubmitting, isDirty }} = methods

  const queryClient = useQueryClient()

  const [productId, setProductId] = useState("");
  const [showCreateStockModal, setShowCreateStockModal] = useState(false)

  const { mutateAsync: handleCreateProduct } = useMutation((data: CreateProductDto) => toast.promise(createProduct(data, companyId!), {
    loading: 'Criando produto...',
    success: 'Produto criado com sucesso!',
    error: (err) => err.response?.data?.message || 'Erro ao criar produto'
  }), {
    onSuccess: (createdProduct) => {
      reset()
      queryClient.invalidateQueries(productsKey.all)
      setProductId(createdProduct.id)

      if(subscriptionIsValid) {
        setShowCreateStockModal(true)
      } else {
        router.push('/company/dashboard/products')
      }
    }
  })

  const onSubmit = async (data: NewProductFormData) => {
    try {
      if(!subscriptionIsValid && data.variations.length > LIMITS.FREE.MAX_VARIATIONS_PER_PRODUCT) {
        setError('variations', {
          message: `Você atingiu o limite de ${LIMITS.FREE.MAX_VARIATIONS_PER_PRODUCT} variação por produto no plano gratuito.`
        })
        return
      } else if (data.variations.length > LIMITS.PREMIUM.MAX_VARIATIONS_PER_PRODUCT) {
        setError('variations', {
          message: `Você atingiu o limite de ${LIMITS.PREMIUM.MAX_VARIATIONS_PER_PRODUCT} variações por produto.`
        })
        return
      }

      await handleCreateProduct({
        categoryId: data.category?.value,
        description: data.description,
        images: data.images,
        name: data.name,
        price: data.price / 100,
        promoPrice: data?.promoPrice ? data.promoPrice / 100 : undefined,
        variations: data.variations?.length > 0 ? data.variations?.map(variation => ({
          name: variation.name,
          options: variation.options.map(option => option.value),
        })) : undefined
      })
    } catch {}
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
  const hasPromoPrice = !!methods.watch('hasPromoPrice')

  useEffect(() => {
    if(!hasVariations) {
      setValue('variations', [])
    }
  }, [hasVariations, setValue])

  useEffect(() => {
    if(!hasPromoPrice) {
      setValue('promoPrice', 0)
    }
  }, [hasPromoPrice, setValue])

  const maxImages = subscriptionIsValid ? LIMITS.PREMIUM.MAX_IMAGES_PER_PRODUCT : LIMITS.FREE.MAX_IMAGES_PER_PRODUCT;

  return (
    <>
      <DashboardSEO title="Adicionar Produto" />

      <PageTitle title="Adicionar Produto">
        <Link passHref href={previousPath}>
          <Button size="SMALL" variant="OUTLINE">
            <FiArrowLeft />
            Voltar
          </Button>
        </Link>
      </PageTitle>

      <ConfirmationDialog
        show={showCreateStockModal}
        title="Deseja controlar o estoque?"
        description="Você poderá adicionar o controle de estoque para este produto mais tarde, caso deseje."
        onConfirm={() => router.push(`/company/dashboard/stock?productId=${productId}`)}
        onCancel={() => router.push("/company/dashboard/products")}
      />

      <FormProvider {...methods}>
        <form className="grid bg-slate-100 rounded grid-cols-1 gap-6 p-4 lg:gap-16 lg:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6">Informações do Produto</h4>
            
              <div className="flex flex-col gap-4">
                <ControlledInput control={control} fieldName="name" label="Nome do Produto" placeholder="Camiseta" />
                <ControlledEditor control={control} fieldName="description" label="Descrição do Produto" />
                <div className={clsx({
                  "grid grid-cols-2 gap-2": hasPromoPrice,
                })}>
                  <ControlledCurrencyInput control={control} fieldName="price" label="Preço do Produto" />
                  {hasPromoPrice && (
                    <ControlledCurrencyInput control={control} fieldName="promoPrice" label="Preço Promocional" />
                  )}
                </div>

                <div className="my-2">
                  <ControlledCheckbox fieldName="hasPromoPrice" control={control} label="O produto possui está em promoção?" />
                </div>

                <ControlledSelect isClearable control={control} fieldName="category" label="Categoria (Opcional)" options={categoriesOptions} />

                <div className="mt-2">
                  <ControlledCheckbox fieldName="hasVariations" control={control} label="O produto possui variações?" />
                </div>

              </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6">Fotos do Produto</h4>
            <ControlledFileUpload control={control} fieldName="images" withPreview isMultiple maxFiles={maxImages} acceptedTypes={IMAGE_TYPES} maxSize={IMAGE_MAX_SIZE} />
            
            {hasVariations && <ProductVariations />}
          </div>

          <Button isLoading={isSubmitting} type="submit" className="col-span-full ml-auto">Criar Produto</Button>
        </form>
      </FormProvider>
    </>
  )
}

export const getServerSideProps = withAuth(async (context) => {
  return { props: {} };
});

export default NewProduct;