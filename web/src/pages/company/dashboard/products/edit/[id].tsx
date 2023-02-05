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
import { Spinner } from "src/components/ui/Spinner";
import { IMAGE_MAX_SIZE, IMAGE_TYPES, LIMITS } from "src/constants/constants";
import { productsKey } from "src/constants/query-keys";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { ActionType, ChangeType, onChangeExistentVariation, ParseEditedResponse, parseEditedVariations, SaveItem } from "src/helpers/on-change-existent-variations";
import { urlToFile } from "src/helpers/url-to-file";
import { useUnsavedChangesWarning } from "src/hooks/useUnsavedChangesWarning";
import { editProduct, EditProductDto, getCategories, getProductById } from "src/services/products";
import { useCompany } from "src/store/company";
import { z } from "zod";

export const variationsSchema = z.array(z.object({
  originalId: z.string().optional(),
  name: z.string({
    required_error: "O nome da variação é obrigatório",
  }).min(3, {
    message: "O nome da variação deve ter no mínimo 3 caracteres",
  }).max(50, {
    message: "O nome da variação deve ter no máximo 50 caracteres",
  }),
  options: z.array(z.object({
    originalId: z.string().optional(),
    value: z.string({
      required_error: "O valor da opção é obrigatório",
    }).min(1, {
      message: "O nome da variação deve ter no mínimo 3 caracteres",
    }).max(50, {
      message: "O nome da variação deve ter no máximo 50 caracteres",
    }),
  }))
  .max(LIMITS.FREE.MAX_OPTIONS_PER_VARIATION, {
    message: "A variação pode ter no máximo 10 opções",
  }),
}))

const editProductFormSchema = z.object({
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
  variations: variationsSchema
}).superRefine(({ price, promoPrice, hasPromoPrice }, ctx) => {
  if(!hasPromoPrice) return;

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

export type EditProductFormData = z.infer<typeof editProductFormSchema>

export default function EditProduct() {
  const router = useRouter()
  const { company, currentSubscription } = useCompany()
  const subscriptionIsValid = isSubscriptionValid(currentSubscription!)
  const companyId = company?.id

  const productId = String(router?.query?.id ?? '');

  const methods = useForm<EditProductFormData>({
    resolver: zodResolver(editProductFormSchema),
    defaultValues: {
      price: 0,
      variations: [],
    }
  })

  const { control, handleSubmit, reset, setValue, formState: { isSubmitting, isDirty } } = methods

  const { isFetching: isLoadingProduct, data: product } = useQuery(productsKey.single(productId!), () => getProductById(productId!), {
    enabled: !!productId && !!company,
    onSuccess: async (data) => {
      reset({
        name: data.name,
        description: data.description,
        price: Math.trunc(Math.abs(data.price * 100)),
        category: data?.category ? {
          value: data.category.id,
          label: data.category.name,
        } : undefined,
        hasVariations: !!data.variants?.length,
        hasPromoPrice: !!data.promoPrice,
        promoPrice: data?.promoPrice ? Math.trunc(Math.abs(data.promoPrice * 100)) : 0,
        variations: data.variants?.map(variant => ({
          name: variant.name,
          originalId: variant.id,
          options: variant.options?.map(option => ({
            originalId: option.id,
            value: option.name,
          }))
        })) ?? [],
        images: data?.pictures?.length ? await Promise.all(data.pictures.map(async (picture) => {
          return urlToFile(picture.url, picture.id)
        })) : []
      });
    }
  });

  const queryClient = useQueryClient()

  const [showEditStockModal, setShowEditStockModal] = useState(false)

  const { mutateAsync: handleEditProduct } = useMutation((data: EditProductDto) => toast.promise(editProduct(productId, companyId!, data), {
    loading: 'Editando produto...',
    success: 'Produto editado com sucesso!',
    error: (err) => err?.response?.data?.message ?? 'Erro ao editar produto. Tente novamente mais tarde.'
  }), {
    onSuccess: (_, variables) => {
      
      const variationsIsEmpty = Object.keys(variables?.variations ?? {}).map(key => (variables?.variations ?? {})[key as keyof ParseEditedResponse]).every(value => !value?.length)

      reset()
      queryClient.invalidateQueries(productsKey.all)
      queryClient.invalidateQueries(productsKey.single(productId))

      if(!variationsIsEmpty && subscriptionIsValid) {
        setShowEditStockModal(true)
        return
      }
      router.push('/company/dashboard/products')
    }
  })

  const [variationsChangesToSave, setVariationsChangesToSave] = useState<SaveItem[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])

  const onSubmit = async (data: EditProductFormData) => {
    try {
      if (!isDirty) {
        router.push('/company/dashboard/products')
        return
      }
  
      const removedAllVariations = product?.variants?.length && !data.hasVariations;
      await handleEditProduct({
        ...data,
        price: data.price / 100,
        promoPrice: data?.promoPrice ? data.promoPrice / 100 : undefined,
        variations: removedAllVariations ? {
          added: [], edited: [], removed: product.variants.map(x => ({
            id: x.id,
            actionType: 'remove',
            type: 'variation'
          }))
        } : parseEditedVariations(variationsChangesToSave, data.variations),
        images: data?.images ? data.images.filter(image => !removedImages.includes(image.name) && !product?.pictures?.some(x => x.id === image.name)) : undefined,
        imagesToRemove: removedImages,
        categoryId: data?.category?.value ?? undefined
      })
    } catch {}
  }

  const { data: categories } = useQuery(productsKey.categories, () => getCategories(companyId!), {
    enabled: !!companyId
  })

  const categoriesOptions = useMemo(() => {
    if (!categories) return []

    return categories.map(category => ({
      value: category.id,
      label: category.name,
    }))
  }, [categories])

  useUnsavedChangesWarning(isDirty && !isSubmitting)

  const hasVariations = !!methods.watch('hasVariations')
  const hasPromoPrice = !!methods.watch('hasPromoPrice')

  const handleChangeExistentVariation = (type: ChangeType, actionType: ActionType, fieldId: string) => {
    onChangeExistentVariation({
      type,
      actionType,
      fieldId,
      saveFunction: setVariationsChangesToSave,
      allVariations: product?.variants ?? []
    })
  }

  const handleRemoveImage = (image: File) => {
    const isUploadedImage = product?.pictures?.find(picture => picture.id === image.name)
    if (isUploadedImage) {
      setRemovedImages(old => [...old, image.name])
    }
  }

  useEffect(() => {
    if(!hasPromoPrice) {
      setValue('promoPrice', 0)
    }
  }, [hasPromoPrice, setValue])

  const maxImages = subscriptionIsValid ? LIMITS.PREMIUM.MAX_IMAGES_PER_PRODUCT : LIMITS.FREE.MAX_IMAGES_PER_PRODUCT;

  return (
    <>
      <DashboardSEO title="Editar Produto" />

      <PageTitle title="Editar Produto">
        <Link passHref href="../">
          <Button size="SMALL" variant="OUTLINE">
            <FiArrowLeft />
            Voltar
          </Button>
        </Link>
      </PageTitle>

      <ConfirmationDialog
        show={showEditStockModal}
        title="Deseja editar o estoque?"
        description="Você alterou as variações do produto, deseja alterar também a quantidade do estoque?"
        onConfirm={() => router.push(`/company/dashboard/stock?productId=${productId}`)}
        onCancel={() => router.push("/company/dashboard/products")}
      />

      {isLoadingProduct ? <Spinner /> : (
        <FormProvider {...methods}>
          <form className="grid bg-slate-100 rounded grid-cols-1 gap-6 p-4 md:p- lg:gap-16 lg:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6">Informações do Produto</h4>

              <div className="flex flex-col gap-4">
                <ControlledInput control={control} fieldName="name" label="Nome do Produto" placeholder="Camiseta" />
                <ControlledEditor initialContent={product?.description} control={control} fieldName="description" label="Descrição do Produto" />

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
              <ControlledFileUpload control={control} fieldName="images" onRemove={handleRemoveImage} withPreview isMultiple maxFiles={maxImages} acceptedTypes={IMAGE_TYPES} maxSize={IMAGE_MAX_SIZE} />

              {hasVariations && <ProductVariations onChangeExistent={handleChangeExistentVariation} />}
            </div>

            <Button isLoading={isSubmitting} type="submit" className="col-span-full ml-auto">Editar Produto</Button>
          </form>
        </FormProvider>
      )}
    </>
  )
}