import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
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
import { ActionType, ChangeType, onChangeExistentVariation, parseEditedVariations, SaveItem } from "src/helpers/on-change-existent-variations";
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
  })).max(10, {
    message: "A variação pode ter no máximo 10 opções",
  }),
})).max(5, {
  message: "O produto pode ter no máximo 5 variações",
})

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
  variations: variationsSchema
})

export type EditProductFormData = z.infer<typeof editProductFormSchema>

export default function EditProduct() {
  const router = useRouter()
  const { company } = useCompany()
  const companyId = company?.id

  const productId = String(router?.query?.id ?? '');

  const methods = useForm<EditProductFormData>({
    resolver: zodResolver(editProductFormSchema),
    defaultValues: {
      price: 0,
      variations: [],
    }
  })

  const { control, handleSubmit, reset, formState: { isSubmitting, isDirty } } = methods

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
        variations: data.variants?.map(variant => ({
          name: variant.name,
          originalId: variant.id,
          options: variant.options?.map(option => ({
            originalId: option.id,
            value: option.name,
          }))
        })) ?? [],
        images: await Promise.all(data.pictures.map(async (picture) => {
          return urlToFile(picture.url, picture.id)
        }))
      });
    }
  });

  const queryClient = useQueryClient()

  const { mutateAsync: handleEditProduct } = useMutation((data: EditProductDto) => toast.promise(editProduct(productId, companyId!, data), {
    loading: 'Editando produto...',
    success: 'Produto editado com sucesso!',
    error: 'Erro ao editar produto',
  }), {
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(productsKey.all)
      queryClient.invalidateQueries(productsKey.single(productId))
      router.push('/company/dashboard/products')
    }
  })

  const [variationsChangesToSave, setVariationsChangesToSave] = useState<SaveItem[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])

  const onSubmit = async (data: EditProductFormData) => {
    if (!isDirty) {
      router.push('/company/dashboard/products')
      return
    }

    const removedAllVariations = product?.variants?.length && !data.hasVariations;
    await handleEditProduct({
      ...data,
      price: data.price / 100,
      variations: removedAllVariations ? {
        added: [], edited: [], removed: product.variants.map(x => ({
          id: x.id,
          actionType: 'remove',
          type: 'variation'
        }))
      } : parseEditedVariations(variationsChangesToSave, data.variations),
      images: data.images.filter(image => !removedImages.includes(image.name) && !product?.pictures.some(x => x.id === image.name)),
      imagesToRemove: removedImages,
      categoryId: data?.category?.value ?? undefined
    })
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

  return (
    <>
      <PageTitle title="Editar Produto">
        <Link passHref href="../">
          <Button size="SMALL" variant="OUTLINE">
            <FiArrowLeft />
            Voltar
          </Button>
        </Link>
      </PageTitle>

      {isLoadingProduct ? <p>carregando</p> : (
        <FormProvider {...methods}>
          <form className="grid bg-slate-100 rounded grid-cols-1 gap-6 p-4 md:p- lg:gap-16 lg:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6">Informações do Produto</h4>

              <div className="flex flex-col gap-4">
                <ControlledInput control={control} fieldName="name" label="Nome do Produto" placeholder="Camiseta" />
                <ControlledEditor initialContent={product?.description} control={control} fieldName="description" label="Descrição do Produto" />
                <ControlledCurrencyInput control={control} fieldName="price" label="Preço do Produto" />
                <ControlledSelect isClearable control={control} fieldName="category" label="Categoria (Opcional)" options={categoriesOptions} />

                <div className="mt-2">
                  <ControlledCheckbox fieldName="hasVariations" control={control} label="O produto possui variações?" />
                </div>

              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-2xl font-semibold text-slate-500 border-b border-b-slate-300 pb-4 mb-6">Fotos do Produto</h4>
              <ControlledFileUpload control={control} fieldName="images" onRemove={handleRemoveImage} withPreview isMultiple maxFiles={4} acceptedTypes={{
                'image/jpeg': ['image/jpeg'],
                'image/jpg': ['image/jpg'],
                'image/png': ['image/png'],
                'image/webp': ['image/webp'],
              }} maxSize={5242880} />

              {hasVariations && <ProductVariations onChangeExistent={handleChangeExistentVariation} />}
            </div>

            <Button isLoading={isSubmitting} type="submit" className="col-span-full ml-auto">Editar Produto</Button>
          </form>
        </FormProvider>
      )}
    </>
  )
}