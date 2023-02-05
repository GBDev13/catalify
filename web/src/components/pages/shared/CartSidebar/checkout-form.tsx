import { ControlledPhoneInput } from "src/components/ui/PhoneInput/controlled"
import { useForm } from "react-hook-form"
import { ControlledInput } from "src/components/ui/Input/controlled"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { createOrder, OrderProduct } from "src/services/catalog"
import { useCatalog } from "src/store/catalog"
import { useCart } from "src/store/cart"
import { checkoutCartToWhatsApp } from "src/helpers/checkout-cart-to-whatsapp"
import { openWhatsAppMessage } from "src/helpers/open-whatsapp-message"
import { ReactNode, useEffect, useState } from "react"
import { CatalogDialog } from "../../catalog/catalog-dialog"
import { FaWhatsapp } from "react-icons/fa"

const checkoutFormSchema = z.object({
  name: z.string({
    required_error: 'Nome é obrigatório'
  }).max(100, {
    message: 'Nome deve ter no máximo 100 caracteres'
  }),
  phone: z.string({
    required_error: 'Celular é obrigatório'
  }).min(1, {
    message: 'Celular é obrigatório'
  })
})

type CheckoutFormData = z.infer<typeof checkoutFormSchema>

type CheckoutFormProps = {
  step: number
  setStep: (step: number) => void
  setOpen: (open: boolean) => void
}

export const CheckoutForm = ({ step, setStep, setOpen }: CheckoutFormProps) => {
  const { slug } = useCatalog(state => state.info)
  const { cartItems, resetCart } = useCart()

  const { control, handleSubmit, formState: { isSubmitting }, watch, reset } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema)
  });

  useEffect(() => {
    if (step === 1) {
      const userInfo = localStorage.getItem('catalify:userInfo')
      if (userInfo) {
        const { name, phone } = JSON.parse(userInfo)
        reset({ name, phone })
      }
    }
  }, [reset, step])

  const name = watch('name')
  const phone = watch('phone')

  const { mutateAsync: handleCheckout, data: orderId } = useMutation(({ buyerName, buyerPhone, products }: { buyerName: string; buyerPhone: string; products: OrderProduct[] }) => toast.promise(createOrder(slug, buyerName, buyerPhone, products), {
    loading: 'Criando pedido...',
    success: 'Pedido Criando com sucesso!',
    error: (err) => {
      const error = err as any
      const invalidQuantity = error.response?.data?.invalidQuantity ?? []
      setOpen(false)
      if(invalidQuantity.length > 0) {
        const productsOutOfStock = cartItems.filter(cartItem => error.response.data.invalidQuantity.includes(cartItem.id))
        return `Alguns produtos não estão mais disponíveis no estoque, verifique os produtos: ${productsOutOfStock.map(product => product.name).join(', ')}`;
      }
      return 'Erro ao criar pedido'
    }
  }), {
    onSuccess: (orderId, variables) => {
      localStorage.setItem('catalify:userInfo', JSON.stringify({ name, phone }))
      const message = checkoutCartToWhatsApp(slug, orderId, variables.buyerName)
      openWhatsAppMessage(message)
      setStep(2)
      resetCart()
    },
  })

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      await handleCheckout({
        buyerName: data.name,
        buyerPhone: data.phone,
        products: cartItems.map(cartItem => ({
          name: cartItem.name,
          price: cartItem.price,
          productId: cartItem.id,
          promoPrice: cartItem?.promoPrice,
          quantity: cartItem.quantity,
          selectedVariants: cartItem?.variants?.map(variant => variant.optionId)
        }))
      })
    } catch {}
  }

  const handleOpenWhatsapp = () => {
    const message = checkoutCartToWhatsApp(slug, orderId, name)
    openWhatsAppMessage(message)
  }

  if(step === 2) return (
    <div className="flex flex-col text-center gap-4">
      <p className="text-lg text-gray-500">Prossiga para o Whatsapp para finalizar o pedido!</p>
      <button onClick={handleOpenWhatsapp} className="bg-whatsapp text-white flex justify-center items-center gap-1.5 py-2 rounded-md">
        <FaWhatsapp size={20} />
        Abrir Whatsapp
      </button>
    </div>
  )

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <ControlledInput control={control} fieldName="name" label="Nome" />
      <ControlledPhoneInput control={control} fieldName="phone" label="Celular" />
      <button type="submit" className="bg-primary text-readable py-2 rounded-md text-sm mt-4" disabled={isSubmitting}>Prosseguir</button>
    </form> 
  )
}

type CheckoutFormDialogProps = {
  children: ReactNode
}

export const CheckoutFormDialog = ({ children }: CheckoutFormDialogProps) => {
  const [step, setStep] = useState(1)

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if(!open) setStep(1)
  }, [open])

  return (
    <CatalogDialog open={open} onOpenChange={setOpen} content={<CheckoutForm step={step} setStep={setStep} setOpen={setOpen} />} title={step === 1 ? "Preencha para prosseguir" : "Pedido criado!"} maxWidth="600px">
      {children}
    </CatalogDialog>
  )
}