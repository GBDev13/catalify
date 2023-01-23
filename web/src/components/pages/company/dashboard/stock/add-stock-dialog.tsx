import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { useEffect, useMemo } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { Button } from "src/components/ui/Button"
import { Dialog } from "src/components/ui/Dialog"
import { Input } from "src/components/ui/Input"
import { ControlledSelect } from "src/components/ui/Select/controlled"
import { stockKeys } from "src/constants/query-keys"
import { getStockOptions } from "src/services/stock"
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
    stockVariantId: z.string().optional(),
    stockOptionId: z.string().optional(),
    quantity: z.number()
  }))
})

type AddStockFormType = z.infer<typeof addStockFormSchema>

const AddStockForm = () => {
  const { company } = useCompany()
  const companyId = company?.id!;

  const { data: stockOptions } = useQuery(stockKeys.stockOptions(companyId), () => getStockOptions(companyId), {
    enabled: !!companyId
  })

  const { control, handleSubmit, watch, register, formState: { errors }, setValue } = useForm<AddStockFormType>({
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
    if(!selectedProduct) return;

    setValue('stockQuantity', [])
    if(selectedProduct?.variants?.length) {
      selectedProduct?.variants?.forEach((item) => {
        item?.options?.forEach((option) => {
          append({
            stockVariantId: item.id,
            optionName: option.name,
            stockOptionId: option.id,
            quantity: 0
          })
        })
      })
    } else {
      append({
        optionName: 'Quantidade de estoque',
        stockVariantId: selectedProduct?.id!,
        quantity: 0
      })
    }
  }, [append, selectedProduct, setValue, stockOptions])

  const selectedProductHasVariants = selectedProduct?.variants && selectedProduct?.variants?.length > 0;

  const onSubmit = (data: AddStockFormType) => {
    console.log(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

      <section className="grid grid-cols-2 gap-2 my-4">
        {selectedProductHasVariants && <h3 className="text-sm text-slate-600 col-span-full mb-4">Selecione a quantidade de estoque para cada variação</h3>}

        {fields.map((item, index) => {
          return (
            <>
              {index === 0 && (
                <h4 className="col-span-full text-slate-500 text-sm">
                  {selectedProduct?.variants.find(x => x.options.find(y => y.id === item.stockOptionId))?.name}</h4>
              )}
              <div key={item.id} className={clsx({
                "col-span-2": !selectedProductHasVariants
              })}>
                <Input
                  label={item.optionName}
                  placeholder="Ex: https://www.instagram.com"
                  {...register(`stockQuantity.${index}.quantity` as const, {
                    valueAsNumber: true
                  })}
                  className="w-full"
                  defaultValue={item.quantity}
                  error={errors.stockQuantity?.[index]?.quantity}
                />
              </div>
            </>
          );
        })}
      </section>

      <Button type="submit" size="WIDE">Adicionar</Button>
    </form>
  )
}

export const AddStockDialog = () => {
  return (
    <Dialog title="Adicionar estoque" maxWidth="600px" content={<AddStockForm />}>
      <Button>
        Adicionar estoque
      </Button>
    </Dialog>
  )
}