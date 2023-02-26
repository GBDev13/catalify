import { useQuery } from "@tanstack/react-query";
import { MouseEvent, useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FeatureExplanation, SubscriptionRequiredDialog } from "src/components/pages/shared/SubscriptionRequiredDialog";
import { Button } from "src/components/ui/Button"
import { Popover } from "src/components/ui/Popover";
import { productsKey } from "src/constants/query-keys";
import { isSubscriptionValid } from "src/helpers/isSubscriptionValid";
import { getProductsVariantsToCopy } from "src/services/products";
import { useCompany } from "src/store/company";

type CopyVariantsContentProps = {
  onClose: () => void
  onCopy: (product: Products.ProductVariantToCopy) => void
}

type CopyVariantsPopoverProps = Omit<CopyVariantsContentProps, 'onClose'>

const CopyVariantsContent = ({ onClose, onCopy }: CopyVariantsContentProps) => {
  const { company, currentSubscription } = useCompany();
  const companyId = company?.id!;

  const { data: productsVariantsToCopy } = useQuery(productsKey.productsVariantsToCopy(companyId), () => getProductsVariantsToCopy(companyId), {
    enabled: !!companyId
  })

  const hasSubscription = isSubscriptionValid(currentSubscription!)

  const handleCopyVariants = (product: Products.ProductVariantToCopy) => {
    if(!hasSubscription) {
      toast.error('Você precisa estar em uma assinatura Premium para copiar variações de outros produtos.')
      return
    }
    onCopy(product)
    onClose()
  }

  return (
    <div className="min-w-[300px]">
      <p className="text-center mb-1 text-slate-500">Selecione um Produto</p>
      <div className="flex flex-col max-h-[150px] overflow-y-auto">
        {productsVariantsToCopy?.map(product => (
          <Button onClick={() => handleCopyVariants(product)} key={product.productName} type="button" variant="TEXT" size="WIDE" className="py-1 text-sm col-span-full justify-between">
            <strong className="font-semibold truncate block">
              {product.productName}
            </strong>
            <span className="text-xs text-slate-400">
              {`(${product.variants.length} ${product.variants.length === 1 ? 'variação' : 'variações'})`}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}

export const CopyVariantsPopover = ({ onCopy }: CopyVariantsPopoverProps) => {
  const [open, setOpen] = useState(false)

  const { currentSubscription } = useCompany();
  const hasSubscription = isSubscriptionValid(currentSubscription!)

  const [showSubscriptionRequiredDialog, setShowSubscriptionRequiredDialog] = useState<FeatureExplanation | null>(null)

  const handleClick = useCallback((e: MouseEvent) => {
    if(!hasSubscription) {
      e.preventDefault()
      e.stopPropagation()
      setShowSubscriptionRequiredDialog({
        title: 'Copiar Variações',
        description: "Com essa função, você pode economizar tempo e esforço ao criar novos produtos com variações semelhantes. Ao copiar as variações de um produto existente, você pode adicionar rapidamente novos produtos ao seu catálogo, sem precisar criar cada variação do zero.",
        videoUrl: "https://youtu.be/pRjHQd1hBPQ"
      })
    }
  }, [hasSubscription])

  return (
    <>
      <SubscriptionRequiredDialog open={showSubscriptionRequiredDialog} setOpen={setShowSubscriptionRequiredDialog} />
      <Popover open={open} onOpenChange={setOpen} side="top" content={<CopyVariantsContent onCopy={onCopy} onClose={() => setOpen(false)} />} className="!bg-slate-200 border border-slate-300 py-2.5">
        <Button onClick={handleClick} type="button" variant="OUTLINE" size="WIDE" className="min-h-0 py-2.5 text-sm col-span-full">
          Copiar variações de outro produto
        </Button>
      </Popover>
    </>
  )
}