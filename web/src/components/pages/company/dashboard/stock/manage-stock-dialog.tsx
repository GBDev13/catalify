import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import clsx from "clsx"
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Button } from "src/components/ui/Button"
import { Dialog } from "src/components/ui/Dialog"
import { Input } from "src/components/ui/Input"
import { ControlledSelect } from "src/components/ui/Select/controlled"
import { companyKeys, stockKeys } from "src/constants/query-keys"
import { createProductStock, getProductStock, getStockOptions, StockDto, updateProductStock, UpdateStockDto } from "src/services/stock"
import { useCompany } from "src/store/company"
import { z } from "zod"

const addStockFormSchema = z.object({
  product: z.object({
    label: z.string(),
    value: z.string()
  }, {
    required_error: "Selecione um produto"
  }),
  stockQuantity: z.array(z.object({
    optionName: z.string(),
    stockVariantId1: z.string().optional(),
    stockVariantId2: z.string().optional(),
    stockOptionId1: z.string().optional(),
    stockOptionId2: z.string().optional(),
    productStockId: z.string().optional(),
    quantity: z.number({
      invalid_type_error: "Quantidade inválida",
    }).min(0, {
      message: "Quantidade inválida"
    }),
  }))
})

type AddStockFormType = z.infer<typeof addStockFormSchema>

type AddStockFormProps = {
  selectedProductId?: string
  onSuccess: () => void
}

const AddStockForm = ({ selectedProductId, onSuccess }: AddStockFormProps) => {
  const [isEditing, setIsEditing] = useState(!!selectedProductId)

  const { company } = useCompany()
  const companyId = company?.id!;

  const { data: stockOptions } = useQuery(stockKeys.stockOptions(companyId), () => getStockOptions(companyId), {
    enabled: !!companyId
  })

  const { control, handleSubmit, watch, register, formState: { errors, isSubmitting, isDirty, dirtyFields }, reset, setValue } = useForm<AddStockFormType>({
    resolver: zodResolver(addStockFormSchema)
  })

  const selectOptions = stockOptions?.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })

  const selectedProductOption = watch('product')

  const { fields, append } = useFieldArray({
    control,
    name: 'stockQuantity'
  });

  const selectedProduct = useMemo(() => {
    return stockOptions?.find(x => x.id === selectedProductOption?.value)
  }, [selectedProductOption?.value, stockOptions])

  useEffect(() => {
    if(!selectedProduct || isEditing) return;

    setValue('stockQuantity', [])
    if(selectedProduct?.variants?.length) {
      const variantOne = selectedProduct?.variants[0]
      const variantTwo = selectedProduct?.variants?.[1]

      if(variantTwo) {
        variantOne?.options?.forEach((optionOne) => {
          variantTwo?.options?.forEach((optionTwo) => {
            append({
              stockVariantId1: variantOne.id,
              stockVariantId2: variantTwo.id,
              stockOptionId1: optionOne.id,
              stockOptionId2: optionTwo.id,
              quantity: 0,
              optionName: `${optionOne.name} - ${optionTwo.name}`
            })
          })
        })
        return
      }

      variantOne?.options?.forEach((optionOne) => {
        append({
          stockVariantId1: variantOne.id,
          stockOptionId1: optionOne.id,
          quantity: 0,
          optionName: optionOne.name
        })
      })
      
    } else {
      append({
        optionName: 'Quantidade de estoque',
        quantity: 0,
      })
    }
  }, [append, isEditing, selectedProduct, setValue, stockOptions])

  const queryClient = useQueryClient()

  const { mutateAsync: handleCreateStock } = useMutation((dto: StockDto) => toast.promise(createProductStock(companyId!, selectedProduct?.id!, dto), {
    error: 'Erro ao adicionar estoque',
    loading: 'Adicionando estoque',
    success: 'Estoque adicionado com sucesso'
  }), {
    onSuccess: () => {
      queryClient.invalidateQueries(companyKeys.companyStock(companyId))
      onSuccess()
    }
  })

  const { mutateAsync: handleUpdateStock } = useMutation(({ id, dto }: { id: string; dto: UpdateStockDto }) => toast.promise(updateProductStock(companyId!, id, dto), {
    error: 'Erro ao atualizar estoque',
    loading: 'Atualizando estoque',
    success: 'Estoque atualizado com sucesso'
  }), {
    onSuccess: () => {
      queryClient.invalidateQueries(stockKeys.productStock(companyId, selectedProductId!))
      queryClient.invalidateQueries(companyKeys.companyStock(companyId))
      onSuccess()
    }
  })

  const { data: productStock, isFetched } = useQuery(stockKeys.productStock(companyId, selectedProductId!), () => getProductStock(companyId, selectedProductId!), {
    enabled: !!selectedProductId && !!companyId,
    onSuccess: (data) => {
      setValue('stockQuantity', [])

      if(!data.length) {
        setIsEditing(false)
        return
      }

      const hasVariants = !data.every(x => (!x.productVariantOptionId && !x.productVariantOptionId2));
      if(!hasVariants) {
        reset({
          product: {
            label: "",
            value: data[0].productId
          },
          stockQuantity: [{
              optionName: 'Quantidade de estoque',
              quantity: data[0].quantity,
              productStockId: data[0].id,
            }
          ]
        })
        return
      }

      const sortedData = data.sort((a, b) => {
        const aDate = new Date(a.productVariantOption?.createdAt!)
        const bDate = new Date(b.productVariantOption?.createdAt!)

        return aDate.getTime() - bDate.getTime()
      })

      reset({
        product: {
          label: "",
          value: selectedProductId
        },
        stockQuantity: sortedData.map((x, index) => ({
          optionName: [x.productVariantOption?.name, x?.productVariantOption2?.name].filter(Boolean).join(' - '),
          productStockId: x.id,
          quantity: x.quantity,
        }))
      })
    },
    onError: () => {
      setIsEditing(false)
    }
  })

  useEffect(() => {
    if(!isEditing && !!selectedProductId && isFetched) {
      const product = stockOptions?.find(x => x.id === selectedProductId)
      reset({
        product: {
          label: product?.name ?? "",
          value: selectedProductId
        },
        stockQuantity: []
      })
    }
  }, [isEditing, isFetched, reset, selectedProductId, stockOptions])

  const submitIsDisabled = isEditing ? isSubmitting : isSubmitting || !selectedProduct

  const selectedProductHasVariants = isEditing ? !productStock?.every(x => !!x.productVariantOptionId && !x.productVariantOptionId2) : selectedProduct?.variants && selectedProduct?.variants?.length > 0;

  const onSubmit = useCallback(async (data: AddStockFormType) => {
    if(!isEditing && !selectedProduct) return
    
    try {
      if(isEditing) {
        if(!isDirty) {
          onSuccess()
          return
        }

        const dirtyIndexes = dirtyFields.stockQuantity?.reduce((acc, item, index) => {
          if(item) {
            acc.push(index)
          }

          return acc
        }, [] as number[])

        const dirtyData = data.stockQuantity.filter((_, index) => dirtyIndexes?.includes(index))
        
        await handleUpdateStock({
          id: data.product.value,
          dto: {
            stockQuantity: dirtyData.map(x => ({
              quantity: x.quantity,
              productStockId: x.productStockId!,
            }))
          }
        })
        return
      }

      if (selectedProductHasVariants) {
        await handleCreateStock({
          stockQuantity: data.stockQuantity.map(x => ({
            quantity: x.quantity,
            stockOptionId1: x.stockOptionId1,
            stockOptionId2: x.stockOptionId2,
          }))
        })
        return
      }

      const product = data.stockQuantity[0]
      await handleCreateStock({
        stockQuantity: [{
          quantity: product.quantity,
        }]
      })
    } catch {}
  }, [dirtyFields.stockQuantity, handleCreateStock, handleUpdateStock, isDirty, isEditing, onSuccess, selectedProduct, selectedProductHasVariants])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!isEditing && (
        <ControlledSelect
          control={control}
          fieldName="product"
          label="Produto para adicionar"
          options={selectOptions}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 })
          }}
        />
      )}

      <section className={clsx("grid grid-cols-3 gap-2 my-4", {
        "mt-0": isEditing
      })}>
        {selectedProductHasVariants && <h3 className="text-sm text-slate-600 col-span-full mb-4">Selecione a quantidade de estoque para cada variação</h3>}

        {fields.map((item, index) => {
          return (
            <div key={item.optionName} className={clsx({
              "col-span-full": !selectedProductHasVariants
            })}>
              <Input
                label={item.optionName}
                {...register(`stockQuantity.${index}.quantity` as const, {
                  valueAsNumber: true
                })}
                className="w-full"
                defaultValue={item.quantity}
                error={errors.stockQuantity?.[index]?.quantity}
              />
            </div>
          );
        })}
      </section>

      <Button type="submit" size="WIDE" disabled={submitIsDisabled}>{isEditing ? "Salvar alterações" : "Adicionar"}</Button>
    </form>
  )
}

type ManageStockDialogProps = {
  children: ReactNode
  selectedProductId?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const ManageStockDialog = ({ open: initialOpen, onOpenChange, selectedProductId, children }: ManageStockDialogProps) => {
  const [modalOpen, setModalOpen] = useState(false)

  const open = initialOpen !== undefined ? initialOpen : modalOpen
  const setOpen = onOpenChange !== undefined ? onOpenChange : setModalOpen

  return (
    <Dialog open={open} onOpenChange={setOpen} title={!!selectedProductId ? "Editar estoque" : "Adicionar estoque"} maxWidth="750px" content={<AddStockForm selectedProductId={selectedProductId} onSuccess={() => setOpen(false)} />}>
      {children}
    </Dialog>
  )
}