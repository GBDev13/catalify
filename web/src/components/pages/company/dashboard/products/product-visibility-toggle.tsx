import { useMutation, useQueryClient } from "@tanstack/react-query"
import clsx from "clsx"
import { Tooltip } from "src/components/ui/Tooltip"
import { productsKey } from "src/constants/query-keys"
import { toggleVisibility } from "src/services/products"
import { useCompany } from "src/store/company"

type ProductVisibilityToggleProps = {
  isVisible: boolean,
  productId: string
}

export const ProductVisibilityToggle = ({ isVisible, productId }: ProductVisibilityToggleProps) => {
  const { company } = useCompany()
  const companyId = company?.id!

  const queryClient = useQueryClient()

  const { mutate: handleToggleVisibility, isLoading } = useMutation(() => toggleVisibility(productId, companyId), {
    onSuccess: () => {
      queryClient.setQueryData<Products.Product[]>(productsKey.all, (oldData) => {
        return oldData?.map(item => {
          if(item.id === productId) {
            return {
              ...item,
              isVisible: !item.isVisible
            }
          }
          return item
        })
      })
    }
  })

  return (
    <Tooltip content={isVisible ? "Clique para esconder o produto no catálogo" : "Clique para mostrar o produto no catálogo"}>
      <button disabled={isLoading} onClick={() => handleToggleVisibility()} className={clsx("w-6 h-6 border-2 border-green-200 rounded-full bg-green-400", {
        "bg-red-400 border-red-200": !isVisible,
      })}>

      </button>
    </Tooltip>
  )
}