import { FaCartArrowDown, FaTrash, FaWhatsapp } from "react-icons/fa"
import { FiShoppingBag } from "react-icons/fi"
import { formatPrice } from "src/helpers/format-price"
import { useCart } from "src/store/cart"
import { RiCloseCircleFill } from 'react-icons/ri'
import { motion, AnimatePresence } from "framer-motion"
import { CheckoutFormDialog } from "./checkout-form"
import Link from "next/link"
import { useCatalog } from "src/store/catalog"

const CartSidebar = () => {
  const { cartItems, cartIsOpen, removeProductById, setCartIsOpen } = useCart()

  const total = cartItems.reduce((acc, item) => {
    const price = item?.promoPrice ?? item?.price;
    return acc + (price * item.quantity)
  }, 0)

  const formattedTotal = formatPrice(total)

  const isDisabled = cartItems.length <= 0

  const { slug } = useCatalog(state => state.info)

  return (
    <AnimatePresence>
      {cartIsOpen && (
        <motion.aside
          className="right-0 fixed h-screen w-screen max-w-[440px] bg-white shadow-xl z-10 flex flex-col"
          initial={{
            x: 400,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          exit={{
            x: 400,
            opacity: 0,
          }}
          transition={{
            duration: 0.3
          }}
        >
          <div className="border-b p-4 flex items-center justify-between mb-6">
            <h2 className="text-2xl flex items-center gap-2 text-gray-500 font-semibold">
              <FiShoppingBag className="text-primary" />
              Carrinho
            </h2>

            <button onClick={() => setCartIsOpen(false)} className='text-gray-400 hover:text-primary transition-colors'>
              <RiCloseCircleFill size={30} />
            </button>
          </div>

          <span className="px-4 text-xs text-gray-400 text-center mb-2 block">
            Os preços podem sofrer alterações. Por favor, verifique o preço antes de realizar a compra.
          </span>

          {cartItems.length <= 0 && (
            <div className="flex flex-col items-center justify-center mt-10">
              <FaCartArrowDown size={80} className="text-primary" />
              <span className="text-gray-400 font-semibold text-center mt-4">Seu carrinho está vazio</span>
            </div>
          )}

          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-3">
            {cartItems.map((item, index) => {
              const formattedPrice = formatPrice(item?.promoPrice ?? item?.price);

              return (
                <div key={`cart-item-${index}`} className="flex gap-2">
                  <img className="w-20 h-20 border border-gray-100 rounded-md object-cover" src={item?.picture ?? "/images/product-placeholder.svg"} />
      
                  <div className="flex flex-col">
                    <Link href={`/produtos/${item.slug}`} className="font-normal text-gray-500 line-clamp-2 hover:text-primary transition-colors">{`${item.quantity} x ${item.name}`}</Link>
                    {item?.variants && (
                      <span className="text-xs text-gray-400">
                        {item.variants.map(variant => variant.option).join(' - ')}
                      </span>
                    )}
                    <span className="text-primary font-semibold">{formattedPrice}</span>
                  </div>

                  <button onClick={() => removeProductById(item.cartId)} className="ml-auto text-gray-400 hover:text-primary transition-colors">
                    <FaTrash />
                  </button>
                </div>
              )
            })}
          </div>

          <footer className="mt-auto">
            <div className="border-y p-4 flex items-center justify-between">
              <span>Total</span>
              <strong className="text-primary font-semibold">{formattedTotal}</strong>
            </div>
            <div className="p-4">

            <CheckoutFormDialog>
              <button disabled={isDisabled} className="bg-whatsapp disabled:opacity-50 disabled:brightness-90 disabled:cursor-not-allowed text-white justify-center flex items-center w-full gap-2 py-3 px-6 rounded-md hover:brightness-105 transition-all">
                <FaWhatsapp size={20} />
                Finalizar compra
              </button>
            </CheckoutFormDialog>

            </div>
          </footer>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default CartSidebar